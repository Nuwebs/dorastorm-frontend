import { RouteLocationNormalized } from "vue-router";
export interface JWTResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
export interface ErrorBag<T = any> {
  statusCode: number;
  statusMessage: string;
  data?: T;
}
export interface DsRouteMeta extends RouteLocationNormalized {
  meta: RouteLocationNormalized["meta"] & {
    strictPermissions?: boolean;
    permissions?: string[];
  };
}
