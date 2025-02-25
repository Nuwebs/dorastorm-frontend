import { jwtDecode } from 'jwt-decode';
import type { User } from '~/types/user';

export const AUTH_ENDPOINT = {
  LOGIN: '/login',
  REFRESH: '/token',
  LOGOUT: '/logout',
  LOGGED_USER_INFO: '/me'
} as const;

export type AuthEndpoint = (typeof AUTH_ENDPOINT)[keyof typeof AUTH_ENDPOINT];

export function saveToken(token: string): void {
  localStorage.setItem('ds-jwt', token);
}

export function saveExpiresEpoch(expiresEpoch: number): void {
  localStorage.setItem('expiresEpoch', String(expiresEpoch));
}

export function isPotentiallyLoggedIn(): boolean | string {
  const token = localStorage.getItem('ds-jwt');
  return token !== null ? token : false;
}

export function getExpiresEpoch(): number {
  const expiresEpoch = localStorage.getItem('expiresEpoch');
  return expiresEpoch !== null ? Number(expiresEpoch) : -1;
}

export function getActualEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

export function cleanSavedKeys(): void {
  localStorage.removeItem('ds-jwt');
  localStorage.removeItem('expiresEpoch');
  localStorage.removeItem('user'); // Keep for backward compatibility
}

export function calculateExpireEpoch(expiresIn: number): number {
  return getActualEpoch() + expiresIn - 30;
}

export function isTokenExpired(expiresEpoch: number): boolean {
  const epoch = getActualEpoch();
  return epoch >= expiresEpoch;
}

export function decodeToken(token: string): { user: User } {
  return jwtDecode(token);
}
