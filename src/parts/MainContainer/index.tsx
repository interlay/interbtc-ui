
import clsx from 'clsx';

const MainContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'p-4',
      'lg:p-6',
      className
    )}
    {...rest} />
);

export default MainContainer;
