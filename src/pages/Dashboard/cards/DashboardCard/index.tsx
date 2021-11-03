
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
    // TODO: hardcoded
    style={{
      minHeight: 384
    }}
    className={clsx(
      'px-5',
      'py-4',
      'xl:py-7',
      'shadow',
      // MEMO: bootstrap card style
      'relative',
      'flex',
      'flex-col',
      'min-w-0',
      'break-words',
      { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
      { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'bg-clip-border',
      'rounded-lg',
      'border',
      'border-solid',
      'border-gray-200',
      className
    )}
    {...rest} />
);

export default DashboardCard;
