
import clsx from 'clsx';

const MainContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'p-4',
      'lg:p-6',
      'space-y-10',
      'container',
      'mx-auto',
      className
    )}
    {...rest} />
);

export default MainContainer;
