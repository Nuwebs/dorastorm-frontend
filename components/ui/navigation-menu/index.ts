import { cva } from 'class-variance-authority';

export { default as UiNavigationMenu } from './UiNavigationMenu.vue';
export { default as UiNavigationMenuContent } from './UiNavigationMenuContent.vue';
export { default as UiNavigationMenuIndicator } from './UiNavigationMenuIndicator.vue';
export { default as UiNavigationMenuItem } from './UiNavigationMenuItem.vue';
export { default as UiNavigationMenuLink } from './UiNavigationMenuLink.vue';
export { default as UiNavigationMenuList } from './UiNavigationMenuList.vue';
export { default as UiNavigationMenuTrigger } from './UiNavigationMenuTrigger.vue';
export { default as UiNavigationMenuViewport } from './UiNavigationMenuViewport.vue';

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-white py-2 px-1 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-zinc-100/50 data-[state=open]:bg-zinc-100/50 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 dark:data-[active]:bg-zinc-800/50 dark:data-[state=open]:bg-zinc-800/50'
);
