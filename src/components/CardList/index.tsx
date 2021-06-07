
import clsx from 'clsx';

const CardListItem = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'li'>): JSX.Element => (
  <li
    style={{ minHeight: 90 }}
    className={clsx(
      'flex',
      'flex-col',
      'p-5',
      'rounded-lg',
      'bg-gray-100',
      'space-y-2',
      className
    )}
    {...rest} />
);

const CardListItemHeader = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h2'>): JSX.Element => (
  <h6
    className={clsx(
      'text-sm',
      'font-medium',
      className
    )}
    {...rest}>
    {children}
  </h6>
);

const CardListItemContent = (props: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div {...props} />
);

const CardListHeader = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h2'>): JSX.Element => (
  <h2
    className={clsx(
      'text-2xl',
      'text-gray-400',
      'font-medium',
      className
    )}
    {...rest}>
    {children}
  </h2>
);

const CardList = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => (
  <ul
    className={clsx(
      'grid',
      className
    )}
    {...rest}>
  </ul>
);

const CardListContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'space-y-5',
      className
    )}
    {...rest} />
);

export type CardListContainerProps = React.ComponentPropsWithRef<'div'>;

export {
  CardListHeader,
  CardListItem,
  CardListItemHeader,
  CardListItemContent,
  CardListContainer
};

export default CardList;
