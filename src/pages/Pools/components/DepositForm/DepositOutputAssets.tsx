import { LiquidityPool } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  convertMonetaryAmountToValueInUSD,
  formatNumber,
  formatUSD,
  newSafeMonetaryAmount
} from '@/common/utils/utils';
import { Dd, Dl, Dt, Flex, P } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { StyledDlGroup } from './DepositForm.styles';

type DepositOutputAssetsProps = {
  pool: LiquidityPool;
  values: Record<string, string | undefined>;
  prices?: Prices;
};

const DepositOutputAssets = ({ pool, values, prices }: DepositOutputAssetsProps): JSX.Element => {
  const { t } = useTranslation();
  const { pooledCurrencies } = pool;

  const poolName = (
    <PoolName justifyContent='center' tickers={pooledCurrencies.map((currency) => currency.currency.ticker)} />
  );

  const lpTokenMonetaryAmount = pool.getLiquidityDepositLpTokenAmount(
    newSafeMonetaryAmount(values[pooledCurrencies[0].currency.ticker] || 0, pooledCurrencies[0].currency, true)
  );

  const lpTokenAmountUSD = useMemo(
    () =>
      pooledCurrencies
        .reduce((acc, curr) => {
          const assetMonetary = newSafeMonetaryAmount(values[curr.currency.ticker] || 0, curr.currency, true);
          const amountUSD =
            convertMonetaryAmountToValueInUSD(assetMonetary, getTokenPrice(prices, curr.currency.ticker)?.usd) || 0;

          return acc.add(amountUSD);
        }, new Big(0))
        .toNumber(),
    [pooledCurrencies, prices, values]
  );

  const lpTokenAmount = formatNumber(lpTokenMonetaryAmount.toBig().toNumber(), {
    maximumFractionDigits: lpTokenMonetaryAmount.currency.humanDecimals || lpTokenMonetaryAmount.currency.decimals,
    compact: true
  });

  return (
    <Flex direction='column' gap='spacing4'>
      <P align='center' size='xs'>
        {t('receivable_assets')}
      </P>
      <Dl direction='column' gap='spacing2'>
        <StyledDlGroup justifyContent='space-between'>
          <Dt size='xs' color='primary'>
            {poolName}
          </Dt>
          <Dd size='xs'>
            {lpTokenAmount} ({formatUSD(lpTokenAmountUSD, { compact: true })})
          </Dd>
        </StyledDlGroup>
      </Dl>
    </Flex>
  );
};

DepositOutputAssets.displayName = 'DepositOutputAssets';

export { DepositOutputAssets };
export type { DepositOutputAssetsProps };
