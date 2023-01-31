import clsx from 'clsx';

const BoldParagraph = ({ className, ...rest }: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p className={clsx('text-xs', 'xl:text-sm', 'font-bold', 'mb-4', className)} {...rest} />
);

export default BoldParagraph;
