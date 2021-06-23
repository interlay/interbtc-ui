
import clsx from 'clsx';

interface CustomProps {
  disabled?: boolean;
}

const InterlayButtonBase = ({
  disabled = false,
  className,
  children,
  ...rest
}: Props): JSX.Element => (
  <button
    className={clsx(
      'select-none',
      'transition-colors',
      'inline-flex',
      'items-center',
      'text-center',
      { 'pointer-events-none': disabled },
      className
    )}
    {...rest}>
    {children}
  </button>
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;

export default InterlayButtonBase;
