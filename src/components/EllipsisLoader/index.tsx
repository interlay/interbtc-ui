
import clsx from 'clsx';

import styles from './three-dot-loader.module.css';

interface Props {
  className?: string;
  dotClassName?: string;
}

const EllipsisLoader = ({
  className,
  dotClassName
}: Props): JSX.Element => (
  <div className={clsx(styles['lds-ellipsis'], className)}>
    {Array<number>(4)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className={dotClassName || styles['lds-ellipsis-default-bg-color']} />
      ))}
  </div>
);

export default EllipsisLoader;
