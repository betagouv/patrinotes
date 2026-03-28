import { ENV } from "../../envVars";

export const auth = {
  login: () => {
    const nonce = crypto.randomUUID();
    const state = crypto.randomUUID();
    sessionStorage.setItem("proconnect_nonce", nonce);
    sessionStorage.setItem("proconnect_state", state);

    const params = new URLSearchParams({
      client_id: ENV.VITE_AUTH_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth-callback`,
      response_type: "code",
      scope: "openid email given_name usual_name",
      nonce,
      state,
    });

    window.location.href = `${ENV.VITE_AUTH_URL}/authorize?${params}`;
  },
};
