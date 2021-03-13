
import clsx from 'clsx';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const InterlayLink = ({
  className,
  children,
  ...rest
}: Props & React.ComponentPropsWithoutRef<'a'>) => (
  <a
    className={clsx(
      'text-black',
      className
    )}
    {...rest}>
    {children}
  </a>
);

export default InterlayLink;
