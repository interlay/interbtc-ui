export const tuple = <T extends string[]>(...args: T): T => args;

export const ctaVariants = tuple('primary', 'secondary', 'outlined');

export const status = tuple('error', 'warning', 'success');

export const sizes = tuple('small', 'medium', 'large');

export const colors = tuple('primary', 'secondary', 'tertiary');

export const justifyContent = tuple(
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly'
);

export const alignItems = tuple('flex-start', 'center', 'flex-end', 'stretch', 'baseline');

export type CTAVariants = typeof ctaVariants[number];

export type Status = typeof status[number];

export type Sizes = typeof sizes[number];

export type Colors = typeof colors[number];

export type JustifyContent = typeof justifyContent[number];

export type AlignItems = typeof alignItems[number];
