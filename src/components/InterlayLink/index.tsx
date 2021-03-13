
import * as React from 'react';
import clsx from 'clsx';

import styles from './interlay-link.module.css';

type Ref = HTMLAnchorElement;

const InterlayLink = React.forwardRef<Ref, React.ComponentPropsWithoutRef<'a'>>(({
  className,
  children,
  ...rest
}, ref) => (
  <a
    ref={ref}
    className={clsx(
      styles['interlay-link'],
      'text-black', // TODO: should double-check the necessity after removing bootstrap's `reboot`
      className
    )}
    {...rest}>
    {children}
  </a>
));

export default InterlayLink;
