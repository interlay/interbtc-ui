import { ElementType } from 'react';

import { theme } from '../theme';

export const tuple = <T extends string[]>(...args: T): T => args;

export const variant = tuple('primary', 'secondary', 'tertiary');

export const ctaVariant = tuple('primary', 'secondary', 'outlined', 'text');

export const status = tuple('error', 'warning', 'success');

export const sizes = tuple('small', 'medium', 'large');

// TODO: add info
export const colors = tuple('primary', 'secondary', 'tertiary', 'success', 'warning', 'error');

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

export type CardVariants = 'default' | 'bordered';

export type ListVariants = Exclude<Variants, 'tertiary'> | 'card';

export type MeterVariants = Exclude<Variants, 'tertiary'>;

export type DividerVariants = Colors | 'default';

export type CTASizes = 'x-small' | 'small' | 'medium' | 'large';

export type Status = typeof status[number];

export type Sizes = typeof sizes[number];

export type Colors = typeof colors[number];

export type JustifyContent = typeof justifyContent[number];

export type AlignItems = typeof alignItems[number];

export type Wrap = typeof wrap[number];

export type AlignSelf = typeof alignSelf[number];

export type NormalAlignments = typeof normalAlignments[number];

export type Direction = typeof direction[number];

export type FontSize = keyof typeof theme.text;

export type Spacing = keyof typeof theme.spacing;

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export interface ElementTypeProp {
  elementType?: ElementType;
}

export interface MarginProps {
  margin?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  marginRight?: Spacing;
  marginX?: Spacing;
  marginY?: Spacing;
}

export type ResponsiveProp<T extends number | string> = T | Partial<{ [K in BreakPoints]: T }>;

export type FontWeight = keyof typeof theme.fontWeight;

export type Orientation = 'horizontal' | 'vertical';

export type IconSize = keyof typeof theme.icon.sizes;

export type Overflow = 'auto' | 'hidden' | 'scroll' | 'visible' | 'inherit';

export type BreakPoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ProgressBarColors = 'default' | 'red';

export type BorderRadius = keyof typeof theme.rounded;
