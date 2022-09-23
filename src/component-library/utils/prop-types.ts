export const tuple = <T extends string[]>(...args: T): T => args;

export const variant = tuple('primary', 'secondary', 'outlined');

export const status = tuple('error', 'warning', 'success');

export const simpleSizes = tuple('small', 'medium', 'large');

export const sizes = tuple('xs', 's', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl');

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

export type Variants = typeof variant[number];

export type Status = typeof status[number];

export type SimpleSizes = typeof simpleSizes[number];

export type Sizes = typeof sizes[number];

export type Colors = typeof colors[number];

export type JustifyContent = typeof justifyContent[number];

export type AlignItems = typeof alignItems[number];
