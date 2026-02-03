import { AbstractPowerSyncDatabase, PowerSyncBackendConnector } from "@powersync/web";
import { api, RouterOutputs, unauthenticatedApi } from "../api";
import { apiStore, get80PercentOfTokenLifespan } from "../ApiStore";
import { ENV } from "../envVars";

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
      if (!payload.data || Object.keys(payload.data).length === 0) {
        console.warn("skipping empty operation", payload);
        continue;
      }
      console.log("applying operation", payload);
      await api.post("/api/upload-data", { body: payload });
    }

    return batchTransactions.complete();
  }
}

export const getTokenOrRefresh = async () => {
  console.log("getting token or refresh");
  if (!apiStore.loaded) throw new Error("Auth not loaded");

  if (!apiStore.accessToken || !apiStore.refreshToken || !apiStore.expiresAt) throw new Error("No token found");
  if (new Date(Number(apiStore.expiresAt)) < new Date()) {
    console.log("token expired, refreshing...", { ...apiStore });
    const resp: RouterOutputs<"/api/refresh-token"> = await unauthenticatedApi.post("/api/refresh-token", {
      body: { refreshToken: apiStore.refreshToken },
    });

    if (resp.accessToken === null) {
      console.log("token expired but couldn't find a refresh token, logging out");

      apiStore.accessToken = null;
      apiStore.refreshToken = null;
      apiStore.expiresAt = null;
      apiStore.user = null;
      await apiStore.save();

      throw new Error("Session expirée, veuillez vous reconnecter");
    } else {
      console.log("token refreshed");

      apiStore.accessToken = resp.accessToken;
      apiStore.refreshToken = resp.refreshToken;
      apiStore.expiresAt = resp.expiresAt;
      await apiStore.save();
    }
  } else console.log("token valid");

  return apiStore.accessToken;
};
