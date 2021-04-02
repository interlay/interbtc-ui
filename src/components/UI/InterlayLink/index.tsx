
import * as React from 'react';
import clsx from 'clsx';

import styles from './interlay-link.module.css';

const InterlayLink = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'a'>) => (
  <a
    className={clsx(
      styles['interlay-link'],
      'text-black', // TODO: should double-check the necessity after removing bootstrap's `reboot`
      className
    )}
    {...rest}>
    {children}
  </a>
);

export default InterlayLink;
