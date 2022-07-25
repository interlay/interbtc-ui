import { forwardRef } from 'react';

import { OutlinedCTA, PrimaryCTA, SecondaryCTA } from './CTA.style';

interface CTAProps extends React.ComponentPropsWithRef<'button'> {
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'outlined';
  fullWidth?: boolean;
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  ({ disabled = false, variant, fullWidth = false, onClick, className, children, ...rest }, ref): JSX.Element => {
    const props = {
      as: 'button' as keyof JSX.IntrinsicElements,
      disabled,
      $fullWidth: fullWidth,
      ref,
      onClick,
      className,
      children,
      ...rest
    };

    switch (variant) {
      case 'primary':
        return <PrimaryCTA {...props} />;
      case 'secondary':
        return <SecondaryCTA {...props} />;
      case 'outlined':
        return <OutlinedCTA {...props} />;
    }
  }
);

CTA.displayName = 'CTA';

export { CTA };
export type { CTAProps };
