import clsx from 'clsx';

const COLORS = Object.freeze({
  primary: 'primary',
  secondary: 'secondary'
});

const COLOR_VALUES = Object.values(COLORS);

interface Props {
  color?: typeof COLOR_VALUES[number];
}

// MEMO: inspired by https://www.tailwind-kit.com/components/inputtext
const InterlayInput = ({
  color = COLORS.primary,
  className,
  ...rest
}: Props & React.ComponentPropsWithRef<'input'>): JSX.Element => (
  <input
    type='text'
    className={clsx(
      'flex-1',
      'appearance-none',
      'border-transparent',
      'border',
      'border-gray-300',
      'w-full',
      'px-4',
      'py-2',
      'text-base',
      'text-textPrimary',
      'placeholder-gray-400',
      'bg-paper',
      'rounded-lg',
      'shadow-sm',
      'focus:outline-none',
      'focus:ring-2',
      { 'focus:ring-primary': color === COLORS.primary },
      { 'focus:ring-secondary': color === COLORS.secondary },
      'focus:border-transparent',
      className
    )}
    {...rest} />
);

export default InterlayInput;
