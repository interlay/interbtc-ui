import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const VDOT = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>VDOT</title>
    <g clipPath='url(#vdot-a)'>
      <path
        fill='#fff'
        d='M24 12.244C24 5.778 18.627.536 12 .536S0 5.778 0 12.244C0 18.709 5.373 23.95 12 23.95s12-5.242 12-11.707Z'
      />
      <path
        fill='#E6007A'
        fillRule='evenodd'
        d='M14.794 6.18c0 .894-1.278 1.619-2.854 1.619-1.575 0-2.853-.725-2.853-1.62 0-.893 1.278-1.618 2.854-1.618 1.575 0 2.853.725 2.853 1.619Zm0 12.2c0 .893-1.278 1.618-2.854 1.618-1.575 0-2.853-.725-2.853-1.619s1.278-1.619 2.854-1.619c1.575 0 2.853.725 2.853 1.62Zm-6.83-8.34c.788-1.331.783-2.773-.011-3.22-.795-.448-2.077.268-2.865 1.6-.788 1.331-.783 2.773.011 3.22.794.448 2.077-.269 2.865-1.6Zm10.818 2.879c.793.447.798 1.888.01 3.22-.788 1.332-2.07 2.048-2.864 1.601-.794-.447-.798-1.889-.01-3.22.788-1.332 2.07-2.048 2.864-1.601Zm-10.829 4.82c.794-.447.8-1.889.011-3.22-.787-1.332-2.07-2.048-2.864-1.6-.795.447-.8 1.889-.012 3.22.788 1.332 2.07 2.048 2.865 1.6Zm10.84-9.318c.788 1.331.783 2.773-.01 3.22-.794.447-2.077-.27-2.865-1.601-.787-1.332-.783-2.773.01-3.22.795-.448 2.077.27 2.865 1.6Z'
        clipRule='evenodd'
      />
      <path
        stroke='url(#vdot-b)'
        d='M22.75 12.244c0 5.774-4.801 10.475-10.75 10.475S1.25 18.018 1.25 12.244 6.051 1.768 12 1.768 22.75 6.47 22.75 12.244Z'
      />
      <path fill='url(#vdot-c)' stroke='#fff' d='M18.5 23.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z' />
      <path
        fill='#fff'
        d='m18.454 20.945-2.404-3.52c-.13-.192.01-.45.246-.45h1.069c.096 0 .185.046.24.122l.854 1.171a.3.3 0 0 0 .482 0l.853-1.171a.298.298 0 0 1 .241-.121h1.069c.236 0 .377.257.246.448l-2.404 3.52a.3.3 0 0 1-.492 0Z'
      />
    </g>
    <defs>
      <linearGradient id='vdot-b' x1='12' x2='12' y1='.536' y2='23.951' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#7AEDCF' />
        <stop offset='.201' stopColor='#68CEFA' />
        <stop offset='.403' stopColor='#689CF8' />
        <stop offset='.602' stopColor='#AC57C0' />
        <stop offset='.802' stopColor='#E65659' />
        <stop offset='1' stopColor='#F2C241' />
      </linearGradient>
      <linearGradient id='vdot-c' x1='17.938' x2='17.938' y1='23' y2='14' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#fff' />
        <stop offset='0' stopColor='#F1B744' />
        <stop offset='.302' stopColor='#D65777' />
        <stop offset='.563' stopColor='#69B4FA' />
        <stop offset='1' stopColor='#79EBD3' />
      </linearGradient>
      <clipPath id='vdot-a'>
        <path fill='#fff' d='M0 0h24v24H0z' />
      </clipPath>
    </defs>
  </Icon>
));

VDOT.displayName = 'VDOT';

export { VDOT };
