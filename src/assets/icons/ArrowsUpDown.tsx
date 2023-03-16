import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const ArrowsUpDown = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    ref={ref}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5'
    />
  </Icon>
));

ArrowsUpDown.displayName = 'ArrowsUpDown';

export { ArrowsUpDown };
