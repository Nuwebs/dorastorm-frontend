import { inject } from 'vue';
import {
  PROVIDER_KEY,
  type UiAlertDialogProps,
  type UiAlertDialogProvider
} from '~/components/ui/alert-dialog';

export default function useConfirmDialog() {
  const dialogProvider = inject<UiAlertDialogProvider | null>(
    PROVIDER_KEY,
    null
  );

  if (!dialogProvider) {
    throw new Error(
      'useAlertDialog must be used with a UiAlertDialogProvider, check the app.vue or your template.'
    );
  }

  async function require(options: UiAlertDialogProps) {
    const result = await dialogProvider!.addDialog(options);
    dialogProvider!.removeDialog();
    return result;
  }

  return {
    require
  };
}
