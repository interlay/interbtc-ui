import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatNumber, formatUSD } from '@/common/utils/utils';
import { CoinIcon, Dd, Dl, DlGroup, Dt, Flex, P } from '@/component-library';
import { Prices } from '@/hooks/api/use-get-prices';
import { getTokenPrice } from '@/utils/helpers/prices';

type ReceivableAssetsProps = {
  assetAmounts: MonetaryAmount<CurrencyExt>[];
  prices?: Prices;
};

const ReceivableAssets = ({ assetAmounts: pooledAmounts, prices }: ReceivableAssetsProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='spacing4'>
      <P align='center' size='xs'>
        {t('receivable_assets')}
      </P>
      <Dl direction='column' gap='spacing2'>
        {pooledAmounts.map((amount) => {
          const assetAmount = formatNumber(amount.toBig().toNumber(), {
            maximumFractionDigits: amount.currency.humanDecimals
          });

          const assetAmountUSD = formatUSD(
            convertMonetaryAmountToValueInUSD(amount, getTokenPrice(prices, amount.currency.ticker)?.usd) || 0,
            { compact: true }
          );

          return (
            <DlGroup key={amount.currency.ticker} justifyContent='space-between'>
              <Dt size='xs' color='primary'>
                <Flex alignItems='center' gap='spacing1'>
                  <CoinIcon ticker={amount.currency.ticker} />
                  {amount.currency.ticker}
                </Flex>
              </Dt>
              <Dd size='xs'>
                {assetAmount} ({assetAmountUSD})
              </Dd>
            </DlGroup>
          );
        })}
      </Dl>
    </Flex>
  );
};

ReceivableAssets.displayName = 'ReceivableAssets';

export { ReceivableAssets };
export type { ReceivableAssetsProps };
