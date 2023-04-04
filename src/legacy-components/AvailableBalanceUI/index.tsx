import clsx from 'clsx';

import InterlayButtonBase from '@/legacy-components/UI/InterlayButtonBase';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

interface Props extends React.HTMLAttributes<unknown> {
  label: string;
  balance: string;
  tokenSymbol: string;
}

const AvailableBalanceUI = ({ balance, label, tokenSymbol, onClick, className, ...rest }: Props): JSX.Element => {
  const Balance = onClick ? InterlayButtonBase : 'span';

  return (
    <div className={clsx('space-x-1', className)} {...rest}>
      <span
        className={clsx(
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}
      >
        {label}:
      </span>
      <Balance
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={clsx(
          { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}
      >
        {balance} {tokenSymbol}
      </Balance>
    </div>
  );
};

export default AvailableBalanceUI;
