
import clsx from 'clsx';

import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

const VARIANTS = Object.freeze({
  contained: 'contained',
  outlined: 'outlined',
  text: 'text'
});

const COLORS = Object.freeze({
  default: 'default',
  inherit: 'inherit', // TODO: not used
  primary: 'primary',
  secondary: 'secondary'
});

const COLOR_VALUES = Object.values(COLORS);
const VARIANT_VALUES = Object.values(VARIANTS);

interface CustomProps {
  variant?: typeof VARIANT_VALUES[number];
  color?: typeof COLOR_VALUES[number];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  pending?: boolean;
}

const InterlayButton = ({
  variant = VARIANTS.text,
  color = COLORS.default,
  className,
  children,
  startIcon,
  endIcon,
  disabled = false,
  pending = false,
  ...rest
}: Props): JSX.Element => (
  <button
    type='button'
    style={{
      minHeight: 36
    }}
    className={clsx(
      { 'bg-gray-300 hover:bg-gray-400 text-textPrimary': // palette.text.primary
        variant === VARIANTS.contained && color === COLORS.default && !disabled },
      { 'bg-primary hover:bg-primary-600 text-primary-contrastText':
        variant === VARIANTS.contained && color === COLORS.primary && !disabled },
      { 'bg-secondary hover:bg-secondary-600 text-secondary-contrastText':
        variant === VARIANTS.contained && color === COLORS.secondary && !disabled },
      { 'bg-black bg-opacity-10 text-black text-opacity-25': // palette.action.disabled
        variant === VARIANTS.contained && disabled },
      { 'shadow-sm': variant === VARIANTS.contained && !disabled },

      { 'bg-transparent': variant === VARIANTS.text },
      { 'text-textPrimary hover:bg-black hover:bg-opacity-5':
        variant === VARIANTS.text && color === COLORS.default && !disabled },
      { 'text-primary hover:bg-primary hover:bg-opacity-5':
        variant === VARIANTS.text && color === COLORS.primary && !disabled },
      { 'text-secondary hover:bg-secondary hover:bg-opacity-5':
        variant === VARIANTS.text && color === COLORS.secondary && !disabled },

      { 'border border-solid':
        variant === VARIANTS.outlined },
      { 'text-textPrimary border-black border-opacity-25 hover:bg-black hover:bg-opacity-5':
        variant === VARIANTS.outlined && color === COLORS.default && !disabled },
      { 'text-primary border-primary border-opacity-50 hover:border-opacity-100 hover:bg-primary hover:bg-opacity-5':
        variant === VARIANTS.outlined && color === COLORS.primary && !disabled },
      // eslint-disable-next-line max-len
      { 'text-secondary border-secondary border-opacity-50 hover:border-opacity-100 hover:bg-secondary hover:bg-opacity-5':
        variant === VARIANTS.outlined && color === COLORS.secondary && !disabled },
      { 'border-opacity-25': variant === VARIANTS.outlined && disabled },

      { 'text-black text-opacity-25 pointer-events-none':
        disabled },

      { 'cursor-wait pointer-events-none':
        pending },
      'select-none',
      'px-4',
      'py-2',
      'focus:outline-none',
      'focus:ring',
      'focus:border-primary-300',
      'focus:ring-primary-200',
      'focus:ring-opacity-50',
      'transition',
      'ease-in',
      'duration-200',
      'text-sm',
      'rounded',
      'capitalize',
      'space-x-1',
      'flex',
      'items-center',
      'justify-center',
      className
    )}
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
    {startIcon}
    <span className='font-medium'>
      {children}
    </span>
    {endIcon}
  </button>
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;

export {
  COLOR_VALUES,
  VARIANT_VALUES
};

export default InterlayButton;
