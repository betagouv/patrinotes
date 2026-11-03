import { useNavigate } from "@tanstack/react-router";
import { RouterOutputs, unauthenticatedApi } from "../../api";
import { useAuthContext } from "../../contexts/AuthContext";
import { searchStore } from "#components/SearchModal.tsx";

// (typed-openapi adds a spurious array member to the unions of the OpenAPI schema)
export type SignInResult = Exclude<RouterOutputs<"/api/auth/magic-link/verify">, unknown[]>;
type SignupRequired = Extract<SignInResult, { status: "signup-required" }>;
export type PendingSignup = Omit<SignupRequired, "givenName" | "usualName" | "provider"> & {
  givenName: string | null;
  usualName: string | null;
  provider: "proconnect" | "magic_link";
  canCreateAccount: boolean;
};

// localStorage rather than sessionStorage: an installed PWA may be reopened between the
// redirect to ProConnect and the return to /auth-callback.
const PROCONNECT_STATE_KEY = "patrinotes/proconnect-state";
const PENDING_SIGNUP_KEY = "patrinotes/pending-signup";
const MAX_AGE_MS = 30 * 60 * 1000;

const writeWithDate = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify({ value, at: Date.now() }));

const readWithDate = <T>(key: string): T | null => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!stored || Date.now() - stored.at > MAX_AGE_MS) return null;
    return stored.value as T;
  } catch {
    return null;
  }
};

/** Sends the browser to ProConnect. */
export const startProConnectSignIn = async () => {
  const { url, state } = await unauthenticatedApi.get("/api/auth/proconnect/authorize");
  writeWithDate(PROCONNECT_STATE_KEY, state);
  window.location.assign(url);
};

/** The `state` ProConnect sends back must be the one this browser was given (CSRF). Single use. */
export const consumeProConnectState = (state: string) => {
  const expected = readWithDate<string>(PROCONNECT_STATE_KEY);
  localStorage.removeItem(PROCONNECT_STATE_KEY);
  return !!expected && expected === state;
};

export const getPendingSignup = () => readWithDate<PendingSignup>(PENDING_SIGNUP_KEY);
export const clearPendingSignup = () => localStorage.removeItem(PENDING_SIGNUP_KEY);

/** Stores the session (or goes to the profile form on a first sign-in) and leaves the login pages. */
export const useApplySignInResult = () => {
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  return async (response: RouterOutputs<"/api/auth/magic-link/verify">) => {
    const result = response as SignInResult;
    if (result.status === "signup-required") {
      writeWithDate(PENDING_SIGNUP_KEY, result);
      navigate({ to: "/inscription", replace: true });
      return;
    }

    clearPendingSignup();
    localStorage.setItem("crvif/version", "1");
    localStorage.removeItem("crvif/update-popup");
    // persisted before leaving the page: a reload right after sign-in must not lose the session
    await setAuth({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt,
      user: result.user as any,
    });

    searchStore.send({ type: "setScope", scope: "my" });
    searchStore.send({ type: "setDocument", document: "constats" });

    navigate({ to: "/", search: { document: "constats" } as any, replace: true });
  };
};
