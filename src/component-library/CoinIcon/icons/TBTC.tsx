import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const TBTC = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>TBTC</title>
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none'>
      <path
        fill='#000'
        stroke='#000'
        d='M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12Z'
      />
      <path fill='#fff' d='M10.177 11.078H8.335v1.842h1.842v-1.842ZM8.334 9.236H6.492v1.842h1.842V9.236Z' />
      <path
        fill='#fff'
        d='M6.493 11.078H4.65v1.842h1.842v-1.842ZM8.334 12.92H6.492v1.842h1.842V12.92ZM18.805 9.633c-.13-1.355-1.3-1.81-2.776-1.94v-.867h-1.143v.818c-.3 0-.608.006-.913.012v-.83H12.83v.867c-.248.004-1.768.003-1.768.003l-.004 1.008.954.005v6.608h-.954l-.008.994c.277 0 1.51.005 1.777.007v.856h1.143v-.836c.313.007.617.01.913.01v.826h1.144v-.852c1.923-.11 3.27-.594 3.437-2.399.135-1.454-.548-2.102-1.64-2.366.663-.34 1.077-.933.98-1.924Zm-1.602 4.063c0 1.42-2.432 1.258-3.208 1.258v-2.518c.776 0 3.207-.221 3.208 1.26Zm-.53-3.553c0 1.292-2.03 1.14-2.676 1.14V9c.647 0 2.676-.205 2.675 1.143Z'
      />
    </svg>
  </Icon>
));

TBTC.displayName = 'TBTC';

export { TBTC };
