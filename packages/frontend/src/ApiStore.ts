import { createStore, get, promisifyRequest, set } from "idb-keyval";
import { AuthUser } from "./api";
import { ENV } from "./envVars";

export class ApiStore {
  loaded = false;
  url: string | null = null;
  accessToken: string | null = null;
  expiresAt: string | null = null;
  refreshToken: string | null = null;
  user: AuthUser | null = null;
  store = createStore("auth", "access");

  constructor() {}

  async load() {
    await this.loadUrl();
    await this.reloadTokens();
    await this.loadUser();

    this.loaded = true;
  }

  /** Re-read the tokens another tab of the app may have rotated meanwhile. */
  async reloadTokens() {
    this.accessToken = (await get("accessToken", this.store)) ?? null;
    this.expiresAt = (await get("expiresAt", this.store)) ?? null;
    this.refreshToken = (await get("refreshToken", this.store)) ?? null;
  }

  async loadUrl() {
    this.url = (await get("url", this.store)) ?? null;

    if (!this.url) {
      this.url = ENV.VITE_BACKEND_URL;
      await set("url", this.url, this.store);
    }

    return this.url;
  }

  async loadUser() {
    const userStr = (await get("user", this.store)) ?? null;
    if (!userStr) return null;

    this.user = JSON.parse(userStr);

    return this.user;
  }

  /** One transaction: the session is never half-written (tab closed or reloaded right after sign-in). */
  async save() {
    const values: Record<string, string | null> = {
      url: this.url,
      accessToken: this.accessToken,
      expiresAt: this.expiresAt,
      refreshToken: this.refreshToken,
      user: this.user ? JSON.stringify(this.user) : null,
    };

    await this.store("readwrite", (store) => {
      for (const [key, value] of Object.entries(values)) {
        if (value) store.put(value, key);
        else store.delete(key);
      }
      return promisifyRequest(store.transaction);
    });
  }
}

export const apiStore = new ApiStore();

export const get80PercentOfTokenLifespan = (expiresIn: number) => Date.now() + expiresIn * 0.8 * 1000;
