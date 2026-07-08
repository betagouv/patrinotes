import { AbstractPowerSyncDatabase, PowerSyncBackendConnector } from "@powersync/web";
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
    const batchTransactions = await database.getCrudBatch();
    if (!batchTransactions) return;

    for (const operation of batchTransactions.crud) {
      const payload = operation.toJSON();
      const isPayloadEmpty = !payload.data || Object.keys(payload.data).length === 0;
      const isDeletion = payload.op === "DELETE";

      if (isPayloadEmpty && !isDeletion) {
        console.warn("skipping empty operation", payload);
        continue;
      }
      console.log("applying operation", payload);
      await api.post("/api/upload-data", { body: payload });
    }

    return batchTransactions.complete();
  }
}

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
  console.log("token expired, refreshing...", { ...apiStore });
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
