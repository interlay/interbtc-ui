import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const ChevronDown = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    {...props}
    ref={ref}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
  </Icon>
));

ChevronDown.displayName = 'ChevronDown';

export { ChevronDown };
