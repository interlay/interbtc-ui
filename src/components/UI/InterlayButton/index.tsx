
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

const VARIANTS = Object.freeze({
  contained: 'contained',
  outlined: 'outlined',
  text: 'text'
});

const COLORS = Object.freeze({
  default: 'default',
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
  pending?: boolean;
}

// ray test touch <
// TODO: not used for now
// MEMO: inspired by https://material-ui.com/components/buttons/
// ray test touch >
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
}: Props): JSX.Element => {
  const disabledOrPending = disabled || pending;

  return (
    <InterlayButtonBase
      type='button'
      style={{
        minHeight: 36
      }}
      className={clsx(
        'focus:outline-none',
        'focus:ring',
        'focus:border-primary-300',
        'focus:ring-primary-200',
        'focus:ring-opacity-50',
        {
          [clsx(
            'bg-gray-300',
            'hover:bg-gray-400',
            'text-interlayTextPrimaryInLightMode'
          )]: variant === VARIANTS.contained && color === COLORS.default && !disabledOrPending
        },
        {
          [clsx(
            'bg-primary',
            'hover:bg-primary-600',
            'text-white'
          )]: variant === VARIANTS.contained && color === COLORS.primary && !disabledOrPending
        },
        {
          [clsx(
            'bg-secondary',
            'hover:bg-secondary-600',
            'text-interlayTextPrimaryInLightMode'
          )]: variant === VARIANTS.contained && color === COLORS.secondary && !disabledOrPending
        },
        {
          [clsx(
            'bg-black',
            'bg-opacity-10'
          )]: variant === VARIANTS.contained && disabledOrPending
        },
        {
          [clsx(
            'text-black',
            'text-opacity-25'
          )]: disabledOrPending
        },
        { 'shadow-sm': variant === VARIANTS.contained && !disabledOrPending },

        { 'bg-transparent': variant === VARIANTS.text },
        {
          [clsx(
            'text-interlayTextPrimaryInLightMode',
            'hover:bg-black',
            'hover:bg-opacity-5'
          )]: variant === VARIANTS.text && color === COLORS.default && !disabledOrPending
        },
        {
          [clsx(
            'text-primary',
            'hover:bg-primary',
            'hover:bg-opacity-5'
          )]: variant === VARIANTS.text && color === COLORS.primary && !disabledOrPending
        },
        {
          [clsx(
            'text-secondary',
            'hover:bg-secondary',
            'hover:bg-opacity-5'
          )]: variant === VARIANTS.text && color === COLORS.secondary && !disabledOrPending
        },

        {
          [clsx(
            'border',
            'border-solid'
          )]: variant === VARIANTS.outlined
        },
        {
          [clsx(
            'text-interlayTextPrimaryInLightMode',
            'border-black',
            'border-opacity-25',
            'hover:bg-black',
            'hover:bg-opacity-5'
          )]: variant === VARIANTS.outlined && color === COLORS.default && !disabledOrPending },
        {
          [clsx(
            'text-primary',
            'border-primary',
            'border-opacity-50',
            'hover:border-opacity-100',
            'hover:bg-primary',
            'hover:bg-opacity-5'
          )]: variant === VARIANTS.outlined && color === COLORS.primary && !disabledOrPending },
        {
          [clsx(
            'text-secondary',
            'border-secondary',
            'border-opacity-50',
            'hover:border-opacity-100',
            'hover:bg-secondary',
            'hover:bg-opacity-5'
          )]: variant === VARIANTS.outlined && color === COLORS.secondary && !disabledOrPending },
        { 'border-opacity-25': variant === VARIANTS.outlined && disabledOrPending },

        'rounded',
        'px-4',
        'py-2',
        'text-sm',
        'space-x-1',
        'justify-center',
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
      {startIcon}
      <span className='font-medium'>
        {children}
      </span>
      {endIcon}
    </InterlayButtonBase>
  );
};

export type Props = CustomProps & InterlayButtonBaseProps;

export {
  COLOR_VALUES,
  VARIANT_VALUES
};

export default InterlayButton;
