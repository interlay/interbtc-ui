
import clsx from 'clsx';
import { RadioGroup } from '@headlessui/react';
import { PropsOf } from '@headlessui/react/dist/types';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';

// TODO: not used for now
const InterlayDenimToggleButtonGroup = ({
  className,
  ...rest
}: PropsOf<typeof RadioGroup>): JSX.Element => (
  <RadioGroup
    className={clsx(
      'z-0',
      'inline-flex',
      'shadow-sm',
      'rounded-md',
      className
    )}
    {...rest} />
);

interface CustomInterlayDenimButtonGroupItemProps {
  value: number;
}

const InterlayDenimToggleButtonGroupItem = ({
  className,
  children,
  disabled = false,
  value,
  ...rest
}: CustomInterlayDenimButtonGroupItemProps & InterlayButtonBaseProps): JSX.Element => {
  return (
    <RadioGroup.Option
      as={InterlayButtonBase}
      value={value}
      type='button'
      className={({
        active,
        checked
      }) =>
        clsx(
          {
            [clsx(
              'focus:outline-none',
              'focus:ring-2',
              'focus:border-interlayDenim-300',
              'focus:ring-interlayDenim-200',
              'focus:ring-opacity-50'
            )]: active
          },

          'border',
          'border-interlayDenim-300',
          'font-medium',
          'shadow-sm',
          {
            [clsx(
              'text-white',
              'bg-interlayDenim-600',
              'hover:bg-interlayDenim-700'
            )]: checked
          },

          'first:rounded-l',
          'last:rounded-r',
          'px-4',
          'py-2',
          'text-sm',
          '-ml-px',
          className
        )
      }
      disabled={disabled}
      {...rest}>
      {children}
    </RadioGroup.Option>
  );
};

export {
  InterlayDenimToggleButtonGroupItem
};

export type InterlayDenimToggleButtonGroupProps = PropsOf<typeof RadioGroup>;
export type InterlayDenimToggleButtonGroupItemProps = CustomInterlayDenimButtonGroupItemProps & InterlayButtonBaseProps;

export default InterlayDenimToggleButtonGroup;
