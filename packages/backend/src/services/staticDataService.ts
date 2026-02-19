import { sql } from "kysely";
import { db } from "../db/db";

export class StaticDataService {
  async getServices() {
    return db
      .selectFrom("service")
      .where("visible", "=", true)
      .orderBy(sql`SPLIT_PART(name, ' ', 1)`)
      .orderBy("dept_numbers asc")
      .selectAll()
      .execute();
  }
}
