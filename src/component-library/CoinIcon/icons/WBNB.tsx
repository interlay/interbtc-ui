import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const WBNB = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>WBNB</title>
    <g clipPath='url(#wbnb-a)'>
      <path
        fill='#F0B90B'
        fillRule='evenodd'
        d='M12 0c6.628 0 12 5.372 12 12s-5.372 12-12 12S0 18.628 0 12 5.372 0 12 0Z'
        clipRule='evenodd'
      />
      <path
        fill='#fff'
        d='m6.595 12 .009 3.173L9.3 16.76v1.857l-4.274-2.506v-5.039l1.57.928Zm0-3.173v1.849l-1.57-.929V7.898l1.57-.929 1.578.93-1.578.928Zm3.831-.929 1.57-.929 1.578.93-1.578.928-1.57-.929Z'
      />
      <path
        fill='#fff'
        d='M7.73 14.515v-1.857l1.57.928v1.85l-1.57-.92Zm2.696 2.91 1.57.929 1.578-.929v1.849l-1.578.929-1.57-.929v-1.849Zm5.4-9.527 1.57-.929 1.578.93v1.848l-1.578.929v-1.85l-1.57-.928Zm1.57 7.275L17.405 12l1.57-.929v5.039l-4.274 2.506V16.76l2.695-1.586Z'
      />
      <path fill='#fff' d='m16.27 14.515-1.57.92v-1.849l1.57-.928v1.857Z' />
      <path
        fill='#fff'
        d='m16.27 9.485.009 1.857-2.704 1.587v3.18l-1.57.92-1.57-.92v-3.18L7.73 11.342V9.485l1.577-.93 2.687 1.595L14.7 8.556l1.578.929h-.007ZM7.73 6.313l4.266-2.516 4.274 2.515-1.57.93-2.704-1.595L9.3 7.241l-1.57-.928Z'
      />
    </g>
    <defs>
      <clipPath id='wbnb-a'>
        <path fill='#fff' d='M0 0h24v24H0z' />
      </clipPath>
    </defs>
  </Icon>
));

WBNB.displayName = 'WBNB';

export { WBNB };
