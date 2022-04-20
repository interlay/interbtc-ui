import { forwardRef } from 'react';
import { PrimaryCTA, SecondaryCTA } from './CTA.style';

interface CTAProps extends React.ComponentPropsWithRef<'button'> {
  disabled?: boolean;
  variant: 'primary' | 'secondary';
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(({
  disabled = false,
  variant,
  onClick,
  className,
  children,
  ...rest
}, ref): JSX.Element => variant === 'primary' ? (
  <PrimaryCTA
    disabled={disabled}
    ref={ref}
    onClick={onClick}
    className={className}
    {...rest}>
    {children}
  </PrimaryCTA>
) : (
  <SecondaryCTA
    disabled={disabled}
    ref={ref}
    onClick={onClick}
    className={className}
    {...rest}>
    {children}
  </SecondaryCTA>
));

CTA.displayName = 'Button';

export { CTA };
export type { CTAProps };
