import { LoanAsset } from '@interlay/interbtc-api';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatPercentage } from '@/common/utils/utils';
import { Dd, DlGroup, Dt } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { LoanAction } from '@/types/loans';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { getSubsidyRewardApy } from '../../utils/get-subsidy-rewards-apy';
import { StyledDl } from './LoanActionInfo.style';

type LoanActionInfoProps = {
  variant?: LoanAction;
  asset?: LoanAsset;
  prices?: Prices;
};

const LoanActionInfo = ({ variant, asset, prices }: LoanActionInfoProps): JSX.Element => {
  const lendRewardsApy = getSubsidyRewardApy(asset?.currency, asset?.lendReward || null, prices);
  const borrowRewardsApy = getSubsidyRewardApy(asset?.currency, asset?.borrowReward || null, prices);

  return (
    <StyledDl direction='column' gap='spacing2'>
      {asset && (
        <>
          {variant === 'lend' && (
            <>
              <DlGroup justifyContent='space-between'>
                <Dt>Lend APY {asset.currency.ticker}</Dt>
                <Dd>{formatPercentage(asset.lendApy.toNumber(), { maximumFractionDigits: 2 })}</Dd>
              </DlGroup>
              {!!asset.lendReward && !!lendRewardsApy && (
                <DlGroup justifyContent='space-between'>
                  <Dt>Rewards APY {asset.lendReward.currency.ticker}</Dt>
                  <Dd>{formatPercentage(lendRewardsApy, { maximumFractionDigits: 2 })}</Dd>
                </DlGroup>
              )}
            </>
          )}
          {variant === 'borrow' && (
            <>
              <DlGroup justifyContent='space-between'>
                <Dt>Borrow APY {asset.currency.ticker}</Dt>
                <Dd>{formatPercentage(asset.borrowApy.toNumber(), { maximumFractionDigits: 2 })}</Dd>
              </DlGroup>
              {!!asset.borrowReward && !!borrowRewardsApy && (
                <DlGroup justifyContent='space-between'>
                  <Dt>Rewards APY {asset.borrowReward.currency.ticker}</Dt>
                  <Dd>{formatPercentage(borrowRewardsApy, { maximumFractionDigits: 2 })}</Dd>
                </DlGroup>
              )}
            </>
          )}
        </>
      )}
      <DlGroup justifyContent='space-between'>
        <Dt>Fees</Dt>
        <Dd>
          {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
          {displayMonetaryAmountInUSDFormat(
            TRANSACTION_FEE_AMOUNT,
            getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
          )}
          )
        </Dd>
      </DlGroup>
    </StyledDl>
  );
};
export { LoanActionInfo };
export type { LoanActionInfoProps };
