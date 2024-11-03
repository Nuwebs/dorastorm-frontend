import { useRuntimeConfig } from "nuxt/app";
import apiFetch from "~/utils/api-fetch";
import useAuthStore from "~/stores/auth-store";
import type { User } from "~/types/user";
import type { DefaultLoginCredentials, JWTResponse } from "~/types/auth";
import ExpiredTokenException from "~/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/exceptions/InvalidTokenException";
import type { ErrorBag } from "~/types/fetch";

const saveToken = (token: string): void => {
  localStorage.setItem("ds-jwt", token);
};

const saveUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

const saveExpiresEpoch = (expiresIn: number): void => {
  localStorage.setItem("expiresEpoch", String(expiresIn));
};

const isPotentiallyLoggedIn = (): boolean | string => {
  const token = localStorage.getItem("ds-jwt");
  return token !== null ? token : false;
};

const getUserData = (): boolean | User => {
  const user = localStorage.getItem("user");
  return user !== null ? JSON.parse(user) : false;
};

const getExpiresEpoch = (): number => {
  const expiresIn = localStorage.getItem("expiresEpoch");
  return expiresIn !== null ? Number(expiresIn) : -1;
};

const getActualEpoch = (): number => {
  return Math.floor(Date.now() / 1000);
};

const cleanSavedKeys = (): void => {
  localStorage.removeItem("ds-jwt");
  localStorage.removeItem("user");
  localStorage.removeItem("expiresEpoch");
};

const calculateExpireEpoch = (expiresIn: number): number => {
  return getActualEpoch() + expiresIn - 30;
};

// The expiresEpoch is the past Date.now()/1000 + expiresIn - diff
export const isTokenExpired = (expiresEpoch: number): boolean => {
  const epoch: number = getActualEpoch();
  return epoch >= expiresEpoch;
};

export const refreshToken = async (): Promise<void> => {
  const authStore = useAuthStore();
  const ep = useRuntimeConfig().public.authEndpoints.refresh;
  const { data, error } = await apiFetch<JWTResponse>({
    endpoint: ep,
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
};

export const getUserInfo = async (): Promise<void | ErrorBag> => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const { data: user, error: userError } = await apiFetch<User>({
    endpoint: config.public.authEndpoints.me,
  });
  if (userError) {
    return userError as ErrorBag;
  }

  authStore.user = user!;
  saveUser(authStore.user);
};

export const login = async (
  credentials: DefaultLoginCredentials
): Promise<void | ErrorBag> => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  // Get the access token
  const { data: jwtData, error: jwtError } = await apiFetch<JWTResponse>({
    endpoint: config.public.authEndpoints.login,
    auth: false,
    options: {
      method: "post",
      body: credentials,
    },
  });
  if (jwtError) {
    return jwtError as ErrorBag;
  }
  authStore.token = jwtData!.accessToken;

  // Get the user info
  const failed = await getUserInfo();
  if (failed) {
    return failed as ErrorBag;
  }

  // Final settings
  authStore.expiresEpoch = calculateExpireEpoch(jwtData!.expiresIn);
  saveToken(authStore.token);
  saveExpiresEpoch(authStore.expiresEpoch);
};

export const logout = async (
  fastCall: boolean = false
): Promise<void | ErrorBag> => {
  const authStore = useAuthStore();
  if (fastCall) {
    authStore.$reset();
    cleanSavedKeys();
    return;
  }
  const ep = useRuntimeConfig().public.authEndpoints.logout;
  const { error } = await apiFetch<void>({
    endpoint: ep,
    options: {
      method: "post",
    },
  });
  // The session will be closed in the frontend no matter what
  authStore.$reset();
  cleanSavedKeys();
  if (error) {
    return error as ErrorBag;
  }
};

export const loadUserData = (): void => {
  const authStore = useAuthStore();
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
};
