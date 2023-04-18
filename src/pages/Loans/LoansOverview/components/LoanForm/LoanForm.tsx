import { BorrowPosition, CollateralPosition, CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDebounce } from 'react-use';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { isFormDisabled, LoanFormData, loanSchema, LoanValidationParams, useForm } from '@/lib/form';
import { LoanAction } from '@/types/loans';
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
  position?: CollateralPosition | BorrowPosition
) => {
  const isLendingAsset = isLendAsset(variant);
  const isBorrowingAsset = !isLendingAsset;
  const isCollateralAsset = isLendingAsset && (position as CollateralPosition)?.isCollateral;

  return isCollateralAsset || (isBorrowingAsset && hasCollateral);
};

const getData = (t: TFunction, variant: LoanAction) =>
  ({
    lend: {
      content: {
        title: t('loans.lend'),
        label: 'Available',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.lend').toLowerCase() })
      }
    },
    withdraw: {
      content: {
        title: t('loans.withdraw'),
        label: 'Limit',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.withdraw').toLowerCase() })
      }
    },
    borrow: {
      content: {
        title: t('loans.borrow'),
        label: 'Limit',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.borrow').toLowerCase() })
      }
    },
    repay: {
      content: {
        title: t('loans.repay'),
        label: 'Balance',
        fieldAriaLabel: t('forms.field_amount', { field: t('loans.repay').toLowerCase() })
      }
    }
  }[variant]);

type LoanFormProps = {
  asset: LoanAsset;
  variant: LoanAction;
  position?: BorrowPosition | CollateralPosition;
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

  const { content } = getData(t, variant);

  // withdraw has `withdraw` and `withdrawAll`
  // repay has `repay` and `repayAll`
  // They both are considered a multi action variant
  const hasMultiActionVariant = variant === 'withdraw' || variant === 'repay';

  const handleMaxAmount = (amount: MonetaryAmount<CurrencyExt>) => {
    // Comparing if the provided amount is equal to the amount
    // available for the action, which is only relevant for
    // when the action is `withdraw` or `repay`
    const isMaxAmount = variant === 'withdraw' ? !!position?.amount.eq(amount) : assetAmount.max.eq(amount);

    setMaxAmount(isMaxAmount);
  };

  useDebounce(
    () => {
      if (!inputAmount || !hasMultiActionVariant) return;

      const inputMonetary = newMonetaryAmount(inputAmount, asset.currency, true);

      handleMaxAmount(inputMonetary);
    },
    300,
    [inputAmount]
  );

  const handleSuccess = () => {
    toast.success(`Successful ${content.title.toLowerCase()}`);
    onChangeLoan?.();
    refetch();
  };

  const handleError = (error: Error) => {
    toast.error(error.message);
  };

  const loanMutation = useLoanMutation({ onSuccess: handleSuccess, onError: handleError });

  const schemaParams: LoanValidationParams = {
    governanceBalance,
    transactionFee,
    minAmount: assetAmount.min,
    maxAmount: assetAmount.available
  };

  const handleSubmit = (data: LoanFormData) => {
    try {
      const submittedAmount = data[variant] || 0;
      const submittedMonetaryAmount = newMonetaryAmount(submittedAmount, asset.currency, true);
      loanMutation.mutate({ amount: submittedMonetaryAmount, loanType: variant, isMaxAmount });
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const form = useForm<LoanFormData>({
    initialValues: { [variant]: '' },
    validationSchema: loanSchema(variant, schemaParams),
    onSubmit: handleSubmit
  });

  const monetaryAmount = newSafeMonetaryAmount(form.values[variant] || 0, asset.currency, true);

  const isBtnDisabled = isFormDisabled(form);

  const handleClickBalance = () => {
    if (!hasMultiActionVariant) return;

    handleMaxAmount(assetAmount.available);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!hasMultiActionVariant) return;

    setMaxAmount(false);
    setInputAmount(e.target.value);
  };

  const showBorrowLimit = shouldShowBorrowLimit(variant, hasCollateral, position);

  return (
    <form onSubmit={form.handleSubmit}>
      <StyledFormWrapper direction='column' justifyContent='space-between' gap='spacing4'>
        <Flex direction='column' gap='spacing4'>
          <TokenInput
            placeholder='0.00'
            ticker={asset.currency.ticker}
            aria-label={content.fieldAriaLabel}
            balance={assetAmount.available.toString()}
            humanBalance={assetAmount.available.toString()}
            balanceLabel={content.label}
            valueUSD={convertMonetaryAmountToValueInUSD(monetaryAmount, assetPrice) ?? 0}
            onClickBalance={handleClickBalance}
            {...mergeProps(form.getFieldProps(variant), { onChange: handleChange })}
          />
          {showBorrowLimit && (
            <BorrowLimit
              // Only shows the alert if the user interacted with the form
              shouldDisplayLiquidationAlert={!!form.values[variant]}
              loanAction={variant}
              asset={asset}
              actionAmount={monetaryAmount}
              prices={prices}
              remainingDebt={variant === 'repay' ? assetAmount.max : undefined}
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
