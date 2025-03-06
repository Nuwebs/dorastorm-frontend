import type { ButtonVariants } from '../button';

export { default as UiAlertDialogRoot } from './UiAlertDialogRoot.vue';
export { default as UiAlertDialogAction } from './UiAlertDialogAction.vue';
export { default as UiAlertDialogCancel } from './UiAlertDialogCancel.vue';
export { default as UiAlertDialogContent } from './UiAlertDialogContent.vue';
export { default as UiAlertDialogDescription } from './UiAlertDialogDescription.vue';
export { default as UiAlertDialogFooter } from './UiAlertDialogFooter.vue';
export { default as UiAlertDialogHeader } from './UiAlertDialogHeader.vue';
export { default as UiAlertDialogTitle } from './UiAlertDialogTitle.vue';
export { default as UiAlertDialogTrigger } from './UiAlertDialogTrigger.vue';

export const PROVIDER_KEY: string = 'alertDialogProvider';

export interface UiAlertDialogProps {
  title: string;
  message: string;
  acceptLabel: string;
  rejectLabel: string;

  acceptButtonVariant?: ButtonVariants['variant'];
  cancelButtonVariant?: ButtonVariants['variant'];
}

export interface UiAlertDialogProvider {
  addDialog: (props: UiAlertDialogProps) => Promise<boolean>;
  removeDialog: () => void;
}
