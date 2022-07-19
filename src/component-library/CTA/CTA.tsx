import { forwardRef } from 'react';

import { PrimaryCTA, SecondaryCTA } from './CTA.style';

interface CTAProps extends React.ComponentPropsWithRef<'button'> {
  disabled?: boolean;
  variant: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  ({ disabled = false, variant, fullWidth = false, onClick, className, children, ...rest }, ref): JSX.Element =>
    variant === 'primary' ? (
      <PrimaryCTA
        as='button'
        $fullWidth={fullWidth}
        disabled={disabled}
        ref={ref}
        onClick={onClick}
        className={className}
        {...rest}
      >
        {children}
      </PrimaryCTA>
    ) : (
      <SecondaryCTA
        as='button'
        $fullWidth={fullWidth}
        disabled={disabled}
        ref={ref}
        onClick={onClick}
        className={className}
        {...rest}
      >
        {children}
      </SecondaryCTA>
    )
);

CTA.displayName = 'CTA';

export { CTA };
export type { CTAProps };
