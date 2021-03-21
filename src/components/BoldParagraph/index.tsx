
import clsx from 'clsx';

const BoldParagraph = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'p'>) => (
  <p
    className={clsx(
      'text-xs',
      'xl:text-sm',
      'font-bold',
      className
    )}
    {...rest} />
);

export default BoldParagraph;
