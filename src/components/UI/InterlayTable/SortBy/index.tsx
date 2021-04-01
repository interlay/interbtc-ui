
import clsx from 'clsx';
import styles from './sort-by.module.css';

interface Props {
  isSorted: boolean;
  isSortedDesc?: boolean;
}

const SortByContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'flex',
      'items-center',
      className
    )}
    {...rest} />
);

const SortBy = ({
  isSorted,
  isSortedDesc
}: Props) => (
  <span
    className={clsx(
      styles['sort-by'],
      { [styles['sort-by-ascending']]: isSorted && !isSortedDesc },
      { [styles['sort-by-descending']]: isSorted && isSortedDesc }
    )} />
  // TODO: could extend `before` & `after` variants in the tailwindcss theme
  // <span
  //   className={clsx(
  //     'relative',
  //     'before:border-b-4',
  //     'before:border-solid',
  //     'before:border-red-500',
  //     'before:empty-content',
  //     'before:block',
  //     'before:h-0',
  //     'before:right-1',
  //     'before:top-1/2',
  //     'before:absolute',
  //     'before:w-0',
  //     'before:-mt-2',
  //     'after:border-b-4',
  //     'after:border-solid',
  //     'after:border-red-500',
  //     'after:empty-content',
  //     'after:block',
  //     'after:h-0',
  //     'after:right-1',
  //     'after:top-1/2',
  //     'after:absolute',
  //     'after:w-0',
  //     'after:mt-0.5'
  //   )} />
);

export {
  SortByContainer
};

export default SortBy;
