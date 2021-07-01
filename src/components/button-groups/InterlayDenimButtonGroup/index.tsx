
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

const InterlayDenimButtonGroup = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      'z-0',
      'inline-flex',
      'shadow-sm',
      'rounded-md',
      className
    )}
    {...rest} />
);

interface CustomJadeButtonGroupItemProps {
  pending?: boolean;
}

const InterlayDenimButtonGroupItem = ({
  className,
  children,
  disabled = false,
  pending = false,
  ...rest
}: CustomJadeButtonGroupItemProps & InterlayButtonBaseProps): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <InterlayButtonBase
      style={{
        height: 38
      }}
      type='button'
      className={clsx(
        'focus:outline-none',
        'focus:ring-2',
        'focus:border-interlayDenim-300',
        'focus:ring-interlayDenim-200',
        'focus:ring-opacity-50',

        'border',
        'border-gray-300',
        'font-medium',
        'shadow-sm',
        'text-white',
        'bg-interlayDenim-600',
        'hover:bg-interlayDenim-700',

        'first:rounded-l',
        'last:rounded-r',
        'px-4',
        'py-2',
        'text-sm',
        '-ml-px',
        className
      )}
      disabled={disabledOrPending}
      {...rest}>
      {pending && (
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-5',
            'h-5',
            'mr-3'
          )} />
      )}
      {children}
    </InterlayButtonBase>
  );
};

export {
  InterlayDenimButtonGroupItem
};

export default InterlayDenimButtonGroup;
