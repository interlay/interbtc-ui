
import clsx from 'clsx';

const SectionTitle = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h2'>): JSX.Element => (
  <h2
    className={clsx(
      'text-2xl',
      'font-medium',
      className
    )}
    {...rest}>
    {children}
  </h2>
);

export default SectionTitle;
