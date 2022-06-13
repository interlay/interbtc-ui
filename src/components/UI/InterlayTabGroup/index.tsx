import { Tab } from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const InterlayTabGroup = Tab.Group;
const InterlayTabPanels = Tab.Panels;

type InterlayTabListProps = Props<typeof Tab.List>;
const InterlayTabList = ({ className, ...rest }: InterlayTabListProps): JSX.Element => (
  <Tab.List
    className={clsx(
      'flex',
      'p-1',
      'space-x-1',
      { 'bg-interlayDenim-900': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      'bg-opacity-20',
      { 'dark:bg-kintsugiMidnight-100': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      { 'dark:bg-opacity-20': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'rounded-xl',
      className
    )}
    {...rest}
  />
);

type InterlayTabProps = Props<typeof Tab>;
const InterlayTab = ({ className, ...rest }: InterlayTabProps): JSX.Element => (
  <Tab
    className={({ selected }) =>
      clsx(
        'w-full',
        'py-2.5',
        'text-sm',
        'leading-5',
        'font-medium',
        { 'text-interlayDenim-700': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiMidnight-700': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'rounded-lg',

        'focus:outline-none',
        'focus:ring-2',
        'ring-offset-2',
        { 'ring-offset-interlayDenim-400': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:ring-offset-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'ring-white',
        'ring-opacity-60',
        selected
          ? clsx('bg-white', 'shadow')
          : clsx(
              { 'text-interlayDenim-100': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
              'hover:bg-white',
              'hover:bg-opacity-10',
              'hover:text-white'
            ),
        className
      )
    }
    {...rest}
  />
);

type InterlayTabPanelProps = Props<typeof Tab.Panel>;
const InterlayTabPanel = ({ className, ...rest }: InterlayTabPanelProps): JSX.Element => (
  <Tab.Panel
    className={clsx(
      'rounded-xl',
      'p-1.5',
      'focus:outline-none',
      'focus:ring-2',
      'ring-offset-2',
      { 'ring-offset-interlayDenim-400': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:ring-offset-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'ring-white',
      'ring-opacity-60',
      className
    )}
    {...rest}
  />
);

export { InterlayTab, InterlayTabList, InterlayTabPanel,InterlayTabPanels };

export default InterlayTabGroup;
