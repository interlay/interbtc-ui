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

import { KUSAMA, POLKADOT } from 'utils/constants/relay-chain-names';

type SelectLabelProps = Props<typeof Listbox.Label>;

const SelectLabel = ({
  className,
  ...rest
}: SelectLabelProps): JSX.Element => (
  <Listbox.Label
    className={clsx(
      'block',
      'text-sm',
      'font-medium',
      'text-textSecondary',
      'mb-1',
      className
    )}
    {...rest} />
);

type SelectButtonProps = Props<typeof Listbox.Button>;

const SelectButton = ({
  className,
  children,
  ...rest
}: SelectButtonProps): JSX.Element => (
  <Listbox.Button
    className={clsx(
      'focus:outline-none',
      'focus:ring',
      'focus:ring-opacity-50',

      'relative',
      'w-full',
      'border',

      // TODO: could be reused
      // MEMO: inspired by https://mui.com/components/buttons/
      'border-black',
      'border-opacity-25',
      'dark:border-white',
      'dark:border-opacity-25',

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

interface CustomSelectOptionsProps {
  open: boolean;
}

type SelectOptionsProps = CustomSelectOptionsProps & Props<typeof Listbox.Options>;

const SelectOptions = ({
  open,
  className,
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
            'dark:bg-kintsugiMidnight-900'
          )]: process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA
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

interface CustomSelectTextProps {
  selected?: boolean;
}

const SelectText = ({
  selected = false,
  className,
  ...rest
}: CustomSelectTextProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
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

export {
  SelectLabel,
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
};

export default Select;
