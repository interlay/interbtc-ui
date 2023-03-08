import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { WalletMeta } from './WalletMeta';

type WalletInsightsProps = {
  balances?: BalanceData;
};

const WalletInsights = ({ balances }: WalletInsightsProps): JSX.Element => {
  const prices = useGetPrices();

  const totalBalance =
    balances &&
    Object.values(balances).reduce(
      (total, balance) =>
        total.add(
          convertMonetaryAmountToValueInUSD(balance.free, getTokenPrice(prices, balance.currency.ticker)?.usd) || 0
        ),
      new Big(0)
    );

  const totalBalanceLabel = totalBalance ? formatUSD(totalBalance.toNumber(), { compact: true }) : '-';

  const transfarableBalance =
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

  const transfarableBalanceLabel = transfarableBalance
    ? formatUSD(transfarableBalance.toNumber(), { compact: true })
    : '-';

  return (
    <Dl wrap direction='row'>
      <Card flex='1'>
        <WalletMeta />
      </Card>
      <Card flex='1' justifyContent='center'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt weight='semibold' color='primary'>
            Total Balance
          </Dt>
          <Dd weight='bold' color='secondary'>
            {totalBalanceLabel}
          </Dd>
        </DlGroup>
      </Card>
      <Card flex='1' justifyContent='center'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt weight='semibold' color='primary'>
            Transferable balance
          </Dt>
          <Dd weight='bold' color='secondary'>
            {transfarableBalanceLabel}
          </Dd>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { WalletInsights };
export type { WalletInsightsProps };
