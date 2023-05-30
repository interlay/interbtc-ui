import { GovernanceCurrency } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Dd, DlGroup, Dt } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDl } from './EarnStrategyForm.style';

interface EarnStrategyFormFeesProps {
  amount: MonetaryAmount<GovernanceCurrency>;
}

const EarnStrategyFormFees = ({ amount }: EarnStrategyFormFeesProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  return (
    <StyledDl direction='column' gap='spacing2'>
      <DlGroup justifyContent='space-between'>
        <Dt size='xs' color='primary'>
          {t('fees')}
        </Dt>
        <Dd size='xs'>
          {amount.toHuman()} {amount.currency.ticker} (
          {displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)})
        </Dd>
      </DlGroup>
    </StyledDl>
  );
};

export { EarnStrategyFormFees };
