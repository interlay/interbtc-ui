import { useFocusRing } from '@react-aria/focus';
import { useLink } from '@react-aria/link';
import { mergeProps } from '@react-aria/utils';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { useDOMRef } from '../utils/dom';
import { BaseCTA, BaseCTAProps } from './BaseCTA';

type Props = {
  external?: boolean;
  disabled?: boolean;
};

type NativeAttrs = Omit<LinkProps, keyof Props | 'href' | 'onFocus' | 'onBlur'>;

type AriaAttrs = Omit<NativeAttrs, (keyof Props & NativeAttrs) | 'isDisabled'>;

type InheritAttrs = Omit<BaseCTAProps, (keyof AriaAttrs & NativeAttrs & Props) | 'elementType'>;

type CTALinkProps = Props & NativeAttrs & AriaAttrs & InheritAttrs;

// TODO: Does this need to be changed to a React Router link component?
const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(
  ({ disabled, external, to: toProp, children, ...props }, ref): JSX.Element => {
    const linkRef = useDOMRef(ref);

    const ariaProps = {
      ...props,
      isDisabled: disabled,
      href: toProp,
      ...(external && { target: '_blank', rel: 'noreferrer' })
    };

    const { linkProps } = useLink(ariaProps, linkRef);
    const { focusProps, isFocusVisible } = useFocusRing();

    const to = external && typeof toProp === 'string' ? { pathname: toProp as string } : toProp;

    return (
      <BaseCTA
        ref={linkRef}
        elementType={Link}
        isFocusVisible={isFocusVisible}
        {...mergeProps(props, linkProps, focusProps, {
          href: undefined,
          to,
          ...(external && { target: '_blank', rel: 'noreferrer' })
        })}
      >
        {children}
      </BaseCTA>
    );
  }
);

CTALink.displayName = 'CTALink';

export { CTALink };
export type { CTALinkProps };
