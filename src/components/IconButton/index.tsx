
import clsx from 'clsx';

import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

type CustomProps = {
  pending?: boolean;
}

const IconButton = ({
  children,
  pending = false,
  className,
  ...rest
}: Props): JSX.Element => (
  <button
    className={clsx(
      'rounded-full',
      'grid',
      'place-items-center',
      'hover:bg-black',
      'hover:bg-opacity-5',
      'dark:hover:bg-white',
      'dark:hover:bg-opacity-10',
      'transition-colors',
      'focus:outline-none',
      'focus:ring',
      'focus:border-primary-300',
      'focus:ring-primary-200',
      'focus:ring-opacity-50',
      { 'cursor-wait pointer-events-none':
        pending },
      className
    )}
    {...rest}>
    {pending ? (
      <SpinIcon
        className={clsx(
          'animate-spin',
          'w-5',
          'h-5'
        )} />
    ) : children}
  </button>
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;

export default IconButton;
