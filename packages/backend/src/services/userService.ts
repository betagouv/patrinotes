import { addDays } from "date-fns";
import { Database, db } from "../db/db";

import { makeDebug } from "../features/debug";
import { AppError } from "../features/errors";
import crypto from "crypto";
import { sendPasswordResetMail } from "../features/mail";
import { Selectable } from "kysely";
import { adminAuthApi } from "../features/auth/keycloak";
import { transactions } from "../db/schema";
import { normalizeEmail } from "../features/email";
import { assertPasswordIsStrongEnough } from "../features/passwordPolicy";

const debug = makeDebug("user_service");
export class UserService {
  async changeService(userId: string, serviceId: string) {
    debug("Changing service for user", userId, "to", serviceId);
    const service = await db.selectFrom("service").where("id", "=", serviceId).selectAll().execute();
    if (!service[0]) {
      throw new AppError(400, "Le service n'existe pas");
    }

    const previous = await db.selectFrom("user").select("service_id").where("id", "=", userId).executeTakeFirst();
    const deptNumbers = service[0].dept_numbers?.split(",").map((num) => num.trim());

    // Joining any service is allowed (decision of 2026-11-04): each change is recorded in the audit log.
    // One transaction: the service and its departments (POP monuments) change together or not at all.
    await db.transaction().execute(async (trx) => {
      await trx.updateTable("user").set({ service_id: serviceId }).where("id", "=", userId).execute();
      await trx
        .insertInto("transactions")
        .values({
          id: crypto.randomUUID(),
          entity_id: userId,
          type: "user",
          op: "CHANGE_SERVICE",
          op_id: 0,
          tx_id: null,
          data: JSON.stringify({ from: previous?.service_id ?? null, to: serviceId }),
          user_id: userId,
          created_at: new Date().toISOString(),
        })
        .execute();

      if (deptNumbers && deptNumbers.length) {
        debug("Updating departments for user", userId, "to", deptNumbers);
        await trx.deleteFrom("user_dept").where("user_id", "=", userId).execute();
        for (const deptNumber of deptNumbers) {
          await trx.insertInto("user_dept").values({ user_id: userId, dept_number: deptNumber }).execute();
        }
      }
    });

    return { message: "Le service a été changé avec succès" };
  }

  async generateResetLink(email: string) {
    const userResults = await db
      .selectFrom("internal_user")
      .where("email", "=", normalizeEmail(email))
      .selectAll()
      .execute();
    const user = userResults[0]!;
    assertUserExists(user, "Aucun utilisateur avec ce courriel n'a été trouvé.");

    const temporaryLink = crypto.randomUUID();
    const temporaryLinkExpiresAt = addDays(new Date(), 1).toISOString();

    const encryptedLink = sha256(temporaryLink);

    await db
      .updateTable("internal_user")
      .set({ temporaryLink: encryptedLink, temporaryLinkExpiresAt })
      .where("id", "=", user.id)
      .execute();

    await sendPasswordResetMail({ email: user!.email, temporaryLink });

    return {
      message:
        "Votre demande de récupération de mot de passe a été transmise. Vous recevrez un couriel dans quelques instants.",
    };
  }

  async resetPassword({ temporaryLink, newPassword }: { temporaryLink: string; newPassword: string }) {
    assertPasswordIsStrongEnough(newPassword);

    // Links sent before the switch to SHA-256 were stored as MD5: still accepted while they are valid (24 h).
    // The MD5 fallback can be removed one day after this version is deployed.
    const acceptedHashes = [sha256(temporaryLink), md5(temporaryLink)];

    const userResults = await db
      .selectFrom("internal_user")
      .where("temporaryLink", "in", acceptedHashes)
      .selectAll()
      .execute();
    const user = userResults[0];

    await assertLinkIsValid(user, acceptedHashes);

    // exact: Keycloak's email search is a substring search otherwise, and could return another account first
    const userKeycloakId = await adminAuthApi<Array<{ id: string }>>("/users", {
      method: "GET",
      query: { email: user!.email, exact: true },
    }).then((res) => res[0]?.id);
    if (!userKeycloakId) {
      throw new AppError(403, "Le lien est invalide");
    }

    await adminAuthApi("/users/" + userKeycloakId + "/reset-password", {
      method: "PUT",
      body: { value: newPassword, type: "password", temporary: false },
    });
    await db
      .updateTable("internal_user")
      .set({ temporaryLink: null, temporaryLinkExpiresAt: null })
      .where("id", "=", user!.id)
      .execute();

    return { message: "Votre mot de passe a été modifié avec succès." };
  }
}

const assertUserExists = (user: any, errorDescription?: string) => {
  if (!user || !user.id) {
    throw new AppError(403, "Le courriel ou le mot de passe est incorrect");
  }
};

const md5 = (data: string) => crypto.createHash("md5").update(data).digest("hex");
const sha256 = (data: string) => crypto.createHash("sha256").update(data).digest("hex");

const assertLinkIsValid = async (
  user: Selectable<Database["internal_user"]> | undefined,
  acceptedHashes: string[],
) => {
  if (!user) {
    throw new AppError(403, "Le lien est invalide");
  }

  if (!user.temporaryLink || !user.temporaryLinkExpiresAt) {
    throw new AppError(403, "Le lien est invalide");
  }

  const expiresAt = new Date(user.temporaryLinkExpiresAt);
  if (expiresAt < new Date()) {
    throw new AppError(403, "Le lien est expiré");
  }

  if (!acceptedHashes.includes(user.temporaryLink)) {
    throw new AppError(403, "Le lien est invalide");
  }
};
