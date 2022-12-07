import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { Dd, Dt } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { StyledApyTooltipGroup } from './ApyTooltip.style';

type AssetGroupProps = {
  amount: MonetaryAmount<CurrencyExt>;
  prices: Prices;
};

const AssetGroup = ({ amount, prices }: AssetGroupProps): JSX.Element => {
  const amountUSD = displayMonetaryAmountInUSDFormat(amount, prices?.[amount.currency.ticker].usd);

  const amountLabel = formatNumber(amount?.toBig().toNumber(), {
    maximumFractionDigits: amount?.currency.humanDecimals
  });

  return (
    <StyledApyTooltipGroup gap='spacing1' wrap>
      <Dt color='tertiary'>{amount.currency.ticker}:</Dt>
      <Dd color='primary'>
        {amountLabel} ({amountUSD})
      </Dd>
    </StyledApyTooltipGroup>
  );
};

export { AssetGroup };
export type { AssetGroupProps };
