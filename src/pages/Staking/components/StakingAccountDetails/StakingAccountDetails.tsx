import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { Card, CardProps, Dd, Divider, Dl, DlGroup, Dt } from '@/component-library';
import { AuthCTA } from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { Transaction, useTransaction } from '@/hooks/transaction';

type Props = {
  stakedAmount: MonetaryAmount<CurrencyExt>;
  votingBalance: MonetaryAmount<CurrencyExt>;
  projectedRewardsAmount: MonetaryAmount<CurrencyExt>;
  claimableRewardsAmount: MonetaryAmount<CurrencyExt>;
  onClaimRewards: () => void;
};

type InheritAttrs = CardProps & Props;

type StakingAccountDetailsProps = Props & InheritAttrs;

const StakingAccountDetails = ({
  claimableRewardsAmount,
  projectedRewardsAmount,
  stakedAmount,
  votingBalance,
  onClaimRewards,
  ...props
}: StakingAccountDetailsProps): JSX.Element | null => {
  const { t } = useTranslation();
  const transaction = useTransaction(Transaction.ESCROW_WITHDRAW_REWARDS, {
    onSuccess: onClaimRewards
  });

  const handlePress = () => transaction.execute();

  return (
    <Card {...props} gap='spacing3'>
      <Dl direction='column' gap='spacing2'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt size='xs'>Staked {GOVERNANCE_TOKEN.ticker}</Dt>
          <Dd size='s' color='secondary'>
            {stakedAmount.toHuman()}
          </Dd>
        </DlGroup>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt size='xs'>{VOTE_GOVERNANCE_TOKEN.ticker} Balance</Dt>
          <Dd size='s' color='secondary'>
            {votingBalance.toHuman()}
          </Dd>
        </DlGroup>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt size='xs'>Prokected {GOVERNANCE_TOKEN.ticker} Rewards</Dt>
          <Dd size='s' color='secondary'>
            {projectedRewardsAmount.toHuman()}
          </Dd>
        </DlGroup>
        <Divider color='default' marginTop='spacing1' marginBottom='spacing1' />
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt size='xs'>Claimable Rewards</Dt>
          <Dd size='s'>
            {claimableRewardsAmount.toHuman()} {claimableRewardsAmount.currency.ticker}
          </Dd>
        </DlGroup>
      </Dl>
      <AuthCTA onPress={handlePress} loading={transaction.isLoading}>
        {t('claim')}
      </AuthCTA>
    </Card>
  );
};

export { StakingAccountDetails };
export type { StakingAccountDetailsProps };
