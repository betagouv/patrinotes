import { ofetch } from "ofetch";
import { type GetEndpoints, type PostEndpoints, createApiClient } from "./api.gen";
import { ENV } from "./envVars";

import { getTokenOrRefresh } from "./db/Connector";
import { Database, Service } from "./db/AppSchema";
import { Prettify } from "pastable";

export const createApiClientWithUrl = (url: string, options: { ignoreToken?: boolean } = {}) => {
  return createApiClient(async (method, url, parameters) => {
    const { body, query, header } = parameters || {};

    let token;
    if (!options.ignoreToken) {
      token = await getTokenOrRefresh();
    }

    return ofetch(url, {
      method,
      body: body as any,
      query,
      headers: { ...header, Authorization: token ? `Bearer ${token}` : undefined } as Record<string, string>,
    });
  }, url);
};

export const api = createApiClientWithUrl(ENV.VITE_BACKEND_URL);
export const unauthenticatedApi = createApiClientWithUrl(ENV.VITE_BACKEND_URL, { ignoreToken: true });

export type RouterInputs<T extends keyof AllEndpoints> = AllEndpoints[T]["parameters"];
export type RouterOutputs<T extends keyof AllEndpoints> = AllEndpoints[T]["response"];

export type AuthUser = Prettify<RouterOutputs<"/api/refresh-token">["user"]>;
type AllEndpoints = GetEndpoints & PostEndpoints;

export const getErrorMessage = (error: any) => {
  return error?.data?.error ?? "Une erreur est survenue, veuillez réessayer plus tard";
};
