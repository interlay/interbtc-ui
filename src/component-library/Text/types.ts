import { HTMLAttributes } from 'react';

import { Colors, FontWeight, NormalAlignments, Sizes } from '../utils/prop-types';

type Props = {
  color?: Colors;
  size?: Sizes;
  align?: NormalAlignments;
  weight?: FontWeight;
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextProps };
