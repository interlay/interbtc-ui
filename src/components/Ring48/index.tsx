
import clsx from 'clsx';

const Ring48 = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'w-48',
      'h-48',
      'ring-4',
      'rounded-full',
      'inline-flex',
      'flex-col',
      'items-center',
      'justify-center',
      className
    )}
    {...rest} />
);

const Ring48Title = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      'text-base',
      className
    )}
    {...rest} />
);

const Ring48Value = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      'text-2xl',
      'font-medium',
      className
    )}
    {...rest} />
);

export {
  Ring48Title,
  Ring48Value
};

export default Ring48;
