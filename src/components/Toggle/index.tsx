import { Switch } from '@headlessui/react';
import { Props as HeadlessUIProps } from '@headlessui/react/dist/types';
import clsx from 'clsx';

import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

const Toggle = ({ checked, className, onChange, ...rest }: Props): JSX.Element => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={clsx(
        checked
          ? clsx(
              { 'bg-interlayDenim-600': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:bg-kintsugiMidnight-600': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )
          : 'bg-gray-200',
        'relative',
        'inline-flex',
        'flex-shrink-0',
        'h-6',
        'w-11',
        'border-2',
        'border-transparent',
        'rounded-full',
        'cursor-pointer',
        'transition-colors',
        'ease-in-out',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        { 'focus:ring-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:focus:ring-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        className
      )}
      {...rest}
    >
      <span className='sr-only'>Use setting</span>
      <span
        aria-hidden='true'
        className={clsx(
          checked ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none',
          'inline-block',
          'h-5',
          'w-5',
          'rounded-full',
          'bg-white',
          'shadow',
          'transform',
          'ring-0',
          'transition',
          'ease-in-out',
          'duration-200'
        )}
      />
    </Switch>
  );
};

export type Props = HeadlessUIProps<typeof Switch>;

export default Toggle;
