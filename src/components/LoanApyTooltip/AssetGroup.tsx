import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Dd, Dt } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { StyledApyTooltipGroup } from './LoanApyTooltip.style';

type AssetGroupProps = {
  amount: MonetaryAmount<CurrencyExt>;
  prices: Prices;
};

const AssetGroup = ({ amount, prices }: AssetGroupProps): JSX.Element => {
  const amountUSD = displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd);

  return (
    <StyledApyTooltipGroup gap='spacing1' wrap>
      <Dt color='tertiary'>{amount.currency.ticker}:</Dt>
      <Dd color='primary'>
        {amount.toHuman()} ({amountUSD})
      </Dd>
    </StyledApyTooltipGroup>
  );
};

export { AssetGroup };
export type { AssetGroupProps };
