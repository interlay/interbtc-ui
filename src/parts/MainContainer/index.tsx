
import clsx from 'clsx';

import styles from './main-container.module.css';

interface Props {
  className?: string;
}

// TODO: should double-check as it's a temporary alternative
const MainContainer = ({
  className,
  ...rest
}: Props & React.ComponentPropsWithoutRef<'div'>) => (
  <div
    className={clsx(styles['main-container'], className)}
    {...rest} />
);

export default MainContainer;
