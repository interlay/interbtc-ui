import { zodResolver } from '@hookform/resolvers/zod';
import { LendPosition, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { formatNumber, formatUSD, monetaryToNumber } from '@/common/utils/utils';
import { CTA, H3, P, Stack, Strong, TokenInput } from '@/component-library';
import { LendAction } from '@/types/loans';
import { getErrorMessage } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import validate from '@/utils/validation';

import { StyledDItem, StyledDl } from './LoanModal.style';

const LEND_AMOUNT = 'lend-amount';
const WITHDRAW_AMOUNT = 'withdraw-amount';

const getContentMap = (t: TFunction) => ({
  lend: {
    title: t('loans.lend')
  },
  withdraw: {
    title: t('loans.withdraw')
  }
});

type BorrowFormData = { [LEND_AMOUNT]: string; [WITHDRAW_AMOUNT]: string };

type LendFormProps = {
  asset: LoanAsset;
  variant: LendAction;
  position: LendPosition | undefined;
};

const LendForm = ({ asset, variant, position }: LendFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const {
    data: { borrowLimitUSDValue },
    refetch,
    getNewBorrowLimitUSDValue
  } = useGetAccountLoansOverview();

  const { data: balances } = useGetBalances();
  const assetFreeBalance = monetaryToNumber(balances?.[asset.currency.ticker].free);

  const lentAmount = monetaryToNumber(position?.amount);

  const prices = useGetPrices();
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const schema = z.object({
    [LEND_AMOUNT]: validate.loans.lend(t, {}),
    [WITHDRAW_AMOUNT]: validate.loans.withdraw(t, {})
  });

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm<BorrowFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const amountFieldName = variant === 'lend' ? LEND_AMOUNT : WITHDRAW_AMOUNT;
  const amount = watch(amountFieldName) || 0;
  const monetaryAmount = new MonetaryAmount(asset.currency, amount);
  const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, monetaryAmount) || Big(0);

  const isBtnDisabled = !isValid && !isDirty;

  const handleSubmit = async (data: BorrowFormData) => {
    console.log(data);
    // TODO: add additional onSubmit validation once RHF is added
    refetch();
  };

  return (
    <form onSubmit={h(handleSubmit)}>
      <Stack spacing='double'>
        <div>
          <H3 id={titleId}>
            {content.title} {asset.currency.name}
          </H3>
          <P>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</P>
        </div>
        <Stack>
          <StyledDItem>
            <dt>
              {variant === 'lend' ? 'Available' : 'Lent'} {asset.currency.ticker}:
            </dt>
            <dd>
              <Strong>{formatNumber(variant === 'lend' ? assetFreeBalance : lentAmount)}</Strong> (
              {formatUSD((variant === 'lend' ? assetFreeBalance : lentAmount) * assetPrice)})
            </dd>
          </StyledDItem>
          <TokenInput
            valueInUSD='$0.00' // TODO: add price computation once RHF is added
            tokenSymbol={asset.currency.ticker}
            errorMessage={getErrorMessage(errors[amountFieldName])}
            {...register(amountFieldName)}
          />
          <StyledDl>
            <StyledDItem>
              <dt>APY</dt>
              <dd>{formatNumber(asset.lendApy.toNumber())}%</dd>
            </StyledDItem>
            {variant === 'lend' && asset.lendReward && (
              <StyledDItem>
                <dt>Borrow Limit</dt>
                <dd>
                  {formatUSD(borrowLimitUSDValue?.toNumber() || 0)} -&gt; {formatUSD(newBorrowLimit.toNumber())}
                </dd>
              </StyledDItem>
            )}
            <StyledDItem>
              <dt>Borrow Limit</dt>
              <dd>
                {formatUSD(borrowLimitUSDValue?.toNumber() || 0)} -&gt; {formatUSD(newBorrowLimit.toNumber())}
              </dd>
            </StyledDItem>
          </StyledDl>
          <CTA type='submit' size='large' disabled={isBtnDisabled}>
            {content.title}
          </CTA>
        </Stack>
      </Stack>
    </form>
  );
};

export { LendForm };
export type { LendFormProps };
