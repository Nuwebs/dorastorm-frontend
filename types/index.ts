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
