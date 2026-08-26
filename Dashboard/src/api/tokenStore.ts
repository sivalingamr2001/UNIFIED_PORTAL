let currentToken: string | null = null;
const TOKEN_KEY = "pes-portal-token";

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

currentToken = readStoredToken();

export const tokenStore = {
  get(): string | null { return currentToken; },
  set(token: string, remember = false): void {
    currentToken = token;
    try {
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      (remember ? window.sessionStorage : window.localStorage).removeItem(TOKEN_KEY);
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  },
  clear(): void {
    currentToken = null;
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  },
};
