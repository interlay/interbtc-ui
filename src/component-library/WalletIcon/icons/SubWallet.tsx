import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const SubWallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    {...props}
    ref={ref}
    viewBox='0 0 78 78'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
  >
    <title>SubWallet</title>
    <g clipPath='url(#clip0_614_3)'>
      <path
        d='M39 78C60.5391 78 78 60.5391 78 39C78 17.4609 60.5391 0 39 0C17.4609 0 0 17.4609 0 39C0 60.5391 17.4609 78 39 78Z'
        fill='#080120'
      />
      <path
        d='M21 16V39.5L43.5 48.5L31.5 53.5V49.5L26 47.5L21 50V64L27 67L57.5 53.5V44L30 33V26.5L51.5 35L57.5 32.5V25L27.5 13L21 16Z'
        fill='url(#paint0_linear_614_3)'
      />
    </g>
    <defs>
      <linearGradient id='paint0_linear_614_3' x1='25' y1='14' x2='52' y2='58.5' gradientUnits='userSpaceOnUse'>
        <stop offset='0.00563331' stopColor='#27F8AD' />
        <stop offset='1' stopColor='#024DFD' />
      </linearGradient>
      <clipPath id='clip0_614_3'>
        <rect width='78' height='78' fill='white' />
      </clipPath>
    </defs>
  </Icon>
));

SubWallet.displayName = 'SubWallet';

export { SubWallet };
