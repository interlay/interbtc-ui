
import clsx from 'clsx';

const VARIANTS = Object.freeze({
  contained: 'contained',
  outlined: 'outlined',
  text: 'text'
});

const COLORS = Object.freeze({
  default: 'default',
  inherit: 'inherit',
  primary: 'primary',
  secondary: 'secondary'
});

const COLOR_VALUES = Object.values(COLORS);
const VARIANT_VALUES = Object.values(VARIANTS);

interface Props {
  variant?: typeof VARIANT_VALUES[number];
  color?: typeof COLOR_VALUES[number];
}

const InterlayButton = ({
  variant = VARIANTS.text, // TODO: should add variant based behaviors
  color = COLORS.default,
  className,
  ...rest
}: Props & React.ComponentPropsWithRef<'button'>): JSX.Element => (
  <button
    type='button'
    className={clsx(
      'px-4',
      'py-2',
      { 'bg-primary': color === COLORS.primary },
      { 'bg-secondary': color === COLORS.secondary },
      { 'hover:bg-primary-dark': color === COLORS.primary },
      { 'hover:bg-secondary-dark': color === COLORS.secondary },
      'focus:outline-none',
      'focus:ring-2',
      { 'focus:ring-primary-light': color === COLORS.primary },
      { 'focus:ring-secondary-light': color === COLORS.secondary },
      'focus:ring-offset-2',
      { 'text-primary-contrastText': color === COLORS.primary },
      { 'text-secondary-contrastText': color === COLORS.secondary },
      'transition',
      'ease-in',
      'duration-200',
      'text-base',
      'font-medium',
      'shadow-md',
      'rounded-lg',
      'uppercase',
      className
    )}
    {...rest} />
);

export default InterlayButton;
