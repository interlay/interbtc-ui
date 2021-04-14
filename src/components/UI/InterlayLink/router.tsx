
import {
  Link,
  LinkProps
} from 'react-router-dom';
import clsx from 'clsx';

// TODO: https://reactrouter.com/web/api/Link/component-reactcomponent does not work for no reason
import styles from './interlay-link.module.css';

const InterlayRouterLink = ({
  className,
  children,
  ...rest
}: LinkProps): JSX.Element => (
  <Link
    className={clsx(
      styles['interlay-link'],
      'text-black',
      className
    )}
    {...rest}>
    {children}
  </Link>
);

export default InterlayRouterLink;
