import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const LKSM = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>LKSM</title>
    <path
      d='M59 30c0 16.016-12.984 29-29 29S1 46.016 1 30 13.984 1 30 1s29 12.984 29 29Z'
      fill='#fff'
      stroke='#EC1F52'
      strokeWidth='2'
    />
    <mask id='a' style={{ maskType: 'alpha' }} maskUnits='userSpaceOnUse' x='7' y='17' width='41' height='26'>
      <path d='M7.5 17.5h40.332v24.624H7.5V17.5Z' fill='#fff' />
    </mask>
    <g mask='url(#a)'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M45.462 18.818c-.603-.475-1.331-1.127-2.646-1.297-1.24-.162-2.497.665-3.348 1.212-.852.548-2.464 2.16-3.133 2.647-.67.486-2.373.942-5.11 2.585-2.738 1.643-13.505 8.547-13.505 8.547l2.798.03-12.47 6.449h1.246L7.5 40.359s1.581.426 2.92-.425l.005.384s14.86-5.858 17.74-4.337l-1.746.515c.152 0 2.98.183 2.98.183s.092 1.764 1.795 2.89c1.704 1.125 1.734 1.733 1.734 1.733s-.882.366-.882.822c0 0 1.308-.396 2.525-.365a9.3 9.3 0 0 1 2.28.365s-.09-.487-1.277-.822c-1.186-.334-2.342-1.611-2.92-2.311-.578-.7-.966-1.947-.483-3.194.41-1.059 1.832-1.644 4.772-3.163 3.469-1.792 4.258-3.133 4.745-4.168.486-1.033 1.217-3.102 1.62-4.075.516-1.248 1.148-1.916 1.665-2.312.517-.396 2.86-1.277 2.86-1.277s-1.789-1.527-2.37-1.984Z'
        fill='#EC1F52'
      />
    </g>
  </Icon>
));

LKSM.displayName = 'LKSM';

export { LKSM };
