
import * as React from 'react';
import clsx from 'clsx';

import styles from './interlay-link.module.css';

const InterlayLink = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'a'>): JSX.Element => (
  <a
    className={clsx(
      styles['interlay-link'],
      className
    )}
    {...rest}>
    {children}
  </a>
);

export default InterlayLink;
