import type { User } from "~/types/user";

export const AUTH_ENDPOINT = {
  LOGIN: "/login",
  REFRESH: "/token",
  LOGOUT: "/logout",
  LOGGED_USER_INFO: "/me",
} as const;

export type AuthEndpoint = (typeof AUTH_ENDPOINT)[keyof typeof AUTH_ENDPOINT];

/**
 * Saves a the DS JWT token to localStorage.
 */
export function saveToken(token: string): void {
  localStorage.setItem("ds-jwt", token);
}

/**
 * Saves a user object to localStorage.
 */
export function saveUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Saves the DS JWT token expire epoch (unix timestamp) to localStorage.
 */
export function saveExpiresEpoch(expiresIn: number): void {
  localStorage.setItem("expiresEpoch", String(expiresIn));
}

/**
 * Checks if the DS JWT token exists in localStorage and returns it. Returns false if not found.
 */
export function isPotentiallyLoggedIn(): boolean | string {
  const token = localStorage.getItem("ds-jwt");
  return token !== null ? token : false;
}

/**
 * Retrieves the user object from localStorage. Returns false if not found.
 */
export function getUserData(): boolean | User {
  const user = localStorage.getItem("user");
  return user !== null ? JSON.parse(user) : false;
}

/**
 * Retrieves the expiration epoch from localStorage. Returns -1 if not found.
 */
export function getExpiresEpoch(): number {
  const expiresIn = localStorage.getItem("expiresEpoch");
  return expiresIn !== null ? Number(expiresIn) : -1;
}

/**
 * Retrieves the current epoch time in seconds.
 */
export function getActualEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Removes specific keys related to authentication from localStorage.
 */
export function cleanSavedKeys(): void {
  localStorage.removeItem("ds-jwt");
  localStorage.removeItem("user");
  localStorage.removeItem("expiresEpoch");
}

/**
 * Calculates the expiration epoch based on the current time and a given duration.
 */
export function calculateExpireEpoch(expiresIn: number): number {
  return getActualEpoch() + expiresIn - 30;
}

/**
 * Checks if a tje DS JWT token has expired based on the expiration epoch.
 */
export function isTokenExpired(expiresEpoch: number): boolean {
  const epoch: number = getActualEpoch();
  return epoch >= expiresEpoch;
}
