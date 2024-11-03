export interface JWTResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
export interface DefaultLoginCredentials {
  email: string;
  password: string;
}
