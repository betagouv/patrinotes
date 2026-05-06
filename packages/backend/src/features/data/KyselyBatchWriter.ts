import { Writable } from "stream";
import { db } from "../../db/db";
import { makeDebug } from "../debug";
import { pick } from "pastable";

const debug = makeDebug("batch-writer");

export class KyselyBatchWriter<RowType> extends Writable {
  private batch: RowType[];

  constructor(
    public tableName: string,
    public batchSize = 1000,
    public primaryKeyColumn: keyof RowType,
  ) {
    super({ objectMode: true });
    this.batch = [];
  }

  async _write(
    row: RowType,
    encoding: BufferEncoding,
    callback: ((error: Error | null | undefined) => void) | undefined,
  ) {
    if (!row[this.primaryKeyColumn]) {
      debug(`Skipping row without primary key (${String(this.primaryKeyColumn)})`);
      callback?.(null);
      return;
    }

    this.batch.push({ ...row, id: row[this.primaryKeyColumn] });

    if (this.batch.length >= this.batchSize) {
      await this.flush();
    }
    callback?.(null);
  }

  async _final(callback: ((error: Error | null | undefined) => void) | undefined) {
    await this.flush();
    callback?.(null);
  }

  async flush() {
    if (this.batch.length === 0) return;

    const tableColumns =
      (await db.introspection.getTables().then((table) => table.find((t) => t.name === this.tableName)))?.columns.map(
        (c) => c.name,
      ) || [];

    const pkCol = String(this.primaryKeyColumn);
    const seen = new Set<unknown>();
    const deduped = this.batch.filter((row) => {
      const key = (row as any)[pkCol];
      if (seen.has(key)) {
        debug(`Duplicate ${pkCol}="${key}" in batch, keeping first occurrence`);
        return false;
      }
      seen.add(key);
      return true;
    });

    const rows = deduped.map((row) => pick(row, tableColumns as any));
    const updateColumns = tableColumns.filter((c) => c !== pkCol && c !== "id");

    await db
      .insertInto(this.tableName as any)
      .values(rows)
      .onConflict((oc) =>
        oc.column(String(this.primaryKeyColumn) as any).doUpdateSet(
          Object.fromEntries(updateColumns.map((c) => [c, (eb: any) => eb.ref(`excluded.${c}`)])) as any,
        ),
      )
      .execute();

    debug(`Inserted ${rows.length} rows into ${this.tableName} (${this.batch.length - rows.length} duplicates skipped)`);
    this.batch = [];
  }
}
