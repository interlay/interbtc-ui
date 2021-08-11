
import {
  Link,
  LinkProps
} from 'react-router-dom';

const InterlayRouterLink = ({
  children,
  ...rest
}: LinkProps): JSX.Element => (
  <Link {...rest}>
    {children}
  </Link>
);

export default InterlayRouterLink;
