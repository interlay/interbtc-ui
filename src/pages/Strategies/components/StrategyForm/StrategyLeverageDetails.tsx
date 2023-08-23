import { displayMonetaryAmountInUSDFormat, formatPercentage, formatUSD } from '@/common/utils/utils';
import { TransactionDetails, TransactionDetailsDd, TransactionDetailsDt, TransactionDetailsGroup } from '@/components';
import { useGetPrices } from '@/hooks/api/use-get-prices';

import { StrategyData } from '../../hooks/use-get-strategies';
import { UseGetStrategyLeverageDataResult } from '../../hooks/use-get-strategy-leverage-data';

type StrategyLeverageDetailsProps = {
  strategy: StrategyData;
  leverageData: UseGetStrategyLeverageDataResult;
};

const StrategyLeverageDetails = ({ strategy, leverageData }: StrategyLeverageDetailsProps): JSX.Element => {
  const prices = useGetPrices();

  const availableLiquidityUSD = displayMonetaryAmountInUSDFormat(
    leverageData.liquidity,
    prices?.[strategy.currencies.primary.ticker].usd
  );

  const collateralInputUSD = displayMonetaryAmountInUSDFormat(
    leverageData.collateralInput,
    prices?.[strategy.currencies.primary.ticker].usd
  );
  const collateralInputLabel = `${leverageData.collateralInput.toHuman()} (${collateralInputUSD})`;

  const entryPriceUSD = formatUSD(leverageData.price.entry.toNumber());
  const liquidationPriceUSD = formatUSD(leverageData.price.liquidation.toNumber());

  return (
    <TransactionDetails>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Available liquidity</TransactionDetailsDt>
        <TransactionDetailsDd>{availableLiquidityUSD}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Collateral Input</TransactionDetailsDt>
        <TransactionDetailsDd>{collateralInputLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Leverage</TransactionDetailsDt>
        <TransactionDetailsDd>{leverageData.leverage.toNumber()}x</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>LTV</TransactionDetailsDt>
        <TransactionDetailsDd>{formatPercentage(leverageData.ltv.toNumber())}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>APY</TransactionDetailsDt>
        <TransactionDetailsDd>{formatPercentage(leverageData.apy.toNumber())}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Entry Price</TransactionDetailsDt>
        <TransactionDetailsDd>{entryPriceUSD}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Liquidation Price</TransactionDetailsDt>
        <TransactionDetailsDd>{liquidationPriceUSD}</TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StrategyLeverageDetails };
export type { StrategyLeverageDetailsProps };
