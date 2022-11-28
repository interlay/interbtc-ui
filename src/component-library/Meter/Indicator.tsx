import { SVGAttributes } from 'react';

const Indicator = (props: SVGAttributes<unknown>): JSX.Element => (
  <svg width='16' height='14' viewBox='0 0 14 12' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M5.26795 0.999997C6.03775 -0.333336 7.96225 -0.333333 8.73205 1L13.0622 8.5C13.832 9.83334 12.8697 11.5 11.3301 11.5L2.66987 11.5C1.13027 11.5 0.168022 9.83333 0.937822 8.5L5.26795 0.999997Z'
      fill='currentColor'
    />
  </svg>
);

export { Indicator };
