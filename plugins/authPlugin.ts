import { defineNuxtPlugin } from "nuxt/app";
import { Directive, DirectiveBinding } from "vue";
import useAuthStore from "~/stores/authStore";

// Idea taken from: https://github.com/dystcz/nuxt-permissions/blob/main/src/runtime/plugin.ts
// By default, this directive will check if the user have any of the permissions passed
// as value. The value have to be a string or an array of strings.
// If the directive call comes with the every arg, it will check if the user have
// all of the permissions passed as value.
export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  nuxtApp.vueApp.directive("can", <Directive<HTMLElement, string | string[]>>{
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const permissions =
        binding.value instanceof Array ? binding.value : [binding.value];
      const checker =
        binding.arg === "every"
          ? authStore.hasEveryPermissions
          : authStore.hasAnyPermission;
      const check = checker(permissions);
      if (!check) el.remove();
    },
    getSSRProps(binding: DirectiveBinding) {
      const permissions =
        binding.value instanceof Array ? binding.value : [binding.value];
      const checker =
        binding.arg === "every"
          ? authStore.hasEveryPermissions
          : authStore.hasAnyPermission;
      if (checker(permissions)) {
        return { style: "display:none" };
      }
      return {};
    },
  });
});
