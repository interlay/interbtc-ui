import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Card, Dd, Dl, DlGroup, Dt } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { BalanceData } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type WalletInsightsProps = {
  balances?: BalanceData;
};

const WalletInsights = ({ balances }: WalletInsightsProps): JSX.Element => {
  const prices = useGetPrices();

  if (!balances) {
    return (
      <Dl wrap direction='row'>
        {/* <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>{t('supply_balance')}</StyledDt>
            <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
          </DlGroup>
        </Card> */}
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt weight='semibold' color='primary'>
              Total Balance
            </Dt>
            <Dd weight='bold' color='secondary'>
              --
            </Dd>
          </DlGroup>
        </Card>
        <Card direction='row' flex='1' gap='spacing2' alignItems='center' justifyContent='space-between'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <Dt weight='semibold' color='primary'>
              Transferable balance
            </Dt>
            <Dd weight='bold' color='secondary'>
              --
            </Dd>
          </DlGroup>
        </Card>
      </Dl>
    );
  }

  const totalBalance = Object.values(balances).reduce(
    (total, balance) =>
      total.add(
        convertMonetaryAmountToValueInUSD(balance.free, getTokenPrice(prices, balance.currency.ticker)?.usd) || 0
      ),
    new Big(0)
  );
  const totalBalanceLabel = formatUSD(totalBalance.toNumber(), { compact: true });

  const transfarableBalance = Object.values(balances).reduce(
    (total, balance) =>
      total.add(
        convertMonetaryAmountToValueInUSD(balance.transferable, getTokenPrice(prices, balance.currency.ticker)?.usd) ||
          0
      ),
    new Big(0)
  );
  const transfarableBalanceLabel = formatUSD(transfarableBalance.toNumber(), { compact: true });

  return (
    <Dl wrap direction='row'>
      {/* <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <StyledDt color='primary'>{t('supply_balance')}</StyledDt>
          <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
        </DlGroup>
      </Card> */}
      <Card flex='1'>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
          <Dt weight='semibold' color='primary'>
            Total Balance
          </Dt>
          <Dd weight='bold' color='secondary'>
            {totalBalanceLabel}
          </Dd>
        </DlGroup>
      </Card>
      <Card direction='row' flex='1' gap='spacing2' alignItems='center' justifyContent='space-between'>
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
