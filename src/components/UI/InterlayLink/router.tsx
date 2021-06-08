
import {
  Link,
  LinkProps
} from 'react-router-dom';
import clsx from 'clsx';

const InterlayRouterLink = ({
  className,
  children,
  ...rest
}: LinkProps): JSX.Element => (
  <Link
    className={clsx(
      'text-black',
      className
    )}
    {...rest}>
    {children}
  </Link>
);

export default InterlayRouterLink;
