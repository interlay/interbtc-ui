
import clsx from 'clsx';

const InfoMessage = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p
    className={clsx(
      'text-xs',
      'px-0.5',
      'py-0.5',
      'h-10',
      className
    )}
    {...rest} />
);

export default InfoMessage;
