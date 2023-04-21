import useAuthStore from "~/stores/authStore";
import { DsLoginCredentials, User } from "~/types/dorastorm";
import { useRuntimeConfig } from "nuxt/app";
import useAuthOptions from "~/composables/useAuthOptions";
import ExpiredTokenException from "~/utils/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/utils/exceptions/InvalidTokenException";
import { ErrorBag, JWTResponse } from "~/types";
import useAPIOptions from "~/composables/useAPIOptions";

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
  try {
    const response = await $fetch<JWTResponse>(ep, useAuthOptions());
    authStore.token = response.accessToken;
    authStore.expiresEpoch = calculateExpireEpoch(response.expiresIn);
    saveToken(authStore.token);
    saveExpiresEpoch(authStore.expiresEpoch);
  } catch (error: any) {
    cleanSavedKeys();
    authStore.$reset();
    if (error.statusCode && error.statusCode === 409)
      throw new ExpiredTokenException("");
    throw new InvalidTokenException("");
  }
};

export const login = async (
  credentials: DsLoginCredentials
): Promise<void | ErrorBag> => {
  const config = useRuntimeConfig();
  let ep = config.public.authEndpoints.login;
  try {
    // Get the access token
    const response = await $fetch<JWTResponse>(ep, {
      ...useAPIOptions(),
      method: "post",
      body: credentials,
    });
    const authStore = useAuthStore();
    authStore.token = response.accessToken;
    ep = config.public.authEndpoints.me;
    // Get the user info
    const user = await $fetch<User>(ep, {
      ...useAuthOptions(),
    });
    authStore.user = user;
    authStore.expiresEpoch = calculateExpireEpoch(response.expiresIn);
    // Save the user info into storage
    saveUser(authStore.user);
    saveToken(authStore.token);
    saveExpiresEpoch(authStore.expiresEpoch);
  } catch (error: any) {
    return error as ErrorBag;
  }
};

export const logout = async (): Promise<void | ErrorBag> => {
  const authStore = useAuthStore();
  const ep = useRuntimeConfig().public.authEndpoints.logout;
  try {
    await $fetch(ep, { ...useAuthOptions(), method: "post" });
    authStore.$reset();
    cleanSavedKeys();
  } catch (error: any) {
    // Possible no internet connection
    return error as ErrorBag;
  }
};

export const loadUserData = (): void => {
  const authStore = useAuthStore();
  authStore.appBooted = true;
  const token = isPotentiallyLoggedIn();
  if (token === false) return cleanSavedKeys();
  const user = getUserData();
  if (user === false) return cleanSavedKeys();

  const expiresEpoch = getExpiresEpoch();

  authStore.token = token as string;
  authStore.user = user as User;
  authStore.expiresEpoch = expiresEpoch;
};
