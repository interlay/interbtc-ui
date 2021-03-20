
import clsx from 'clsx';

const Card = ({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'li'>) => (
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

const CardHeader = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<'h2'>) => (
  <h2
    // TODO: hardcoded for now
    style={{
      fontWeight: 700
    }}
    className={clsx(
      'text-base',
      'font-bold',
      className
    )}
    {...rest}>
    {children}
  </h2>
);

const CardContent = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div {...props} />
);

const CardList = ({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'ul'>) => (
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
  CardContent
};

export default CardList;
