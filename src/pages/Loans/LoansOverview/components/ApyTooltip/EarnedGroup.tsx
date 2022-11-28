import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { Dd, Dl, DlGroup, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { StyledApyTooltipGroup, StyledApyTooltipTitle } from './ApyTooltip.style';
import { RewardsGroup } from './RewardsGroup';

const EarnedAsset = ({
  assetCurrency,
  earnedAsset,
  prices
}: Pick<EarnedGroupProps, 'assetCurrency' | 'earnedAsset' | 'prices'>) => {
  const earnedAssetUSD = displayMonetaryAmountInUSDFormat(earnedAsset, prices?.[earnedAsset.currency.ticker].usd);

  const earnedAssetAmount = formatNumber(earnedAsset?.toBig().toNumber(), {
    maximumFractionDigits: earnedAsset?.currency.humanDecimals
  });

  return (
    <StyledApyTooltipGroup gap='spacing1' wrap>
      <Dd color='tertiary'>{assetCurrency.ticker}:</Dd>
      <Dt color='primary'>
        {earnedAssetAmount} ({earnedAssetUSD})
      </Dt>
    </StyledApyTooltipGroup>
  );
};

type EarnedGroupProps = {
  assetCurrency: CurrencyExt;
  earnedAsset: MonetaryAmount<CurrencyExt>;
  isBorrow: boolean;
  rewards: MonetaryAmount<CurrencyExt> | null;
  prices: Prices;
};

const EarnedGroup = ({ assetCurrency, rewards, earnedAsset, isBorrow, prices }: EarnedGroupProps): JSX.Element => (
  <>
    {isBorrow && (
      <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
        <StyledApyTooltipTitle>Owed</StyledApyTooltipTitle>
        <Dt>
          <Dl direction='column' alignItems='flex-start' gap='spacing0'>
            <EarnedAsset assetCurrency={assetCurrency} earnedAsset={earnedAsset} prices={prices} />
          </Dl>
        </Dt>
      </DlGroup>
    )}
    {(!!rewards || !isBorrow) && (
      <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
        <StyledApyTooltipTitle>Earned</StyledApyTooltipTitle>
        <Dt>
          <Dl direction='column' alignItems='flex-start' gap='spacing0'>
            {!isBorrow && <EarnedAsset assetCurrency={assetCurrency} earnedAsset={earnedAsset} prices={prices} />}
            {!!rewards && <RewardsGroup rewards={rewards} prices={prices} />}
          </Dl>
        </Dt>
      </DlGroup>
    )}
  </>
);

export { EarnedGroup };
export type { EarnedGroupProps };
