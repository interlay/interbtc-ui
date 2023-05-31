import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Card, Dl, DlGroup } from '@/component-library';
import { AuthCTA } from '@/components';
import { AccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetAccountSubsidyRewards } from '@/utils/hooks/api/loans/use-get-account-subsidy-rewards';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { StyledDd, StyledDt } from './LoansInsights.style';

type LoansInsightsProps = {
  statistics?: AccountLendingStatistics;
};

const LoansInsights = ({ statistics }: LoansInsightsProps): JSX.Element => {
  const { data: subsidyRewards, refetch } = useGetAccountSubsidyRewards();

  const transaction = useTransaction(Transaction.LOANS_CLAIM_REWARDS, {
    onSuccess: refetch
  });

  const handleClickClaimRewards = () => transaction.execute();

  const { supplyAmountUSD, netAPY } = statistics || {};

  const supplyBalanceLabel = formatUSD(supplyAmountUSD?.toNumber() || 0);
  // TODO: temporary until squid has earned interest calculation.
  // const netBalanceLabel = formatUSD(netAmountUSD?.toNumber() || 0);
  const netPercentage = formatPercentage(netAPY?.toNumber() || 0);
  const netPercentageLabel = `${netAPY?.gt(0) ? '+' : ''}${netPercentage}`;

  const subsidyRewardsAmount = formatNumber(subsidyRewards?.total.toBig().toNumber() || 0, {
    maximumFractionDigits: subsidyRewards?.total.currency.humanDecimals || 5
  });
  const subsidyRewardsAmountLabel = `${subsidyRewardsAmount} ${subsidyRewards?.total.currency.ticker || ''}`;
  const hasSubsidyRewards = !!subsidyRewards && !subsidyRewards?.total.isZero();

  return (
    <>
      <Dl wrap direction='row'>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Supply Balance</StyledDt>
            <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Net APY</StyledDt>
            {/* {netPercentageLabel} ({netBalanceLabel}) */}
            <StyledDd color='secondary'>{netPercentageLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card
          direction='row'
          flex={hasSubsidyRewards ? '1.5' : '1'}
          gap='spacing2'
          alignItems='center'
          justifyContent='space-between'
        >
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Rewards</StyledDt>
            <StyledDd color='secondary'>{subsidyRewardsAmountLabel}</StyledDd>
          </DlGroup>
          {hasSubsidyRewards && (
            <AuthCTA onPress={handleClickClaimRewards} loading={transaction.isLoading}>
              Claim
            </AuthCTA>
          )}
        </Card>
      </Dl>
    </>
  );
};

export { LoansInsights };
export type { LoansInsightsProps };
