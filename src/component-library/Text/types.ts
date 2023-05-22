import { HTMLAttributes } from 'react';

import { Colors, FontSize, FontWeight, NormalAlignments } from '../utils/prop-types';

type Props = {
  color?: Colors;
  size?: FontSize;
  align?: NormalAlignments;
  weight?: FontWeight;
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextProps };
