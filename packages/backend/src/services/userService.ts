import { Database, db } from "../db/db";

import { makeDebug } from "../features/debug";
import { AppError } from "../features/errors";
import { transactions } from "../db/schema";

const debug = makeDebug("user_service");
export class UserService {
  async changeService(userId: string, serviceId: string) {
    debug("Changing service for user", userId, "to", serviceId);
    const service = await db.selectFrom("service").where("id", "=", serviceId).selectAll().execute();
    if (!service[0]) {
      throw new AppError(400, "Le service n'existe pas");
    }

    await db.updateTable("user").set({ service_id: serviceId }).where("id", "=", userId).execute();

    const deptNumbers = service[0].dept_numbers?.split(",").map((num) => num.trim());

    if (deptNumbers && deptNumbers.length) {
      debug("Updating departments for user", userId, "to", deptNumbers);
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom("user_dept").where("user_id", "=", userId).execute();
        for (const deptNumber of deptNumbers) {
          await trx.insertInto("user_dept").values({ user_id: userId, dept_number: deptNumber }).execute();
        }
      });
    }
    return { message: "Le service a été changé avec succès" };
  }
}

