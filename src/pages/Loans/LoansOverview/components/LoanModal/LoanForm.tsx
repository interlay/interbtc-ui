import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowPosition, LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { CTA, TokenInput } from '@/component-library';
import validate, {
  LoanBorrowSchemaParams,
  LoanLendSchemaParams,
  LoanRepaySchemaParams,
  LoanWithdrawSchemaParams
} from '@/lib/form-validation';
import { LoanAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useLoanFormData } from '../../utils/use-loan-form-data';
import { BorrowLimit } from '../BorrowLimit';
import { LoanActionInfo } from '../LoanActionInfo';
import { StyledFormWrapper } from './LoanModal.style';

type LoanSchemaParams = LoanBorrowSchemaParams &
  LoanRepaySchemaParams &
  LoanLendSchemaParams &
  LoanWithdrawSchemaParams;

enum FormFields {
  BORROW_AMOUNT = 'borrow-amount',
  REPAY_AMOUNT = 'repay-amount',
  LEND_AMOUNT = 'lend-amount',
  WITHDRAW_AMOUNT = 'withdraw-amount'
}

const getData = (t: TFunction, variant: LoanAction, params: LoanSchemaParams) =>
  ({
    lend: {
      content: {
        title: t('loans.lend'),
        label: 'Balance',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.lend').toLowerCase() })
      },
      schema: z.object({
        [FormFields.LEND_AMOUNT]: validate.loans.lend(t, params)
      }),
      formField: FormFields.LEND_AMOUNT
    },
    withdraw: {
      content: {
        title: t('loans.withdraw'),
        label: 'Limit',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.withdraw').toLowerCase() })
      },
      schema: z.object({
        [FormFields.LEND_AMOUNT]: validate.loans.withdraw(t, params)
      }),
      formField: FormFields.WITHDRAW_AMOUNT
    },
    borrow: {
      content: {
        title: t('loans.borrow'),
        label: 'Limit',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.borrow').toLowerCase() })
      },
      schema: z.object({
        [FormFields.LEND_AMOUNT]: validate.loans.borrow(t, params)
      }),
      formField: FormFields.BORROW_AMOUNT
    },
    repay: {
      content: {
        title: t('loans.repay'),
        label: t('loans.borrowing'),
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.repay').toLowerCase() })
      },
      schema: z.object({
        [FormFields.LEND_AMOUNT]: validate.loans.repay(t, params)
      }),
      formField: FormFields.REPAY_AMOUNT
    }
  }[variant]);

type LoanFormData = {
  [FormFields.BORROW_AMOUNT]: string;
  [FormFields.REPAY_AMOUNT]: string;
  [FormFields.LEND_AMOUNT]: string;
  [FormFields.WITHDRAW_AMOUNT]: string;
};

type LoanFormProps = {
  asset: LoanAsset;
  variant: LoanAction;
  position?: BorrowPosition | LendPosition;
};

const LoanForm = ({ asset, variant, position }: LoanFormProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    refetch,
    data: { borrowPositions }
  } = useGetAccountLoansOverview();
  const { thresholds } = useGetLoansData();
  const prices = useGetPrices();
  const { governanceBalance, assetAmount, assetPrice, transactionFee } = useLoanFormData(variant, asset, position);

  const schemaParams: LoanSchemaParams = {
    governanceBalance,
    transactionFee,
    minAmount: assetAmount.min,
    maxAmount: assetAmount.max,
    availableBalance: assetAmount.available
  };

  const { schema, formField, content } = getData(t, variant, schemaParams);

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty }
  } = useForm<LoanFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const amount = watch(formField) || 0;
  const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

  const isBtnDisabled = !isValidForm(errors) || !isDirty;

  const handleSubmit = (data: LoanFormData) => {
    try {
      console.log(data);
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const hasBorrowPositions = !!borrowPositions?.length;

  return (
    <form onSubmit={h(handleSubmit)}>
      <StyledFormWrapper direction='column' gap='spacing4'>
        <TokenInput
          placeholder='0.00'
          tokenSymbol={asset.currency.ticker}
          errorMessage={getErrorMessage(errors[formField])}
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
          {...register(formField)}
        />
        {hasBorrowPositions && (
          <BorrowLimit shouldDisplayLiquidationAlert variant={variant} asset={monetaryAmount} thresholds={thresholds} />
        )}
        <LoanActionInfo variant={variant} asset={asset} prices={prices} />
        <CTA type='submit' disabled={isBtnDisabled} size='large'>
          {content.title}
        </CTA>
      </StyledFormWrapper>
    </form>
  );
};

export { LoanForm };
export type { LoanFormProps };
