
import clsx from 'clsx';

import styles from './interlay-link.module.css';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const InterlayLink = ({
  className,
  children,
  ...rest
}: Props & React.ComponentPropsWithoutRef<'a'>) => (
  <a
    className={clsx(styles['interlay-link'], className)}
    {...rest}>
    {children}
  </a>
);

export default InterlayLink;
