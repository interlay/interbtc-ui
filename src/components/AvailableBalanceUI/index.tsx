
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

interface Props {
  label: string;
  balance: string;
  tokenSymbol: string;
}

const AvailableBalanceUI = ({
  balance,
  label,
  tokenSymbol
}: Props): JSX.Element => {
  return (
    <div className='space-x-1'>
      <span
        className={clsx(
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {label}:
      </span>
      <span
        className={clsx(
          { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {balance} {tokenSymbol}
      </span>
    </div>
  );
};

export default AvailableBalanceUI;
