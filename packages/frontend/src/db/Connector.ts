import { AbstractPowerSyncDatabase, CrudEntry, PowerSyncBackendConnector } from "@powersync/web";
import { addRejectedWrite, getRejectionReason, REPEATED_SERVER_ERROR } from "../features/sync/rejectedWrites";
import { FetchError } from "ofetch";
import { api, RouterOutputs, unauthenticatedApi } from "../api";
import { apiStore, get80PercentOfTokenLifespan } from "../ApiStore";
import { ENV } from "../envVars";
import { emitSessionExpired } from "../features/auth/sessionExpired";

const emitterChannel = new BroadcastChannel("sw-messages");

export class Connector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const token = await getTokenOrRefresh();

    return {
      endpoint: ENV.VITE_POWERSYNC_URL,
      token,
    };
  }

  hasUpdated = false;

  async uploadData(database: AbstractPowerSyncDatabase) {
    // See example implementation here: https://docs.powersync.com/client-sdk-references/javascript-web#3-integrate-with-your-backend
    // Operations are sent and acknowledged one at a time: when one fails, the ones already applied by the
    // server are not sent again on the next attempt (a second PUT would be refused as "la ligne existe déjà").
    for (let i = 0; i < MAX_OPERATIONS_PER_UPLOAD; i++) {
      const batch = await database.getCrudBatch(1);
      if (!batch) return;

      for (const operation of batch.crud) {
        await uploadOperation(operation);
      }

      await batch.complete();
    }
  }
}

// PowerSync calls uploadData again as long as the queue is not empty.
const MAX_OPERATIONS_PER_UPLOAD = 100;
// An operation the server answers with the same kind of error this many times in a row is set aside,
// so that it does not block every later change.
export const MAX_ATTEMPTS = 5;

// Failed attempts per operation (ps_crud id). In memory: a reload simply starts counting again.
const failedAttempts = new Map<number, number>();

const uploadOperation = async (operation: CrudEntry) => {
  const payload = operation.toJSON();
  const isPayloadEmpty = !payload.data || Object.keys(payload.data).length === 0;
  const isDeletion = payload.op === "DELETE";

  if (isPayloadEmpty && !isDeletion) {
    console.warn("skipping empty operation", payload.op, payload.type, payload.id);
    return;
  }

  let response: { success?: boolean; error?: unknown; reason?: unknown } | undefined;
  try {
    response = (await api.post("/api/upload-data", { body: payload })) as typeof response;
  } catch (error) {
    if (!isRepeatableError(error)) throw error;

    const attempts = (failedAttempts.get(operation.clientId) ?? 0) + 1;
    failedAttempts.set(operation.clientId, attempts);
    if (attempts < MAX_ATTEMPTS) throw error;

    console.error("setting aside operation after", attempts, "failed attempts", payload.op, payload.type, payload.id);
    failedAttempts.delete(operation.clientId);
    addRejectedWrite({ table: payload.type, id: payload.id, op: payload.op, reason: REPEATED_SERVER_ERROR });
    return;
  }

  failedAttempts.delete(operation.clientId);

  // The server answers 200 with success: false when it refuses a write; the client gets the stored row back
  // at its next sync, so the local change disappears: keep a trace the agent can see.
  if (response && response.success === false) {
    console.warn("operation refused by the server", payload.op, payload.type, payload.id);
    addRejectedWrite({ table: payload.type, id: payload.id, op: payload.op, reason: getRejectionReason(response) });
  }
};

/**
 * Errors that come back the same way however many times the operation is sent: the server answered, with a
 * client error that does not depend on the session or on the load. Network failures, expired or invalid
 * sessions (401/403), timeouts, rate limiting and 5xx (server down, deploy in progress) are transient: the
 * operation stays in the queue and is retried until it goes through.
 */
const isRepeatableError = (error: unknown) => {
  if (!(error instanceof FetchError)) return false;
  const status = error.status;
  if (!status || status < 400 || status >= 500) return false;
  return ![401, 403, 408, 425, 429].includes(status);
};

// Shared by PowerSync's connector and the regular api client, both of which may call this
// concurrently. Without this, several callers racing while the token is expired would each
// fire their own /api/refresh-token request against the same (soon-to-be-rotated) refresh
// token, causing spurious "session expired" failures that aren't real expiries.
let refreshPromise: Promise<string> | null = null;

export const getTokenOrRefresh = async () => {
  if (!apiStore.loaded) throw new Error("Auth not loaded");

  if (!apiStore.accessToken || !apiStore.refreshToken || !apiStore.expiresAt) throw new Error("No token found");
  if (new Date(Number(apiStore.expiresAt)) < new Date()) {
    if (!refreshPromise) refreshPromise = refreshAccessToken();

    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  }

  return apiStore.accessToken;
};

const refreshAccessToken = async () => {
  console.log("token expired, refreshing...");
  const refreshToken = apiStore.refreshToken!;

  let resp: RouterOutputs<"/api/refresh-token">;
  try {
    resp = await unauthenticatedApi.post("/api/refresh-token", { body: { refreshToken } });
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      console.log("refresh token rejected, logging out");

      apiStore.accessToken = null;
      apiStore.refreshToken = null;
      apiStore.expiresAt = null;
      apiStore.user = null;
      await apiStore.save();

      emitSessionExpired();
    }

    throw error;
  }

  console.log("token refreshed");

  apiStore.accessToken = resp.accessToken;
  apiStore.refreshToken = resp.refreshToken;
  apiStore.expiresAt = resp.expiresAt;
  await apiStore.save();

  return apiStore.accessToken;
};
