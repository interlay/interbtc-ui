import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const PlusCircle = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    {...props}
    ref={ref}
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' />
  </Icon>
));

PlusCircle.displayName = 'PlusCircle';

export { PlusCircle };
