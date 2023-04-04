import { forwardRef } from 'react';

import { WalletIconProps } from './WalletIcon';
import { StyledFallbackIcon } from './WalletIcon.style';

const FallbackIcon = forwardRef<SVGSVGElement, WalletIconProps>(
  ({ name, ...props }, ref): JSX.Element => (
    <StyledFallbackIcon {...props} ref={ref} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <title>{name}</title>
      <circle cx='12' cy='12' r='11.5' fill='currentColor' />
    </StyledFallbackIcon>
  )
);

FallbackIcon.displayName = 'FallbackIcon';

export { FallbackIcon };
