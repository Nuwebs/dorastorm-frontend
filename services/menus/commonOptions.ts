import {
  navigateTo,
  useLocalePath,
  useMenuLocalesSwitch,
  useI18n,
} from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { logout } from "../auth";
import { computed, ComputedRef } from "vue";
import useAuthStore from "~/stores/authStore";

const useCommonOptions = (): ComputedRef<DsMenuItem[]> => {
  const { t } = useI18n();
  const lp = useLocalePath();
  const authStore = useAuthStore();

  const signOut = async (): Promise<void> => {
    await logout();
    navigateTo(lp("/"));
  };

  const menu = computed<DsMenuItem[]>(() => {
    return [
      {
        label: t("general.locales"),
        icon: "pi pi-globe",
        items: useMenuLocalesSwitch(),
      },
      {
        label: t("modules.users.update_self"),
        icon: "pi pi-pencil",
        command: () => navigateTo(lp(`/ds/users/edit-${authStore.user!.id}`))
      },
      {
        separator: true,
      },
      {
        label: t("general.logout"),
        icon: "pi pi-sign-out",
        command: async () => await signOut(),
      },
    ];
  });

  return menu;
};

export default useCommonOptions;
