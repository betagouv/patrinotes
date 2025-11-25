import { addDays } from "date-fns";
import { Database, db } from "../db/db";

import { makeDebug } from "../features/debug";
import { AppError } from "../features/errors";
import crypto from "crypto";
import { sendPasswordResetMail } from "../features/mail";
import { Selectable } from "kysely";
import { adminAuthApi } from "../features/auth/keycloak";

const debug = makeDebug("user_service");
export class UserService {
  async changeService(userId: string, serviceId: string) {
    debug("Changing service for user", userId, "to", serviceId);
    const service = await db.selectFrom("service").where("id", "=", serviceId).selectAll().execute();
    if (!service[0]) {
      throw new AppError(400, "Le service n'existe pas");
    }

    await db.updateTable("user").set({ service_id: serviceId }).where("id", "=", userId).execute();

    const deptNumber = service[0].dept_numbers?.split(",")[0];

    await db.deleteFrom("user_dept").where("user_id", "=", userId).execute();
    if (deptNumber) {
      const numbers = deptNumber.split(",").map((num) => num.trim());
      for (const deptNumber of numbers) {
        await db.insertInto("user_dept").values({ user_id: userId, dept_number: deptNumber }).execute();
      }
    }
    return { message: "Le service a été changé avec succès" };
  }

  async generateResetLink(email: string) {
    const userResults = await db.selectFrom("internal_user").where("email", "=", email).selectAll().execute();
    const user = userResults[0]!;
    assertUserExists(user, "Aucun utilisateur avec ce courriel n'a été trouvé.");

    const temporaryLink = crypto.randomUUID();
    const temporaryLinkExpiresAt = addDays(new Date(), 1).toISOString();

    const encryptedLink = md5(temporaryLink);

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
    const encryptedLink = md5(temporaryLink);

    const userResults = await db
      .selectFrom("internal_user")
      .where("temporaryLink", "=", encryptedLink)
      .selectAll()
      .execute();
    const user = userResults[0];

    await assertLinkIsValid(user, encryptedLink);

    await adminAuthApi("/users/" + user!.id + "/reset-password", {
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

const assertLinkIsValid = async (user: Selectable<Database["internal_user"]> | undefined, encryptedLink: string) => {
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

  if (user.temporaryLink !== encryptedLink) {
    throw new AppError(403, "Le lien est invalide");
  }
};
