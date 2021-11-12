
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const DashboardCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    style={{
      minHeight: 384
    }}
    className={clsx(
      'flex',
      'flex-col',
      'justify-between',
      'px-4',
      'py-5',
      'xl:py-6',
      { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
      { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'border',

      // TODO: could be reused
      // MEMO: inspired by https://mui.com/components/buttons/
      'border-black',
      'border-opacity-25',
      'dark:border-white',
      'dark:border-opacity-25',

      'overflow-hidden',
      'shadow',
      'sm:rounded-lg',
      'space-y-5',
      className
    )}
    {...rest} />
);

export default DashboardCard;
