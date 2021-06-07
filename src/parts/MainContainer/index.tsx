
import clsx from 'clsx';

// TODO: should double-check as it's a temporary alternative
const MainContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'pb-7',
      'xl:pb-10',
      className
    )}
    {...rest} />
);

export default MainContainer;
