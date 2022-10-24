import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { formatNumber, formatUSD, monetaryToNumber } from '@/common/utils/utils';
import { CTA, H3, P, Stack, Strong, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import validate, { LoanBorrowValidationParams, LoanRepayValidationParams } from '@/lib/form-validation';
import { BorrowAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDItem, StyledDl } from './LoanModal.style';

const BORROW_AMOUNT = 'borrow-amount';
const REPAY_AMOUNT = 'repay-amount';

const getContentMap = (t: TFunction) => ({
  borrow: {
    title: t('loans.borrow')
  },
  repay: {
    title: t('loans.repay')
  }
});

type BorrowSchemaParams = LoanBorrowValidationParams & LoanRepayValidationParams;

const getSchema = (t: TFunction, variant: BorrowAction, params: BorrowSchemaParams) => {
  const { governanceBalance, borrowedAssetBalance, transactionFee, minAmount, maxAmount } = params;

  if (variant === 'borrow') {
    return z.object({
      [BORROW_AMOUNT]: validate.loans.borrow(t, { governanceBalance, transactionFee, minAmount, maxAmount })
    });
  }

  return z.object({
    [REPAY_AMOUNT]: validate.loans.repay(t, { borrowedAssetBalance, governanceBalance, transactionFee, minAmount })
  });
};

type BorrowFormData = { [BORROW_AMOUNT]: string; [REPAY_AMOUNT]: string };

type BorrowFormProps = {
  asset: LoanAsset;
  variant: BorrowAction;
  position: BorrowPosition | undefined;
};

const BorrowForm = ({ asset, variant, position }: BorrowFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const {
    data: { borrowLimitUSDValue },
    refetch,
    getMaxBorrowableAmount,
    getNewBorrowLimitUSDValue
  } = useGetAccountLoansOverview();
  const { data: balances } = useGetBalances();

  const governanceBalance = balances?.[GOVERNANCE_TOKEN.ticker].free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const transactionFee = TRANSACTION_FEE_AMOUNT;
  const balance = balances?.[asset.currency.ticker].free || newMonetaryAmount(0, asset.currency);

  const maxBorrowableAmount = getMaxBorrowableAmount(asset.currency, asset.availableCapacity);
  const maximumBorrowable = monetaryToNumber(maxBorrowableAmount);
  const borrowedAmount = monetaryToNumber(position?.amount);

  const prices = useGetPrices();
  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const schemaParams: BorrowSchemaParams = {
    borrowedAssetBalance: balance,
    governanceBalance,
    transactionFee,
    minAmount: newMonetaryAmount(0, balance.currency).add(newMonetaryAmount(1, balance.currency)),
    maxAmount: maxBorrowableAmount
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

  const amountFieldName = variant === 'borrow' ? BORROW_AMOUNT : REPAY_AMOUNT;
  const amount = watch(amountFieldName) || 0;
  const monetaryAmount = newMonetaryAmount(amount, asset.currency);
  const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, monetaryAmount) || Big(0);

  const isBtnDisabled = !isValidForm(errors) || !isDirty;

  const handleSubmit = (data: BorrowFormData) => {
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
              {variant === 'borrow' ? 'Available' : 'Borrowed'} {asset.currency.ticker}:
            </dt>
            <dd>
              <Strong>{formatNumber(variant === 'borrow' ? maximumBorrowable : borrowedAmount)}</Strong> (
              {formatUSD((variant === 'borrow' ? maximumBorrowable : borrowedAmount) * assetPrice)})
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
              <dd>{formatNumber(asset.borrowApy.toNumber())}%</dd>
            </StyledDItem>
            {variant === 'borrow' && asset.borrowReward && (
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
          <CTA type='submit' disabled={isBtnDisabled} size='large'>
            {content.title}
          </CTA>
        </Stack>
      </Stack>
    </form>
  );
};

export { BorrowForm };
export type { BorrowFormProps };
