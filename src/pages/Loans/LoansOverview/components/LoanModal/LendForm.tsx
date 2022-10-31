import { zodResolver } from '@hookform/resolvers/zod';
import { LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber, formatUSD, monetaryToNumber } from '@/common/utils/utils';
import { CTA, H3, P, Stack, Strong, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import validate, { LoanLendValidationParams, LoanWithdrawValidationParams } from '@/lib/form-validation';
import { LendAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDItem, StyledDl } from './LoanModal.style';
import { LoanScore } from './LoanScore';

const LEND_AMOUNT = 'lend-amount';
const WITHDRAW_AMOUNT = 'withdraw-amount';

const getContentMap = (t: TFunction) => ({
  lend: {
    title: t('loans.lend'),
    fieldLabel: t('forms.field_amount', { field: t('loans.lend').toLowerCase() })
  },
  withdraw: {
    title: t('loans.withdraw'),
    fieldLabel: t('forms.field_amount', { field: t('loans.withdraw').toLowerCase() })
  }
});

type LendSchemaParams = LoanLendValidationParams & LoanWithdrawValidationParams;

const getSchema = (t: TFunction, variant: LendAction, params: LendSchemaParams) => {
  if (variant === 'lend') {
    return z.object({
      [LEND_AMOUNT]: validate.loans.lend(t, params)
    });
  }

  return z.object({
    [WITHDRAW_AMOUNT]: validate.loans.withdraw(t, params)
  });
};

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
    getNewBorrowLimitUSDValue,
    getNewCollateralRatio
  } = useGetAccountLoansOverview();
  const { data: balances } = useGetBalances();
  const prices = useGetPrices();

  const governanceBalance = balances?.[GOVERNANCE_TOKEN.ticker].free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const transactionFee = TRANSACTION_FEE_AMOUNT;
  const balance = balances?.[asset.currency.ticker].free || newMonetaryAmount(0, asset.currency);

  const lentAmount = monetaryToNumber(position?.amount);
  const balanceAmount = monetaryToNumber(balance);

  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const schemaParams: LendSchemaParams = {
    governanceBalance,
    transactionFee,
    minAmount: newMonetaryAmount(0, balance.currency).add(newMonetaryAmount(1, balance.currency)),
    // TODO: change when there is new withdraw limit calculation
    maxAmount: newMonetaryAmount(100, balance.currency, true),
    availableBalance: balance
  };

  const schema = getSchema(t, variant, schemaParams);

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty }
  } = useForm<BorrowFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const amountFieldName = variant === 'lend' ? LEND_AMOUNT : WITHDRAW_AMOUNT;
  const amount = watch(amountFieldName) || 0;
  const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);
  const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, monetaryAmount) || Big(0);
  const collateralRatio = getNewCollateralRatio(variant, asset.currency, monetaryAmount);

  const isBtnDisabled = !isValidForm(errors) || !isDirty;

  const handleSubmit = async (data: BorrowFormData) => {
    try {
      console.log(data);
      refetch();
    } catch (e) {
      console.log(e);
    }
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
              <Strong>{formatNumber(variant === 'lend' ? balanceAmount : lentAmount)}</Strong> (
              {formatUSD((variant === 'lend' ? balanceAmount : lentAmount) * assetPrice)})
            </dd>
          </StyledDItem>
          <TokenInput
            placeholder='0.00'
            valueInUSD={displayMonetaryAmountInUSDFormat(monetaryAmount, assetPrice)}
            tokenSymbol={asset.currency.ticker}
            errorMessage={getErrorMessage(errors[amountFieldName])}
            aria-label={content.fieldLabel}
            {...register(amountFieldName)}
          />
          <LoanScore score={collateralRatio} />
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
