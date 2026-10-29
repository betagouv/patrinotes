import { FetchError, ofetch } from "ofetch";
import { ENV } from "../../envVars";
import { makeDebug } from "../debug";
import type { RawUpDocument } from "./upTypes";
import mockDocuments from "./fixtures/up-mock.json";

const debug = makeDebug("up-provider");

/** Source of raw unité patrimoniale documents. */
export interface UpProvider {
  /** Root UP(s) of a monument, matched on its Mérimée reference (PA…). */
  findByReferenceMerimee(reference: string): Promise<RawUpDocument[]>;
  /** Documents for the given ids; unknown ids are simply absent from the result. */
  findByIds(ids: string[]): Promise<RawUpDocument[]>;
}

const ID_BATCH_SIZE = 50;

/**
 * Dataspace "patrinote/up" API: POST a Mongo-style filter, get an array of documents.
 * Filters known to work: plain field equality, `$in`, `$or`, `$regex`.
 * Dotted paths into arrays (e.g. `enfants.epa_id`) return nothing.
 */
export class DataspaceUpProvider implements UpProvider {
  constructor(
    private url: string,
    private apiKey: string,
  ) {}

  private async query(filter: Record<string, unknown>) {
    debug("POST", this.url, JSON.stringify(filter));
    const start = Date.now();
    try {
      const result = await ofetch<RawUpDocument[]>(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", apiKey: this.apiKey },
        body: filter,
        // Usually under a second; a timed-out request is retried once (an occasional cold start took over 15s).
        timeout: 5_000,
        retry: 1,
      });
      return Array.isArray(result) ? result : [];
    } catch (error) {
      // The API answers 404 instead of an empty array when no document matches.
      if (error instanceof FetchError && error.statusCode === 404) return [];
      throw error;
    } finally {
      debug(`answered in ${Date.now() - start}ms`);
    }
  }

  findByReferenceMerimee(reference: string) {
    return this.query({ UPI_REFERENCE_MERIMEE: reference });
  }

  async findByIds(ids: string[]) {
    const results: RawUpDocument[] = [];
    for (let i = 0; i < ids.length; i += ID_BATCH_SIZE) {
      const batch = ids.slice(i, i + ID_BATCH_SIZE);
      results.push(...(await this.query({ $or: [{ _id: { $in: batch } }] })));
    }
    return results;
  }
}

/** Offline stand-in backed by fixtures/up-mock.json (real API responses, trimmed). */
export class MockUpProvider implements UpProvider {
  constructor(private documents: RawUpDocument[] = mockDocuments as RawUpDocument[]) {}

  async findByReferenceMerimee(reference: string) {
    return this.documents.filter((doc) => doc.UPI_REFERENCE_MERIMEE === reference);
  }

  async findByIds(ids: string[]) {
    const wanted = new Set(ids);
    return this.documents.filter((doc) => wanted.has(String(doc._id)));
  }
}

export const makeUpProvider = (): UpProvider => {
  if (ENV.UP_API_MODE === "live") {
    return new DataspaceUpProvider(ENV.UP_API_URL, ENV.UP_API_KEY!);
  }
  return new MockUpProvider();
};
