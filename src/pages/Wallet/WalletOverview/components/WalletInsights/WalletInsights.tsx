import { BorrowPosition, CollateralPosition } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/utils/use-media-query';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { getTokenPrice } from '@/utils/helpers/prices';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { WalletMeta } from './WalletMeta';

type WalletInsightsProps = {
  balances?: BalanceData;
  borrowPositions?: BorrowPosition[];
  lendPositions?: CollateralPosition[];
  accountLiquidityPools?: AccountLiquidityPool[];
};

const WalletInsights = ({
  balances,
  borrowPositions,
  lendPositions,
  accountLiquidityPools
}: WalletInsightsProps): JSX.Element => {
  const { t } = useTranslation();

  const prices = useGetPrices();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const rawBalance =
    balances &&
    Object.values(balances).reduce(
      (total, balance) =>
        total.add(
          convertMonetaryAmountToValueInUSD(
            balance.free.add(balance.reserved),
            getTokenPrice(prices, balance.currency.ticker)?.usd
          ) || 0
        ),
      new Big(0)
    );

  const totalLendPositions =
    lendPositions &&
    Object.values(lendPositions).reduce(
      (total, balance) =>
        total.add(
          convertMonetaryAmountToValueInUSD(
            balance.amount,
            getTokenPrice(prices, balance.amount.currency.ticker)?.usd
          ) || 0
        ),
      new Big(0)
    );

  const totalBorrowPositions =
    borrowPositions &&
    Object.values(borrowPositions).reduce(
      (total, balance) =>
        total.add(
          convertMonetaryAmountToValueInUSD(
            balance.amount,
            getTokenPrice(prices, balance.amount.currency.ticker)?.usd
          ) || 0
        ),
      new Big(0)
    );

  const totalAccountLiquidityPools =
    accountLiquidityPools &&
    Object.values(
      accountLiquidityPools.map(({ data, amount: accountLPTokenAmount }) => {
        const { pooledCurrencies, totalSupply } = data;
        const totalLiquidityUSD = calculateTotalLiquidityUSD(pooledCurrencies, prices);

        return accountLPTokenAmount
          ? calculateAccountLiquidityUSD(accountLPTokenAmount, totalLiquidityUSD, totalSupply)
          : 0;
      })
    )
      .reduce((total, accountLPTokenAmount) => total.add(accountLPTokenAmount), new Big(0))
      .toString();

  const totalBalance = rawBalance
    ?.add(totalLendPositions || 0)
    .sub(totalBorrowPositions || 0)
    .add(totalAccountLiquidityPools || 0);

  const totalBalanceLabel = totalBalance ? formatUSD(totalBalance.toNumber(), { compact: true }) : '-';

  const transferableBalance =
    balances &&
    Object.values(balances).reduce(
      (total, balance) =>
        total.add(
          convertMonetaryAmountToValueInUSD(
            balance.transferable,
            getTokenPrice(prices, balance.currency.ticker)?.usd
          ) || 0
        ),
      new Big(0)
    );

  const transferableBalanceLabel = transferableBalance
    ? formatUSD(transferableBalance.toNumber(), { compact: true })
    : '-';

  return (
    <Dl wrap direction={isMobile ? 'column' : 'row'}>
      <Card flex='1'>
        <WalletMeta />
      </Card>
      <Card flex='1' justifyContent='center'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt weight='semibold' color='primary'>
            {t('total_balance')}
          </Dt>
          <Dd weight='bold' color='secondary'>
            {totalBalanceLabel}
          </Dd>
        </DlGroup>
      </Card>
      <Card flex='1' justifyContent='center'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt weight='semibold' color='primary'>
            {t('transferable_balance')}
          </Dt>
          <Dd weight='bold' color='secondary'>
            {transferableBalanceLabel}
          </Dd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { WalletInsights };
export type { WalletInsightsProps };
