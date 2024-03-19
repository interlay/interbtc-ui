import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const BNC = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>BNC</title>
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M0 12C0 5.37259 5.37259 0 12 0C18.6274 0 24 5.37259 24 12C24 18.6274 18.6274 24 12 24C5.37259 24 0 18.6274 0 12Z'
        fill='#F0F2F5'
      />
      <path d='M18.375 7.125H15.1875L5.625 16.5H12L18.375 7.125Z' fill='#363F4D' />
    </svg>
  </Icon>
));

BNC.displayName = 'BNC';

export { BNC };
