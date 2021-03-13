
import clsx from 'clsx';

interface CardProps {
  className?: string;
}

const Card = ({
  className,
  ...rest
}: CardProps & React.ComponentPropsWithoutRef<'li'>) => (
  <li
    className={clsx(
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'lg:w-80',
      'h-32',
      'px-4',
      'py-8',
      'my-4',
      'lg:m-2',
      'rounded',
      'border',
      'border-solid',
      'border-gray-300',
      'shadow-sm',
      className
    )}
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
    // TODO: hardcoded for now
    style={{ fontFamily: 'airbnb-cereal-bold' }}
    className={clsx(
      'text-base',
      'font-bold',
      className
    )}
    {...rest}>
    {children}
  </h2>
);

interface CardBodyProps {
  className?: string;
}

const CardBody = (props: CardBodyProps & React.ComponentPropsWithoutRef<'div'>) => (
  <div {...props} />
);

interface CardListProps {
  className?: string;
}

const CardList = ({
  className,
  ...rest
}: CardListProps & React.ComponentPropsWithoutRef<'ul'>) => (
  <ul
    className={clsx(
      'lg:flex',
      'lg:justify-center',
      'lg:flex-wrap',
      className
    )}
    {...rest} />
);

export {
  Card,
  CardHeader,
  CardBody
};

export default CardList;
