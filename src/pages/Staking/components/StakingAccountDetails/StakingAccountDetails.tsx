import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardProps, Dd, Divider, Dl, DlGroup, Dt } from '@/component-library';
import { AuthCTA, ClaimModal, IsAuthenticated } from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { Transaction, useTransaction } from '@/hooks/transaction';

type Props = {
  accountData?: AccountStakingData | null;
  claimableRewards?: MonetaryAmount<CurrencyExt>;
  onClaimRewards: () => void;
};

type InheritAttrs = CardProps & Props;

type StakingAccountDetailsProps = Props & InheritAttrs;

const StakingAccountDetails = ({
  accountData,
  claimableRewards,
  onClaimRewards,
  ...props
}: StakingAccountDetailsProps): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const transaction = useTransaction(Transaction.ESCROW_WITHDRAW_REWARDS, {
    onSuccess: onClaimRewards
  });

  const handleSubmit = () => transaction.execute();

  const handleOpen = () => transaction.fee.estimate();

  const handlePress = () => setOpen(true);

  const { votingBalance, balance, projected } = accountData || {};

  const hasClaimableRewards = !claimableRewards?.isZero();

  return (
    <>
      <Card {...props} gap='spacing3'>
        <Dl direction='column' gap='spacing2'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt size='xs'>Staked {GOVERNANCE_TOKEN.ticker}</Dt>
            <Dd size='s' color='secondary'>
              {balance?.toHuman() || 0}
            </Dd>
          </DlGroup>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt size='xs'>{VOTE_GOVERNANCE_TOKEN.ticker} Balance</Dt>
            <Dd size='s' color='secondary'>
              {votingBalance?.toHuman() || 0}
            </Dd>
          </DlGroup>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt size='xs'>Projected {GOVERNANCE_TOKEN.ticker} Rewards</Dt>
            <Dd size='s' color='secondary'>
              {projected?.amount.toHuman() || 0}
            </Dd>
          </DlGroup>
          <Divider color='default' marginTop='spacing1' marginBottom='spacing1' />
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt size='xs'>Claimable Rewards</Dt>
            <Dd size='s'>
              {claimableRewards?.toHuman() || 0} {GOVERNANCE_TOKEN.ticker}
            </Dd>
          </DlGroup>
        </Dl>
        {hasClaimableRewards && (
          <IsAuthenticated>
            <AuthCTA onPress={handlePress} loading={transaction.isLoading}>
              {t('claim')}
            </AuthCTA>
          </IsAuthenticated>
        )}
      </Card>
      <ClaimModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        title={`Claim Rewards`}
        submitLabel={t('claim')}
        transaction={transaction}
        onSubmit={handleSubmit}
        onOpen={handleOpen}
      />
    </>
  );
};

export { StakingAccountDetails };
export type { StakingAccountDetailsProps };
