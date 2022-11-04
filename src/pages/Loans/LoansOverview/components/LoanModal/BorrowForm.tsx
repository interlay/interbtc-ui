import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { CTA, TokenInput } from '@/component-library';
import validate, { LoanBorrowSchemaParams, LoanRepaySchemaParams } from '@/lib/form-validation';
import { BorrowAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useLoanFormData } from '../../utils/use-loan-form-data';
import { BorrowLimit } from '../BorrowLimit';
import { LoanActionInfo } from '../LoanActionInfo';
import { StyledFormWrapper } from './LoanModal.style';

const BORROW_AMOUNT = 'borrow-amount';
const REPAY_AMOUNT = 'repay-amount';

const getContentMap = (t: TFunction) => ({
  borrow: {
    title: t('loans.borrow'),
    label: 'Limit',
    fieldAriaLabel: t('forms.field_amount', { field: t('loans.borrow').toLowerCase() })
  },
  repay: {
    title: t('loans.repay'),
    label: t('loans.borrowing'),
    fieldAriaLabel: t('forms.field_amount', { field: t('loans.repay').toLowerCase() })
  }
});

type BorrowSchemaParams = LoanBorrowSchemaParams & LoanRepaySchemaParams;

const getSchema = (t: TFunction, variant: BorrowAction, params: BorrowSchemaParams) => {
  if (variant === 'borrow') {
    return z.object({
      [BORROW_AMOUNT]: validate.loans.borrow(t, params)
    });
  }

  return z.object({
    [REPAY_AMOUNT]: validate.loans.repay(t, params)
  });
};

type BorrowFormData = { [BORROW_AMOUNT]: string; [REPAY_AMOUNT]: string };

type BorrowFormProps = {
  asset: LoanAsset;
  variant: BorrowAction;
  position: BorrowPosition | undefined;
};

const BorrowForm = ({ asset, variant, position }: BorrowFormProps): JSX.Element => {
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const { refetch } = useGetAccountLoansOverview();
  const { thresholds } = useGetLoansData();
  const prices = useGetPrices();
  const { governanceBalance, assetAmount, assetPrice, transactionFee } = useLoanFormData(variant, asset, position);

  const schemaParams: BorrowSchemaParams = {
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

  const amountFieldName = variant === 'borrow' ? BORROW_AMOUNT : REPAY_AMOUNT;
  const amount = watch(amountFieldName) || 0;
  const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

  const isBtnDisabled = !isValidForm(errors) || !isDirty;

  const handleSubmit = (data: BorrowFormData) => {
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
        <BorrowLimit shouldDisplayLiquidationAlert variant={variant} asset={monetaryAmount} thresholds={thresholds} />
        <LoanActionInfo variant={variant} asset={asset} prices={prices} />
        <CTA type='submit' disabled={isBtnDisabled} size='large'>
          {content.title}
        </CTA>
      </StyledFormWrapper>
    </form>
  );
};

export { BorrowForm };
export type { BorrowFormProps };
