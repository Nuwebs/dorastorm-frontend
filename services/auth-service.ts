import { jwtDecode } from 'jwt-decode';
import { useCookie } from '#imports';
import type { User } from '~/types/user';

export const AUTH_ENDPOINT = {
  LOGIN: '/login',
  REFRESH: '/token',
  LOGOUT: '/logout',
  LOGGED_USER_INFO: '/me'
} as const;

const JWT_KEY = 'ds-jwt';

export type AuthEndpoint = (typeof AUTH_ENDPOINT)[keyof typeof AUTH_ENDPOINT];

export type JWTPayload = { user: User; exp: number; iat: number };

export function saveToken(token: string, maxAge: number): void {
  const cookie = useCookie(JWT_KEY, { maxAge: maxAge, httpOnly: false });
  cookie.value = token;
}

export function getToken(): string | null {
  const cookie = useCookie<string | null>(JWT_KEY);
  return cookie.value;
}

export function getActualEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

export function cleanSavedKeys(): void {
  const cookie = useCookie<string | null>(JWT_KEY);
  cookie.value = null;
}

export function isTokenExpired(expiresEpoch: number): boolean {
  const epoch = getActualEpoch();
  return epoch >= expiresEpoch - 30; // Refresh 30 seconds early
}

export function decodeToken(token: string): JWTPayload {
  return jwtDecode<JWTPayload>(token);
}
