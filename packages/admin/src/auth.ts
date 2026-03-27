const AUTH_KEY = "admin/auth";

export type AdminAuth = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: { id: string; name: string; email: string; service_id: string; job: string | null };
};

export const getToken = (): string | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as AdminAuth).accessToken;
  } catch {
    return null;
  }
};

export const getAuth = (): AdminAuth | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminAuth;
  } catch {
    return null;
  }
};

export const setAuth = (auth: AdminAuth): void => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
