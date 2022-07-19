import clsx from 'clsx';

const CLASS_NAMES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark'
});

// MEMO: inspired by https://mui.com/components/buttons/
const BORDER_CLASSES = clsx(
  'border',
  'border-black',
  'border-opacity-25',
  'dark:border-white',
  'dark:border-opacity-25'
);
const DISABLED_BORDER_CLASSES = clsx(
  'border',
  'border-black',
  'border-opacity-10',
  'dark:border-white',
  'dark:border-opacity-10'
);

// MEMO: inspired by https://mui.com/customization/dark-mode/#dark-mode-with-custom-palette
const DISABLED_BACKGROUND_CLASSES = clsx('bg-black', 'bg-opacity-10', 'dark:bg-white', 'dark:bg-opacity-10');
const DISABLED_TEXT_CLASSES = clsx('text-black', 'text-opacity-25', 'dark:text-white', 'dark:text-opacity-30');

const TEXT_CLASSES = clsx('text-black', 'text-opacity-90', 'dark:text-white');

export {
  BORDER_CLASSES,
  CLASS_NAMES,
  DISABLED_BACKGROUND_CLASSES,
  DISABLED_BORDER_CLASSES,
  DISABLED_TEXT_CLASSES,
  TEXT_CLASSES
};
