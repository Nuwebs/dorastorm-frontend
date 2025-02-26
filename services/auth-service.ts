import { jwtDecode } from 'jwt-decode';
import type { User } from '~/types/user';

export const AUTH_ENDPOINT = {
  LOGIN: '/login',
  REFRESH: '/token',
  LOGOUT: '/logout',
  LOGGED_USER_INFO: '/me'
} as const;

const JWT_KEY = 'ds-jwt';

export type AuthEndpoint = (typeof AUTH_ENDPOINT)[keyof typeof AUTH_ENDPOINT];

export function saveToken(token: string): void {
  localStorage.setItem(JWT_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(JWT_KEY);
}

export function getActualEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

export function cleanSavedKeys(): void {
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem('expiresEpoch'); // Clean up old data
  localStorage.removeItem('user'); // Clean up old data
}

export function isTokenExpired(expiresEpoch: number): boolean {
  const epoch = getActualEpoch();
  return epoch >= expiresEpoch - 30; // Refresh 30 seconds early
}

export function decodeToken(token: string): { user: User; exp: number } {
  return jwtDecode<{ user: User; exp: number }>(token);
}
