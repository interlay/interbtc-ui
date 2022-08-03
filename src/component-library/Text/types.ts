import { HTMLAttributes } from 'react';

type TextColor = 'primary' | 'secondary' | 'tertiary';

type Props = {
  color?: TextColor;
};

type NativeAttrs<T = unknown> = Omit<HTMLAttributes<T>, keyof Props>;

type TextProps<T = unknown> = Props & NativeAttrs<T>;

export type { TextColor, TextProps };
