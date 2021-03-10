
import clsx from 'clsx';

import styles from './card-list.module.css';

interface CardProps {
  className?: string;
}

const Card = ({
  className,
  ...rest
}: CardProps & React.ComponentPropsWithoutRef<'li'>) => (
  <li
    className={clsx(styles['card'], className)}
    {...rest} />
);

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader = ({
  className,
  children,
  ...rest
}: CardHeaderProps & React.ComponentPropsWithoutRef<'h2'>) => (
  <h2
    className={clsx(styles['card-header'], className)}
    {...rest}>
    {children}
  </h2>
);

interface CardBodyProps {
  className?: string;
}

const CardBody = ({
  className,
  ...rest
}: CardBodyProps & React.ComponentPropsWithoutRef<'div'>) => (
  <div
    className={clsx(styles['card-body'], className)}
    {...rest} />
);

interface CardListProps {
  className?: string;
}

const CardList = ({
  className,
  ...rest
}: CardListProps & React.ComponentPropsWithoutRef<'ul'>) => (
  <ul
    className={clsx(styles['card-list'], className)}
    {...rest} />
);

export {
  Card,
  CardHeader,
  CardBody
};

export default CardList;
