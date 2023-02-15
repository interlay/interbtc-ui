import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowPosition, LendPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDebounce } from 'react-use';
import * as z from 'zod';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
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
  onChangeLoan?: () => void;
};

const LoanForm = ({ asset, variant, position, onChangeLoan }: LoanFormProps): JSX.Element => {
  const [inputAmount, setInputAmount] = useState<string>();
  const [isMaxAmount, setMaxAmount] = useState(false);

  const { t } = useTranslation();
  const {
    refetch,
    data: { hasCollateral }
  } = useGetAccountPositions();
  const prices = useGetPrices();
  const { governanceBalance, assetAmount, assetPrice, transactionFee } = useLoanFormData(variant, asset, position);

  // withdraw has `withdraw` and `withdrawAll`
  // repay has `repay` and `repayAll`
  // They both are considered a multi action variant
  const hasMultiActionVariant = variant === 'withdraw' || variant === 'repay';

  useDebounce(
    () => {
      if (!inputAmount || !hasMultiActionVariant) return;

      // Checks if the user is trying to type the max value
      const isEqualAmount = assetAmount.max.eq(newMonetaryAmount(inputAmount, asset.currency, true));
      setMaxAmount(isEqualAmount);
    },
    300,
    [inputAmount]
  );

  const handleSuccess = () => {
    onChangeLoan?.();
    refetch();
  };

  const handleError = (error: Error) => {
    toast.error(error.message);
  };

  const loanMutation = useLoanMutation({ onSuccess: handleSuccess, onError: handleError });

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

  const handleClickBalance = () => {
    if (!hasMultiActionVariant) return;

    setMaxAmount(true);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!hasMultiActionVariant) return;

    setMaxAmount(false);
    setInputAmount(e.target.value);
  };

  const showBorrowLimit = shouldShowBorrowLimit(variant, hasCollateral, position);

  return (
    <form onSubmit={h(handleSubmit)}>
      <StyledFormWrapper direction='column' justifyContent='space-between' gap='spacing4'>
        <Flex direction='column' gap='spacing4'>
          <TokenInput
            placeholder='0.00'
            ticker={asset.currency.ticker}
            errorMessage={getErrorMessage(errors[formField])}
            aria-label={content.fieldAriaLabel}
            balance={assetAmount.max.toString()}
            humanBalance={assetAmount.max.toHuman()}
            balanceLabel={content.label}
            valueUSD={convertMonetaryAmountToValueInUSD(monetaryAmount, assetPrice) ?? 0}
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
          <AuthCTA type='submit' disabled={isBtnDisabled} size='large' loading={loanMutation.isLoading}>
            {content.title}
          </AuthCTA>
        </Flex>
      </StyledFormWrapper>
    </form>
  );
};

LoanForm.displayName = 'LoanForm';

export { LoanForm };
export type { LoanFormProps };
