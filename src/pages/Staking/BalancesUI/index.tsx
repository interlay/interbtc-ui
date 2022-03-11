
import clsx from 'clsx';

import InformationTooltip from 'components/tooltips/InformationTooltip';
import {
  GOVERNANCE_TOKEN_SYMBOL,
  VOTE_GOVERNANCE_TOKEN_SYMBOL
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ESTIMATED_GOVERNANCE_TOKEN_REWARDS_TOOLTIP } from 'utils/constants/staking';

const Label = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'span'>) => (
  <span
    className={clsx(
      'text-sm',
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
  tooltip?: string;
}

const BalanceItem = ({
  label,
  value,
  tokenSymbol,
  tooltip,
  ...rest
}: BalanceItemCustomProps & React.ComponentPropsWithRef<'div'>) => (
  <div {...rest}>
    <div
      className={clsx(
        'inline-flex',
        'items-center',
        'space-x-1',
        // TODO: placeholder color
        { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        // TODO: placeholder color
        { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
      )}>
      <Label>
        {label}
      </Label>
      {tooltip && (
        <InformationTooltip label={tooltip} />
      )}
    </div>
    <Amount
      value={value}
      tokenSymbol={tokenSymbol} />
  </div>
);

interface Props {
  stakedAmount: string;
  voteStakedAmount: string;
  projectedRewardAmount: string;
}

const BalancesUI = ({
  stakedAmount,
  voteStakedAmount,
  projectedRewardAmount
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
        'gap-2'
      )}>
      <BalanceItem
        label={`Staked ${GOVERNANCE_TOKEN_SYMBOL}`}
        value={stakedAmount}
        tokenSymbol={GOVERNANCE_TOKEN_SYMBOL} />
      <BalanceItem
        label={`${VOTE_GOVERNANCE_TOKEN_SYMBOL} Balance`}
        value={voteStakedAmount}
        tokenSymbol={VOTE_GOVERNANCE_TOKEN_SYMBOL} />
      <BalanceItem
        label={`Projected ${GOVERNANCE_TOKEN_SYMBOL} Rewards`}
        value={projectedRewardAmount}
        tokenSymbol={GOVERNANCE_TOKEN_SYMBOL}
        tooltip={ESTIMATED_GOVERNANCE_TOKEN_REWARDS_TOOLTIP} />
    </div>
  );
};

export default BalancesUI;
