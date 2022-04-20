import { forwardRef } from 'react';
import { PrimaryCTA } from './CTA.style';

interface CTAProps extends React.ComponentPropsWithRef<'button'> {
  disabled?: boolean;
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(({
  disabled = false,
  onClick,
  className,
  children,
  ...rest
}, ref): JSX.Element => (
  <PrimaryCTA
    disabled={disabled}
    ref={ref}
    onClick={onClick}
    className={className}
    {...rest}>
    {children}
  </PrimaryCTA>)
);

CTA.displayName = 'Button';

export { CTA };
export type { CTAProps };
