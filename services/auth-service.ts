import { useRuntimeConfig } from "nuxt/app";
import apiFetch from "~/utils/api-fetch";
import useAuthStore from "~/stores/auth-store";
import type { User } from "~/types/user";
import type { DefaultLoginCredentials, JWTResponse } from "~/types/auth";
import ExpiredTokenException from "~/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/exceptions/InvalidTokenException";
import type { ErrorBag } from "~/types/fetch";

export const AUTH_ENDPOINT = {
  LOGIN: "/login",
  REFRESH: "/token",
  LOGOUT: "/logout",
  LOGGED_USER_INFO: "/me",
} as const;

export type AuthEndpoint = (typeof AUTH_ENDPOINT)[keyof typeof AUTH_ENDPOINT];

export const BACKEND_URL = useRuntimeConfig().public.backendURL;

const authStore = useAuthStore();

/**
 * Saves a the DS JWT token to localStorage.
 */
function saveToken(token: string): void {
  localStorage.setItem("ds-jwt", token);
}

/**
 * Saves a user object to localStorage.
 */
function saveUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Saves the DS JWT token expire epoch (unix timestamp) to localStorage.
 */
function saveExpiresEpoch(expiresIn: number): void {
  localStorage.setItem("expiresEpoch", String(expiresIn));
}

/**
 * Checks if the DS JWT token exists in localStorage and returns it. Returns false if not found.
 */
function isPotentiallyLoggedIn(): boolean | string {
  const token = localStorage.getItem("ds-jwt");
  return token !== null ? token : false;
}

/**
 * Retrieves the user object from localStorage. Returns false if not found.
 */
function getUserData(): boolean | User {
  const user = localStorage.getItem("user");
  return user !== null ? JSON.parse(user) : false;
}

/**
 * Retrieves the expiration epoch from localStorage. Returns -1 if not found.
 */
function getExpiresEpoch(): number {
  const expiresIn = localStorage.getItem("expiresEpoch");
  return expiresIn !== null ? Number(expiresIn) : -1;
}

/**
 * Retrieves the current epoch time in seconds.
 */
function getActualEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Removes specific keys related to authentication from localStorage.
 */
function cleanSavedKeys(): void {
  localStorage.removeItem("ds-jwt");
  localStorage.removeItem("user");
  localStorage.removeItem("expiresEpoch");
}

/**
 * Calculates the expiration epoch based on the current time and a given duration.
 */
function calculateExpireEpoch(expiresIn: number): number {
  return getActualEpoch() + expiresIn - 30;
}

/**
 * Checks if a tje DS JWT token has expired based on the expiration epoch.
 */
export function isTokenExpired(expiresEpoch: number): boolean {
  const epoch: number = getActualEpoch();
  return epoch >= expiresEpoch;
}

/**
 * Refreshes the DS JWT token and updates localStorage with new values.
 * Throws exceptions if the token refresh fails.
 */
export async function refreshToken(): Promise<void> {
  const { data, error } = await apiFetch<JWTResponse>({
    endpoint: AUTH_ENDPOINT.REFRESH,
  });
  if (error) {
    cleanSavedKeys();
    authStore.$reset();
    if (error.statusCode && error.statusCode === 409) {
      throw new ExpiredTokenException("");
    }
    throw new InvalidTokenException("");
  }
  authStore.token = data!.accessToken;
  authStore.expiresEpoch = calculateExpireEpoch(data!.expiresIn);
  saveToken(authStore.token);
  saveExpiresEpoch(authStore.expiresEpoch);
}

/**
 * Retrieves user information from the server and updates the auth store.
 */
export async function getUserInfo(): Promise<void | ErrorBag<User>> {
  const { data, error } = await apiFetch<User, ErrorBag<User>>({
    endpoint: AUTH_ENDPOINT.LOGGED_USER_INFO,
  });
  if (error) {
    return error.data;
  }

  authStore.user = data!;
  saveUser(authStore.user);
}

/**
 * Logs in a user with provided credentials and updates the auth store.
 */
export async function login(
  credentials: DefaultLoginCredentials
): Promise<void | ErrorBag> {
  const { data, error } = await apiFetch<JWTResponse>({
    endpoint: AUTH_ENDPOINT.LOGIN,
    auth: false,
    options: {
      method: "post",
      body: credentials,
    },
  });
  if (error) {
    return error as ErrorBag;
  }
  authStore.token = data!.accessToken;

  const failed = await getUserInfo();
  if (failed) {
    return failed as ErrorBag;
  }

  authStore.expiresEpoch = calculateExpireEpoch(data!.expiresIn);
  saveToken(authStore.token);
  saveExpiresEpoch(authStore.expiresEpoch);
}

/**
 * Logs out a user and clears authentication data. If the fastCall param is sent
 * it removes the token from the app but does not inform the backend.
 */
export async function logout(
  fastCall: boolean = false
): Promise<void | ErrorBag> {
  if (fastCall) {
    authStore.$reset();
    cleanSavedKeys();
    return;
  }
  const { error } = await apiFetch<void>({
    endpoint: AUTH_ENDPOINT.LOGOUT,
    options: {
      method: "post",
    },
  });
  authStore.$reset();
  cleanSavedKeys();
  if (error) {
    return error as ErrorBag;
  }
}

/**
 * Loads user data from localStorage into the auth store.
 */
export function loadUserData(): void {
  authStore.appBooted = true;
  const token = isPotentiallyLoggedIn();
  if (token === false) {
    return cleanSavedKeys();
  }
  const user = getUserData();
  if (user === false) {
    return cleanSavedKeys();
  }

  const expiresEpoch = getExpiresEpoch();

  authStore.token = token as string;
  authStore.user = user as User;
  authStore.expiresEpoch = expiresEpoch;
}
