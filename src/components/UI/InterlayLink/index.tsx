import clsx from 'clsx';
import * as React from 'react';

const InterlayLink = ({ className, children, ...rest }: Props): JSX.Element => (
  <a className={clsx('hover:underline', className)} {...rest}>
    {children}
  </a>
);

export type Props = React.ComponentPropsWithRef<'a'>;

export default InterlayLink;
