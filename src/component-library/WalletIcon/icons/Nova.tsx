import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const Nova = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon
    {...props}
    ref={ref}
    enableBackground='new 0 0 324 324'
    viewBox='0 0 324 324'
    xmlns='http://www.w3.org/2000/svg'
  >
    <title>Nova</title>
    <radialGradient
      id='novaIconRadialGradient'
      cx='8.15'
      cy='19.93'
      r='372.636'
      gradientTransform='matrix(1 0 0 -1 0 326)'
      gradientUnits='userSpaceOnUse'
    >
      <stop offset='0.053' stopColor='#d7d3e9'></stop>
      <stop offset='0.193' stopColor='#a19cde'></stop>
      <stop offset='0.383' stopColor='#696bd9'></stop>
      <stop offset='0.54' stopColor='#3a5ae7'></stop>
      <stop offset='0.773' stopColor='#225fe7'></stop>
      <stop offset='1' stopColor='#0883d1'></stop>
    </radialGradient>
    <path
      fill='url(#novaIconRadialGradient)'
      d='M84.1 0h155.8C286.3 0 324 37.7 324 84.1v155.8c0 46.5-37.7 84.1-84.1 84.1H84.1C37.7 324 0 286.3 0 239.9V84.1C0 37.7 37.7 0 84.1 0z'
    ></path>
    <path
      fill='#fff'
      d='M275 166.7v3c-18.4 2.9-58 9.8-77.5 17.2-7 2.7-12.5 8.1-15.2 15.1-7.4 19.4-14.4 59.2-17.3 77.7h-6c-2.9-18.5-9.9-58.4-17.3-77.7-2.7-6.9-8.2-12.4-15.2-15.1-19.5-7.5-59-14.3-77.5-17.2v-6c18.4-2.9 58-9.8 77.5-17.2 7-2.7 12.5-8.1 15.2-15.1 7.5-19.4 14.4-59.2 17.3-77.7h6c2.9 18.5 9.9 58.3 17.3 77.7 2.7 6.9 8.2 12.4 15.2 15.1 19.5 7.4 59.1 14.3 77.5 17.2v3z'
    ></path>
  </Icon>
));

Nova.displayName = 'Talisman';

export { Nova };
