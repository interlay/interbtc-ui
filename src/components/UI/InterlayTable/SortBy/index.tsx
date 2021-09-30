
import clsx from 'clsx';
import styles from './sort-by.module.css';

interface Props {
  isSorted: boolean;
  isSortedDesc?: boolean;
}

const SortByContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'items-center',
      className
    )}
    {...rest} />
);

// TODO: not used for now
const SortBy = ({
  isSorted,
  isSortedDesc
}: Props): JSX.Element => (
  <span
    // TODO: could extend `before` & `after` variants in the tailwindcss theme
    className={clsx(
      styles['sort-by'],
      { 'before:border-black': isSorted && !isSortedDesc },
      { 'after:border-black': isSorted && isSortedDesc }
    )} />
  // <span
  //   className={clsx(
  //     'relative',
  //     'before:border-b-4',
  //     'before:border-solid',
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
