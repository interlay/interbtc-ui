
import clsx from 'clsx';

import styles from './page-title.module.css';

interface Props {
  mainTitle: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
}

const PageTitle = ({
  className,
  mainTitle,
  subTitle,
  ...rest
}: Props & React.ComponentPropsWithoutRef<'div'>) => (
  <div
    className={clsx(styles['page-title'], className)}
    {...rest}>
    <h2 className={styles['main-title']}>
      {mainTitle}
    </h2>
    {subTitle && (
      <p className={styles['sub-title']}>
        {subTitle}
      </p>
    )}
  </div>
);

export default PageTitle;
