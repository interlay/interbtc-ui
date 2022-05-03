import * as React from 'react';
import {
  Listbox,
  Transition
} from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';
import {
  CheckIcon,
  SelectorIcon
} from '@heroicons/react/solid';

import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
// ray test touch <<
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';
// ray test touch >>

const SELECT_VARIANTS = Object.freeze({
  optionSelector: 'optionSelector',
  formField: 'formField'
});

const SELECT_VARIANT_VALUES = Object.values(SELECT_VARIANTS);

type SelectLabelProps = Props<typeof Listbox.Label>;

const SelectLabel = ({
  className,
  ...rest
}: SelectLabelProps): JSX.Element => (
  <Listbox.Label
    className={clsx(
      { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest} />
);

interface SelectButtonCustomProps {
  variant?: SelectVariants;
}

type SelectButtonProps = SelectButtonCustomProps & Props<typeof Listbox.Button>;

const SelectButton = ({
  className,
  children,
  variant = 'optionSelector',
  ...rest
}: SelectButtonProps): JSX.Element => (
  <Listbox.Button
    className={clsx(
      'focus:outline-none',
      'focus:ring',
      'focus:ring-opacity-50',

      'relative',
      'w-full',
      // ray test touch <<
      'border',
      LIGHT_DARK_BORDER_CLASSES,
      // ray test touch >>

      'rounded-md',
      'pl-3',
      'pr-10',
      'py-2',
      'text-left',
      'cursor-default',
      'leading-7',
      {
        [clsx(
          'bg-white',
          'focus:border-interlayDenim-300',
          'focus:ring-interlayDenim-200'
        )]: process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT
      },
      {
        [clsx(
          'dark:bg-kintsugiMidnight-900',
          'dark:focus:border-kintsugiSupernova-300',
          'dark:focus:ring-kintsugiSupernova-200'
        )]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA
      },
      {
        [clsx(
          'dark:bg-kintsugiMidnight'
        )]: variant === SELECT_VARIANTS.formField
      },
      className
    )}
    {...rest}>
    {children}
    <span
      className={clsx(
        'ml-3',
        'absolute',
        'inset-y-0',
        'right-0',
        'flex',
        'items-center',
        'pr-2',
        'pointer-events-none'
      )}>
      <SelectorIcon
        className={clsx(
          'h-5',
          'w-5',
          'text-textSecondary'
        )}
        aria-hidden='true' />
    </span>
  </Listbox.Button>
);

interface SelectOptionsCustomProps {
  open: boolean;
  variant?: typeof SELECT_VARIANT_VALUES[number];
}

type SelectOptionsProps = SelectOptionsCustomProps & Props<typeof Listbox.Options>;

const SelectOptions = ({
  open,
  className,
  variant = SELECT_VARIANTS.optionSelector,
  ...rest
}: SelectOptionsProps): JSX.Element => (
  <Transition
    show={open}
    as={React.Fragment}
    leave={clsx(
      'transition',
      'ease-in',
      'duration-100'
    )}
    leaveFrom='opacity-100'
    leaveTo='opacity-0'>
    <Listbox.Options
      static
      className={clsx(
        'absolute',
        'z-interlaySpeedDial',
        'mt-1',
        'w-full',
        'bg-white',
        'max-h-56',
        'rounded',
        'py-1',
        'text-base',
        'ring-1',

        'ring-black',
        'ring-opacity-25',
        'dark:ring-white',
        'dark:ring-opacity-25',

        'overflow-auto',
        'focus:outline-none',
        'sm:text-sm',
        {
          [clsx(
            'bg-white'
          )]: process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT
        },
        {
          [clsx(
            'dark:bg-kintsugiMidnight'
          )]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA
        },
        {
          [clsx(
            'dark:bg-kintsugiMidnight-900'
          )]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA && variant === SELECT_VARIANTS.formField
        },
        className
      )}
      {...rest} />
  </Transition>
);

type SelectOptionProps = Props<typeof Listbox.Option>;

const SelectOption = ({
  value,
  className,
  ...rest
}: SelectOptionProps): JSX.Element => (
  <Listbox.Option
    className={({ active }) =>
      clsx(
        active ?
          clsx(
            'text-white',
            'bg-interlayDenim'
          ) :
          'text-textPrimary',
        'cursor-default',
        'select-none',
        'relative',
        'py-2',
        'pl-3',
        'pr-9',
        className
      )
    }
    value={value}
    {...rest} />
);

const SelectBody = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'relative',
      className
    )}
    {...rest} />
);

interface CustomSelectCheckProps {
  active: boolean;
}

const SelectCheck = ({
  active,
  className,
  ...rest
}: CustomSelectCheckProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      active ?
        'text-white' :
        'text-interlayDenim',
      'absolute',
      'inset-y-0',
      'right-0',
      'flex',
      'items-center',
      'pr-4',
      className
    )}
    {...rest}>
    <CheckIcon
      className={clsx(
        'h-5',
        'w-5'
      )}
      aria-hidden='true' />
  </span>
);

interface SelectTextCustomProps {
  selected?: boolean;
}

const SelectText = ({
  selected = false,
  className,
  ...rest
}: SelectTextCustomProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      selected ?
        'font-semibold' :
        'font-normal',
      'block',
      'truncate',
      className
    )}
    {...rest} />
);

const Select = ({
  value,
  onChange,
  children
}: SelectProps): JSX.Element => {
  return (
    <Listbox
      value={value}
      onChange={onChange}>
      {children}
    </Listbox>
  );
};

export type SelectProps = Props<typeof Listbox>;
export type SelectVariants = typeof SELECT_VARIANT_VALUES[number];

export {
  SELECT_VARIANTS,
  SELECT_VARIANT_VALUES,
  SelectLabel,
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
};

export default Select;
