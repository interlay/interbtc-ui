
import clsx from 'clsx';

const RequestWrapper = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'flex-col',
      'items-center',
      'space-y-6',
      className
    )}
    {...rest} />
);

export default RequestWrapper;
