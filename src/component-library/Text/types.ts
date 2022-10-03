import { HTMLAttributes } from 'react';

import { Colors } from '../utils/prop-types';

type Props = {
  color?: Colors;
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextProps };
