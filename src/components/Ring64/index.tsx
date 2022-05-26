import clsx from 'clsx';

const Ring64 = ({ className, ...rest }: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'w-64',
      'h-64',
      'ring-4',
      'rounded-full',
      'inline-flex',
      'flex-col',
      'items-center',
      'justify-center',
      className
    )}
    {...rest}
  />
);

const Ring64Title = ({ className, children, ...rest }: React.ComponentPropsWithRef<'h1'>): JSX.Element => (
  <h1 className={clsx('font-bold', 'text-3xl', className)} {...rest}>
    {children}
  </h1>
);

const Ring64Value = ({ className, children, ...rest }: React.ComponentPropsWithRef<'h2'>): JSX.Element => (
  <h2 className={clsx('text-base', 'font-bold', className)} {...rest}>
    {children}
  </h2>
);

export { Ring64Title, Ring64Value };

export default Ring64;
