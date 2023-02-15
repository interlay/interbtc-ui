import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const ArrowRight = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon ref={ref} xmlns='http://www.w3.org/2000/svg' stroke='none' viewBox='0 0 24 24' fill='currentColor' {...props}>
    <path d='M2.4 12C2.4 6.708 6.708 2.4 12 2.4C17.292 2.4 21.6 6.708 21.6 12C21.6 17.292 17.292 21.6 12 21.6C6.708 21.6 2.4 17.292 2.4 12ZM-7.52913e-07 12C-3.37305e-07 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 -1.52082e-06 12 -1.31911e-06C5.376 -1.11739e-06 -1.16852e-06 5.376 -7.52913e-07 12ZM12 10.8L7.2 10.8L7.2 13.2L12 13.2L12 16.8L16.8 12L12 7.2L12 10.8Z' />
  </Icon>
));

ArrowRight.displayName = 'ArrowRight';

export { ArrowRight };
