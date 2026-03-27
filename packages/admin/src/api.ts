import { ofetch } from "ofetch";
import { ENV } from "./envVars";
import { getToken } from "./auth";

const createClient = (options: { authenticated: boolean }) =>
  ofetch.create({
    baseURL: ENV.VITE_BACKEND_URL,
    onRequest({ options: reqOptions }) {
      if (options.authenticated) {
        const token = getToken();
        if (token) {
          reqOptions.headers = {
            ...reqOptions.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }
    },
  });

export const api = createClient({ authenticated: true });
export const unauthenticatedApi = createClient({ authenticated: false });
