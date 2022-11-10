import { zodResolver } from '@hookform/resolvers/zod';
import { LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber, formatUSD } from '@/common/utils/utils';
import { CTA, TokenInput } from '@/component-library';
import validate, { LoanLendSchemaParams, LoanWithdrawSchemaParams } from '@/lib/form-validation';
import { LendAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { useLoanFormData } from '../../utils/use-loan-form-data';
import { StyledDItem, StyledDl, StyledFormWrapper } from './LoanModal.style';
import { LoanScore } from './LoanScore';

const LEND_AMOUNT = 'lend-amount';
const WITHDRAW_AMOUNT = 'withdraw-amount';

const getContentMap = (t: TFunction) => ({
  lend: {
    title: t('loans.lend'),
    label: 'Available',
    fieldAriaLabel: t('forms.field_amount', { field: t('loans.lend').toLowerCase() })
  },
  withdraw: {
    title: t('loans.withdraw'),
    label: 'Lent',
    fieldAriaLabel: t('forms.field_amount', { field: t('loans.withdraw').toLowerCase() })
  }
});

type LendSchemaParams = LoanLendSchemaParams & LoanWithdrawSchemaParams;

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
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const {
    data: { borrowLimitUSDValue },
    refetch,
    getNewBorrowLimitUSDValue,
    getNewCollateralRatio
  } = useGetAccountLoansOverview();

  const { governanceBalance, assetAmount, assetPrice, transactionFee } = useLoanFormData(variant, asset, position);

  const schemaParams: LendSchemaParams = {
    governanceBalance,
    transactionFee,
    minAmount: assetAmount.min,
    maxAmount: assetAmount.max,
    availableBalance: assetAmount.available
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
      <StyledFormWrapper direction='column' gap='spacing4'>
        <TokenInput
          placeholder='0.00'
          tokenSymbol={asset.currency.ticker}
          errorMessage={getErrorMessage(errors[amountFieldName])}
          label={content.label}
          aria-label={content.fieldAriaLabel}
          balance={assetAmount.max.toBig().toNumber()}
          balanceInUSD={displayMonetaryAmountInUSDFormat(assetAmount.max, assetPrice)}
          valueInUSD={displayMonetaryAmountInUSDFormat(monetaryAmount, assetPrice)}
          // TODO: we need a more generic way to know how many digits to show
          renderBalance={(value) =>
            formatNumber(value, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 5
            })
          }
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
        </StyledDl>
        <CTA type='submit' size='large' disabled={isBtnDisabled}>
          {content.title}
        </CTA>
      </StyledFormWrapper>
    </form>
  );
};

export { LendForm };
export type { LendFormProps };
