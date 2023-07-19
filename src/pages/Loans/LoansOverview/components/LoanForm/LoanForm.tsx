import { BorrowPosition, CollateralPosition, CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, RefObject, useCallback, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import {
  LOAN_AMOUNT_FIELD,
  LOAN_FEE_TOKEN_FIELD,
  LoanFormData,
  loanSchema,
  LoanValidationParams,
  useForm
} from '@/lib/form';
import { LoanAction } from '@/types/loans';
import { getTokenInputProps } from '@/utils/helpers/input';
import { useGetAccountPositions } from '@/utils/hooks/api/loans/use-get-account-positions';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { useLoanFormData } from '../../hooks/use-loan-form-data';
import { isLendAsset } from '../../utils/is-loan-asset';
import { BorrowLimit } from '../BorrowLimit';
import { LoanDetails } from '../LoanDetails';
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
  overlappingModalRef: RefObject<HTMLDivElement>;
  onChangeLoan?: () => void;
};

const LoanForm = ({ asset, variant, position, overlappingModalRef, onChangeLoan }: LoanFormProps): JSX.Element => {
  const [inputAmount, setInputAmount] = useState<string>();
  const [isMaxAmount, setMaxAmount] = useState(false);

  const { t } = useTranslation();
  const {
    refetch,
    data: { hasCollateral }
  } = useGetAccountPositions();
  const prices = useGetPrices();
  const { assetAmount, assetPrice } = useLoanFormData(variant, asset, position);

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

  const transaction = useTransaction({ onSigning: onChangeLoan, onSuccess: refetch });

  const getTransactionArgs = useCallback(
    (values: LoanFormData) => {
      const amount = values[LOAN_AMOUNT_FIELD] || 0;
      const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

      return { monetaryAmount };
    },
    [asset.currency]
  );

  const handleSubmit = (data: LoanFormData) => {
    const transactionData = getTransactionArgs(data);

    if (!transactionData) return;

    let { monetaryAmount } = transactionData;

    if (transaction.fee.isEqualFeeCurrency(monetaryAmount.currency)) {
      monetaryAmount = transaction.calculateAmountWithFeeDeducted(monetaryAmount);
    }

    switch (variant) {
      case 'lend':
        return transaction.execute(Transaction.LOANS_LEND, monetaryAmount.currency, monetaryAmount);
      case 'withdraw':
        if (isMaxAmount) {
          return transaction.execute(Transaction.LOANS_WITHDRAW_ALL, monetaryAmount.currency);
        } else {
          return transaction.execute(Transaction.LOANS_WITHDRAW, monetaryAmount.currency, monetaryAmount);
        }
      case 'borrow':
        return transaction.execute(Transaction.LOANS_BORROW, monetaryAmount.currency, monetaryAmount);
      case 'repay':
        if (isMaxAmount) {
          return transaction.execute(Transaction.LOANS_REPAY_ALL, monetaryAmount.currency, assetAmount.available);
        } else {
          return transaction.execute(Transaction.LOANS_REPAY, monetaryAmount.currency, monetaryAmount);
        }
    }
  };

  const schemaParams: LoanValidationParams = {
    minAmount: assetAmount.min,
    maxAmount: assetAmount.available
  };

  const form = useForm<LoanFormData>({
    initialValues: { [LOAN_AMOUNT_FIELD]: '', [LOAN_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker },
    validationSchema: loanSchema(variant, schemaParams),
    onSubmit: handleSubmit,
    onComplete: (values) => {
      const transactionData = getTransactionArgs(values);

      if (!transactionData) return;

      const { monetaryAmount } = transactionData;

      switch (variant) {
        case 'lend':
          return transaction.fee.estimate(Transaction.LOANS_LEND, monetaryAmount.currency, monetaryAmount);
        case 'withdraw': {
          if (isMaxAmount) {
            return transaction.fee.estimate(Transaction.LOANS_WITHDRAW_ALL, monetaryAmount.currency);
          } else {
            return transaction.fee.estimate(Transaction.LOANS_WITHDRAW, monetaryAmount.currency, monetaryAmount);
          }
        }
        case 'borrow':
          return transaction.fee.estimate(Transaction.LOANS_BORROW, monetaryAmount.currency, monetaryAmount);

        case 'repay': {
          if (isMaxAmount) {
            return (
              transaction.fee
                // passing the limit calculated, so it can be used in the validation in transaction hook
                .estimate(Transaction.LOANS_REPAY_ALL, monetaryAmount.currency, assetAmount.available)
            );
          } else {
            return transaction.fee.estimate(Transaction.LOANS_REPAY, monetaryAmount.currency, monetaryAmount);
          }
        }
      }
    }
  });

  const monetaryAmount = newSafeMonetaryAmount(form.values[LOAN_AMOUNT_FIELD] || 0, asset.currency, true);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

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
      <StyledFormWrapper direction='column' justifyContent='space-between' gap='spacing6'>
        <Flex direction='column' gap='spacing4'>
          <TokenInput
            placeholder='0.00'
            ticker={asset.currency.ticker}
            aria-label={content.fieldAriaLabel}
            balanceLabel={content.label}
            valueUSD={convertMonetaryAmountToValueInUSD(monetaryAmount, assetPrice) ?? 0}
            onClickBalance={handleClickBalance}
            {...mergeProps(
              form.getFieldProps(LOAN_AMOUNT_FIELD, false, true),
              getTokenInputProps(assetAmount.available),
              { onChange: handleChange }
            )}
          />
          {showBorrowLimit && (
            <BorrowLimit
              // Only shows the alert if the user interacted with the form
              shouldDisplayLiquidationAlert={!!form.values[LOAN_AMOUNT_FIELD]}
              loanAction={variant}
              asset={asset}
              actionAmount={monetaryAmount}
              prices={prices}
              remainingDebt={variant === 'repay' ? assetAmount.max : undefined}
            />
          )}
        </Flex>
        <Flex direction='column' gap='spacing4'>
          {(variant === 'lend' || variant === 'borrow') && (
            <LoanDetails variant={variant} asset={asset} prices={prices} />
          )}
          <TransactionFeeDetails
            fee={transaction.fee}
            selectProps={{ ...form.getSelectFieldProps(LOAN_FEE_TOKEN_FIELD), modalRef: overlappingModalRef }}
          />
          <AuthCTA type='submit' disabled={isBtnDisabled} size='large'>
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
