import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const BIFROST_POLKADOT = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>BIFROST_POLKADOT</title>
    <g clipPath='url(#clip0_232_11)'>
      <path
        d='M12 0.5C18.3513 0.5 23.5 5.64873 23.5 12C23.5 18.3513 18.3513 23.5 12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64873 5.64873 0.5 12 0.5Z'
        fill='black'
        stroke='url(#paint0_linear_232_11)'
      />
      <path d='M18.375 7.125H15.1875L5.625 16.5H12L18.375 7.125Z' fill='url(#paint1_linear_232_11)' />
    </g>
    <defs>
      <linearGradient id='paint0_linear_232_11' x1='12' y1='0' x2='12' y2='24' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#BD57A2' />
        <stop offset='1' stopColor='#F1B844' />
      </linearGradient>
      <linearGradient id='paint1_linear_232_11' x1='12' y1='7.125' x2='12' y2='16.5' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#7AEDCF' />
        <stop offset='0.201333' stopColor='#68CEFA' />
        <stop offset='0.403244' stopColor='#689CF8' />
        <stop offset='0.602076' stopColor='#AC57C0' />
        <stop offset='0.801867' stopColor='#E65659' />
        <stop offset='1' stopColor='#F2C241' />
      </linearGradient>
      <clipPath id='clip0_232_11'>
        <rect width='24' height='24' fill='white' />
      </clipPath>
    </defs>
  </Icon>
));

BIFROST_POLKADOT.displayName = 'KINTSUGI';

export { BIFROST_POLKADOT };
