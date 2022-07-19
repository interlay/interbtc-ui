import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/components/UI/InterlayButtonBase';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const OpenButton = ({ onClick }: InterlayButtonBaseProps): JSX.Element => (
  <InterlayButtonBase
    className={clsx(
      'focus:outline-none',
      'focus:ring',
      { 'focus:border-interlayDenim-300': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'focus:ring-interlayDenim-200': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:focus:border-kintsugiMidnight-300': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      { 'dark:focus:ring-kintsugiMidnight-200': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'focus:ring-opacity-50',

      '-ml-0.5',
      '-mt-0.5',
      'h-12',
      'w-12',
      'justify-center',
      'rounded-md',
      { 'text-interlayTextPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'hover:text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      { 'dark:hover:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
    )}
    onClick={onClick}
  >
    <span className='sr-only'>Open sidebar</span>
    <MenuIcon className={clsx('h-6', 'w-6')} aria-hidden='true' />
  </InterlayButtonBase>
);

export default OpenButton;
