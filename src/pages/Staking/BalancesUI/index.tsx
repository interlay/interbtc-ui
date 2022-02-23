
import clsx from 'clsx';

import {
  GOVERNANCE_TOKEN_SYMBOL,
  VOTE_GOVERNANCE_TOKEN_SYMBOL
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const Label = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>) => (
  <span
    className={clsx(
      'block',
      'text-sm',
      // TODO: placeholder color
      { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      // TODO: placeholder color
      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest} />
);

interface AmountCustomProps {
  value: string;
  tokenSymbol: string;
}

const Amount = ({
  className,
  value,
  tokenSymbol,
  ...rest
}: AmountCustomProps & React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'space-x-1',
      // TODO: placeholder color
      { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      // TODO: placeholder color
      { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest}>
    <span
      className={clsx(
        'text-xl',
        'font-medium'
      )}>
      {value}
    </span>
    <span className='text-sm'>
      {tokenSymbol}
    </span>
  </div>
);

interface BalanceItemCustomProps {
  label: string;
  value: string;
  tokenSymbol: string;
}

const BalanceItem = ({
  label,
  value,
  tokenSymbol,
  ...rest
}: BalanceItemCustomProps & React.ComponentPropsWithRef<'div'>) => (
  <div {...rest}>
    <Label>
      {label}
    </Label>
    <Amount
      value={value}
      tokenSymbol={tokenSymbol} />
  </div>
);

interface Props {
  freeBalance: string;
  voteStakedAmount: string;
  rewardAmount: string;
}

const BalancesUI = ({
  freeBalance,
  voteStakedAmount,
  rewardAmount
}: Props): JSX.Element => {
  return (
    <div
      className={clsx(
        'rounded-xl',
        'p-4',
        // TODO: placeholder color
        { 'bg-interlayPaleSky':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        // TODO: placeholder color
        { 'dark:bg-kintsugiViolet': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'grid',
        'grid-cols-3',
        'gap-7'
      )}>
      <BalanceItem
        label='My Free Balance'
        value={freeBalance}
        tokenSymbol={GOVERNANCE_TOKEN_SYMBOL} />
      <BalanceItem
        label={`My Staked ${GOVERNANCE_TOKEN_SYMBOL}`}
        value={voteStakedAmount}
        tokenSymbol={VOTE_GOVERNANCE_TOKEN_SYMBOL} />
      <BalanceItem
        label='My Rewards'
        value={rewardAmount}
        tokenSymbol={GOVERNANCE_TOKEN_SYMBOL} />
    </div>
  );
};

export default BalancesUI;
