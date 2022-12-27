import { SVGAttributes } from 'react';

import { FontSize } from '../utils/prop-types';

type Props = {
  size?: FontSize;
};

type NativeAttrs<T = unknown> = Omit<SVGAttributes<T>, keyof Props>;

type IconProps<T = unknown> = Props & NativeAttrs<T>;

export type { IconProps };
