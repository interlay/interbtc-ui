import { HTMLAttributes } from 'react';

import { Colors, Sizes } from '../utils/prop-types';

type Props = {
  color?: Colors;
  size?: Sizes;
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextProps };
