
import * as React from 'react';
import clsx from 'clsx';

const COLORS = Object.freeze({
  primary: 'primary',
  secondary: 'secondary'
});

const COLOR_VALUES = Object.values(COLORS);

interface CustomProps {
  color?: typeof COLOR_VALUES[number];
}

type Ref = HTMLInputElement;

const InterlayInput = React.forwardRef<Ref, Props>(({
  color = COLORS.primary,
  className,
  ...rest
}: Props, ref): JSX.Element => (
  <input
    ref={ref}
    type='text'
    className={clsx(
      'focus:ring',
      { 'focus:border-primary-300': color === COLORS.primary },
      { 'focus:ring-primary-200': color === COLORS.primary },
      { 'focus:border-secondary-300': color === COLORS.secondary },
      { 'focus:ring-secondary-200': color === COLORS.secondary },
      'focus:ring-opacity-50',
      'text-textPrimary',
      'bg-paper',
      'block',
      'w-full',
      'text-base',
      'border-gray-300',
      'shadow-sm',
      'rounded-md',
      'placeholder-gray-400',
      className
    )}
    {...rest} />
));
InterlayInput.displayName = 'InterlayInput';

export type Props = CustomProps & React.ComponentPropsWithRef<'input'>;

export default InterlayInput;
