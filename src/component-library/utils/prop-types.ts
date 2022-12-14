import { ElementType } from 'react';

import { theme } from '../theme';

export const tuple = <T extends string[]>(...args: T): T => args;

export const variant = tuple('primary', 'secondary');

export const ctaVariant = tuple(...variant, 'outlined', 'text');

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

export const normalAlignments = tuple('start', 'center', 'end');

export const direction = tuple('row', 'row-reverse', 'column', 'column-reverse');

export const wrap = tuple('wrap', 'nowrap', 'wrap-reverse');

export const alignSelf = tuple(
  'auto',
  'normal',
  'start',
  'end',
  'center',
  'flex-start',
  'flex-end',
  'self-start',
  'self-end',
  'stretch'
);

export type Variants = typeof variant[number];

export type CTAVariants = typeof ctaVariant[number];

export type Status = typeof status[number];

export type SimpleSizes = typeof simpleSizes[number];

export type Sizes = typeof sizes[number];

export type Colors = typeof colors[number];

export type JustifyContent = typeof justifyContent[number];

export type AlignItems = typeof alignItems[number];

export type Wrap = typeof wrap[number];

export type AlignSelf = typeof alignSelf[number];

export type NormalAlignments = typeof normalAlignments[number];

export type Direction = typeof direction[number];

export type Spacing = keyof typeof theme.spacing;

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export interface AsProp<As extends ElementType = ElementType> {
  as?: As;
}

export type FontWeight = keyof typeof theme.fontWeight;
