import { ForwardRefExoticComponent, RefAttributes } from 'react';

import { IconProps } from '../Icon';

export type CoinComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
