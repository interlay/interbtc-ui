
import clsx from 'clsx';

// TODO: should double-check as it's a temporary alternative
const MainContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'div'>) => (
  <div
    className={clsx(
      'min-h-screen',
      'py-7',
      'xl:py-10',
      className
    )}
    {...rest} />
);

export default MainContainer;
