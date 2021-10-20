
import { Tab } from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';

import { POLKADOT } from 'utils/constants/relay-chain-names';

const InterlayTabGroup = Tab.Group;
const InterlayTabPanels = Tab.Panels;

type InterlayTabListProps = Props<typeof Tab.List>;
const InterlayTabList = ({
  className,
  ...rest
}: InterlayTabListProps): JSX.Element => (
  <Tab.List
    className={clsx(
      'flex',
      'p-1',
      'space-x-1',
      { 'bg-interlayDenim-900':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
      'bg-opacity-20',
      'rounded-xl',
      className
    )}
    {...rest} />
);

type InterlayTabProps = Props<typeof Tab>;
const InterlayTab = ({
  className,
  ...rest
}: InterlayTabProps): JSX.Element => (
  <Tab
    className={({ selected }) =>
      clsx(
        'w-full',
        'py-2.5',
        'text-sm',
        'leading-5',
        'font-medium',
        { 'text-interlayDenim-700':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        'rounded-lg',

        'focus:outline-none',
        'focus:ring-2',
        'ring-offset-2',
        { 'ring-offset-interlayDenim-400':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        'ring-white',
        'ring-opacity-60',
        selected ?
          clsx(
            'bg-white',
            'shadow'
          ) :
          clsx(
            { 'text-interlayDenim-100':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
            'hover:bg-white',
            'hover:bg-opacity-10',
            'hover:text-white'
          ),
        className
      )
    }
    {...rest} />
);

type InterlayTabPanelProps = Props<typeof Tab.Panel>;
const InterlayTabPanel = ({
  className,
  ...rest
}: InterlayTabPanelProps): JSX.Element => (
  <Tab.Panel
    className={clsx(
      className
    )}
    {...rest} />
);

export {
  InterlayTabList,
  InterlayTabPanels,
  InterlayTab,
  InterlayTabPanel
};

export default InterlayTabGroup;
