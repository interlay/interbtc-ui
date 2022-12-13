import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowPosition, LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { CTA, Flex, TokenInput } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';
import validate, {
  LoanBorrowSchemaParams,
  LoanLendSchemaParams,
  LoanRepaySchemaParams,
  LoanWithdrawSchemaParams
} from '@/lib/form-validation';
import { LoanAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useLoanMutation } from '@/utils/hooks/api/loans/use-loan-mutation';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useLoanFormData } from '../../hooks/use-loan-form-data';
import { isLendAsset } from '../../utils/is-loan-asset';
import { BorrowLimit } from '../BorrowLimit';
import { LoanActionInfo } from '../LoanActionInfo';
import { StyledFormWrapper } from './LoanForm.style';

// The borrow limit component is only displayed when
// loan form is openned while lending an asset that is
// being used as collateral or while borrowing an asset
// when there are assets added as collateral
const shouldShowBorrowLimit = (
  variant: LoanAction,
  hasCollateral: boolean,
  position?: LendPosition | BorrowPosition
) => {
  const isLendingAsset = isLendAsset(variant);
  const isBorrowingAsset = !isLendingAsset;
  const isCollateralAsset = isLendingAsset && (position as LendPosition)?.isCollateral;

  return isCollateralAsset || (isBorrowingAsset && hasCollateral);
};

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
        [FormFields.WITHDRAW_AMOUNT]: validate.loans.withdraw(t, params)
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
        [FormFields.BORROW_AMOUNT]: validate.loans.borrow(t, params)
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
        [FormFields.REPAY_AMOUNT]: validate.loans.repay(t, params)
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
  onChangeLoan: () => void;
};

const LoanForm = ({ asset, variant, position, onChangeLoan }: LoanFormProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    refetch,
    data: { hasCollateral }
  } = useGetAccountPositions();
  const prices = useGetPrices();
  const { governanceBalance, assetAmount, assetPrice, transactionFee } = useLoanFormData(variant, asset, position);
  const [isMaxAmount, setMaxAmount] = useState(false);

  const handleSuccess = () => {
    onChangeLoan();
    refetch();
  };

  const loanMutation = useLoanMutation({ onSuccess: handleSuccess });

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
    formState: { errors, isDirty, isValid }
  } = useForm<LoanFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const amount = watch(formField) || 0;
  const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

  const handleSubmit = (data: LoanFormData) => {
    try {
      const submittedAmount = data[formField];
      const submittedMonetaryAmount = newMonetaryAmount(submittedAmount, asset.currency, true);
      loanMutation.mutate({ amount: submittedMonetaryAmount, loanType: variant, isMaxAmount });
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const handleClickBalance = () => setMaxAmount(true);

  const handleChange = () => setMaxAmount(false);

  const showBorrowLimit = shouldShowBorrowLimit(variant, hasCollateral, position);

  return (
    <>
      <form onSubmit={h(handleSubmit)}>
        <StyledFormWrapper
          $showBorrowLimit={showBorrowLimit}
          direction='column'
          justifyContent='space-between'
          gap='spacing4'
        >
          <Flex direction='column' gap='spacing4'>
            <TokenInput
              placeholder='0.00'
              tokenSymbol={asset.currency.ticker}
              errorMessage={getErrorMessage(errors[formField])}
              label={content.label}
              aria-label={content.fieldAriaLabel}
              balance={assetAmount.max.toBig().toNumber()}
              balanceInUSD={displayMonetaryAmountInUSDFormat(assetAmount.max, assetPrice)}
              valueInUSD={displayMonetaryAmountInUSDFormat(monetaryAmount, assetPrice)}
              renderBalance={(value) =>
                formatNumber(value, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: asset.currency.humanDecimals || 5
                })
              }
              onClickBalance={handleClickBalance}
              {...register(formField, { onChange: handleChange })}
            />
            {showBorrowLimit && (
              <BorrowLimit
                shouldDisplayLiquidationAlert
                loanAction={variant}
                asset={asset}
                actionAmount={monetaryAmount}
                prices={prices}
              />
            )}
          </Flex>
          <Flex direction='column' gap='spacing4'>
            <LoanActionInfo variant={variant} asset={asset} prices={prices} />
            <CTA type='submit' disabled={isBtnDisabled} size='large' loading={loanMutation.isLoading}>
              {content.title}
            </CTA>
          </Flex>
        </StyledFormWrapper>
      </form>
      {loanMutation.isError && (
        <ErrorModal
          open={loanMutation.isError}
          onClose={() => loanMutation.reset()}
          title='Error'
          description={loanMutation.error?.message || ''}
        />
      )}
    </>
  );
};

LoanForm.displayName = 'LoanForm';

export { LoanForm };
export type { LoanFormProps };
