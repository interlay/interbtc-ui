
import clsx from 'clsx';

import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

interface Props {
  balance: string;
}

const GovernanceTokenTransferableBalanceUI = ({
  balance
}: Props): JSX.Element => {
  return (
    <div className='space-x-1'>
      <span
        className={clsx(
          // TODO: placeholder color
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          // TODO: placeholder color
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        Balance:
      </span>
      <span
        className={clsx(
          // TODO: placeholder color
          { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          // TODO: placeholder color
          { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {balance} {GOVERNANCE_TOKEN_SYMBOL}
      </span>
    </div>
  );
};

export default GovernanceTokenTransferableBalanceUI;
