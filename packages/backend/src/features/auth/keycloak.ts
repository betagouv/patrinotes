import { ofetch } from "ofetch";
import { ENV } from "../../envVars";
import { authApi } from "../../services/authService";

export const adminAuthApi = ofetch.create({
  baseURL: `${ENV.VITE_AUTH_URL}/admin/realms/${ENV.VITE_AUTH_REALM}`,
  onRequest: async ({ options }) => {
    const token = await getKeycloakAdminTokens();
    options.headers.append("Authorization", `Bearer ${token.access_token}`);
  },
});

export const getKeycloakAdminTokens = async () => {
  const tokenResponse = await authApi<KeycloakTokens>(`/protocol/openid-connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: ENV.AUTH_ADMIN_CLIENT_ID,
      client_secret: ENV.AUTH_ADMIN_CLIENT_SECRET,
      scope: "email profile offline_access",
    }),
  });

  return tokenResponse;
};

export const deleteUserByEmail = async (email: string) => {
  const users = await adminAuthApi(`/users?email=${encodeURIComponent(email)}&exact=true`, {
    method: "GET",
  });

  const user = users?.[0];
  if (!user?.id) throw new Error(`User not found for email: ${email}`);

  await adminAuthApi(`/users/${user.id}`, {
    method: "DELETE",
  });
};

type KeycloakTokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  "not-before-policy": number;
  scope: string;
};
