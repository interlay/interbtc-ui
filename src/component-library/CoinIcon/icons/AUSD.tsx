import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const AUSD = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>AUSD</title>
    <g clipPath='url(#clip0_23_38)'>
      <circle cx='12' cy='12' r='11.5' fill='url(#paint0_linear_23_38)' stroke='#393939' />
      <g clipPath='url(#clip1_23_38)'>
        <path d='M11.9988 5L11.9114 5.29625V13.8921L11.9988 13.9791L15.9976 11.6205L11.9988 5Z' fill='#343434' />
        <path d='M11.9988 5L8 11.6205L11.9988 13.9791V9.8069V5Z' fill='#8C8C8C' />
        <path d='M11.9988 14.7345L11.9496 14.7945V17.8564L11.9988 17.9999L16 12.3772L11.9988 14.7345Z' fill='#3C3C3B' />
        <path d='M11.9988 17.9999V14.7345L8 12.3772L11.9988 17.9999Z' fill='#8C8C8C' />
        <path d='M11.9988 13.9791L15.9976 11.6205L11.9988 9.8069V13.9791Z' fill='#141414' />
        <path d='M8 11.6205L11.9988 13.9791V9.8069L8 11.6205Z' fill='#393939' />
      </g>
    </g>
    <defs>
      <linearGradient id='paint0_linear_23_38' x1='12' y1='0' x2='12' y2='24' gradientUnits='userSpaceOnUse'>
        <stop stopColor='white' />
        <stop offset='1' stopColor='#D8D6D6' />
      </linearGradient>
      <clipPath id='clip0_23_38'>
        <rect width='24' height='24' fill='white' />
      </clipPath>
      <clipPath id='clip1_23_38'>
        <rect width='8' height='13' fill='white' transform='translate(8 5)' />
      </clipPath>
    </defs>
  </Icon>
));

AUSD.displayName = 'AUSD';

export { AUSD };
