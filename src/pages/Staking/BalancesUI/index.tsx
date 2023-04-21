import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { GOVERNANCE_TOKEN_SYMBOL, VOTE_GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import InformationTooltip from '@/legacy-components/tooltips/InformationTooltip';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const Label = ({ className, ...rest }: React.ComponentPropsWithRef<'span'>) => (
  <span className={clsx('text-sm', className)} {...rest} />
);

interface AmountCustomProps {
  value: string;
  tokenSymbol: string;
}

const Amount = ({ className, value, tokenSymbol, ...rest }: AmountCustomProps & React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'space-x-1',
      { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest}
  >
    <span className={clsx('text-xl', 'font-medium')}>{value}</span>
    <span className='text-sm'>{tokenSymbol}</span>
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
        { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
      )}
    >
      <Label>{label}</Label>
      {tooltip && <InformationTooltip label={tooltip} />}
    </div>
    <Amount value={value} tokenSymbol={tokenSymbol} />
  </div>
);

interface Props {
  stakedAmount: string;
  voteStakedAmount: string;
  projectedRewardAmount: string;
}

const BalancesUI = ({ stakedAmount, voteStakedAmount, projectedRewardAmount }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'rounded-xl',
        'p-4',
        { 'bg-gray-100': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:bg-kintsugiViolet': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'grid',
        'grid-cols-3',
        'gap-2'
      )}
    >
      <BalanceItem
        label={`Staked ${GOVERNANCE_TOKEN_SYMBOL}`}
        value={stakedAmount}
        tokenSymbol={GOVERNANCE_TOKEN_SYMBOL}
      />
      <BalanceItem
        label={`${VOTE_GOVERNANCE_TOKEN_SYMBOL} Balance`}
        value={voteStakedAmount}
        tokenSymbol={VOTE_GOVERNANCE_TOKEN_SYMBOL}
      />
      <BalanceItem
        label={`Projected Rewards p.a.`}
        value={projectedRewardAmount}
        tokenSymbol={GOVERNANCE_TOKEN_SYMBOL}
        tooltip={t('staking_page.the_estimated_amount_of_governance_token_you_will_receive_as_rewards', {
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL,
          voteGovernanceTokenSymbol: VOTE_GOVERNANCE_TOKEN_SYMBOL
        })}
      />
    </div>
  );
};

export default BalancesUI;
