import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { loadUserData } from "~/services/auth";
import ExpiredTokenException from "~/utils/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/utils/exceptions/InvalidTokenException";
export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return;
  try {
    loadUserData();
  } catch (error: any) {
    // This error handling needs to be changed when the UI is implemented
    if (error instanceof ExpiredTokenException) {
      console.log('Token expirado');
    }
    if (error instanceof InvalidTokenException) {
      console.log('Token inválido');
    }
  }
});