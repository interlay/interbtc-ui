import { forwardRef } from 'react';

import { StyledIcon } from '../style';
import { IconProps } from '../types';
import { mapIconProps } from '../utils';

const INTR = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <StyledIcon {...mapIconProps(props)} ref={ref} viewBox='0 0 114 114' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>INTR</title>
    <circle cx='56.7854' cy='56.7854' r='56.7854' fill='white' />
    <circle cx='58.1575' cy='58.9624' r='10.5' fill='black' />
    <path d='M39.3814 41.4624L20.8275 28.4624H75.9336L94.4876 41.4624H39.3814Z' stroke='#181717' strokeWidth='2' />
    <path d='M39.3639 88.4624L21.0138 76.4624H75.9511L94.3012 88.4624H39.3639Z' stroke='#181717' strokeWidth='2' />
  </StyledIcon>
));

INTR.displayName = 'INTR';

export { INTR };
