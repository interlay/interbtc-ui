import { BorrowPosition, CollateralPosition, CurrencyExt, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { RefObject, useCallback } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { useGetAccountPositions } from '@/hooks/api/loans/use-get-account-positions';
import { useGetLoanLimitsAmount } from '@/hooks/api/loans/use-get-loan-limits-amount';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { isTransactionFormDisabled } from '@/hooks/transaction/utils/form';
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
import { getTokenPrice } from '@/utils/helpers/prices';

import { isLendAsset } from '../../utils/is-loan-asset';
import { BorrowLimit } from '../BorrowLimit';
import { LoanDetails } from '../LoanDetails';
import { StyledFormWrapper } from './LoanForm.style';

const isMaxWithdrawAmount = (amount: MonetaryAmount<CurrencyExt>, position?: BorrowPosition | CollateralPosition) =>
  !!position?.amount.eq(amount);

const isMaxRepayAmount = (amount: MonetaryAmount<CurrencyExt>, maxAmount: MonetaryAmount<CurrencyExt>) =>
  maxAmount.eq(amount);

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
  const { t } = useTranslation();
  const {
    refetch,
    data: { hasCollateral }
  } = useGetAccountPositions();
  const prices = useGetPrices();
  const { minAmount, maxAmount } = useGetLoanLimitsAmount(variant, asset, position);

  const assetPrice = getTokenPrice(prices, asset.currency.ticker)?.usd || 0;

  const { content } = getData(t, variant);

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
      case 'withdraw': {
        const isWithdrawAll = isMaxWithdrawAmount(monetaryAmount, position);

        if (isWithdrawAll) {
          return transaction.execute(Transaction.LOANS_WITHDRAW_ALL, monetaryAmount.currency);
        } else {
          return transaction.execute(Transaction.LOANS_WITHDRAW, monetaryAmount.currency, monetaryAmount);
        }
      }
      case 'borrow':
        return transaction.execute(Transaction.LOANS_BORROW, monetaryAmount.currency, monetaryAmount);
      case 'repay': {
        const isRepayAll = isMaxRepayAmount(monetaryAmount, maxAmount);

        if (isRepayAll) {
          return transaction.execute(Transaction.LOANS_REPAY_ALL, monetaryAmount.currency, maxAmount);
        } else {
          return transaction.execute(Transaction.LOANS_REPAY, monetaryAmount.currency, monetaryAmount);
        }
      }
    }
  };

  const schemaParams: LoanValidationParams = {
    minAmount,
    maxAmount
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
          const isWithdrawAll = isMaxWithdrawAmount(monetaryAmount, position);

          if (isWithdrawAll) {
            return transaction.fee.estimate(Transaction.LOANS_WITHDRAW_ALL, monetaryAmount.currency);
          } else {
            return transaction.fee.estimate(Transaction.LOANS_WITHDRAW, monetaryAmount.currency, monetaryAmount);
          }
        }
        case 'borrow':
          return transaction.fee.estimate(Transaction.LOANS_BORROW, monetaryAmount.currency, monetaryAmount);

        case 'repay': {
          const isRepayAll = isMaxRepayAmount(monetaryAmount, maxAmount);

          if (isRepayAll) {
            return (
              transaction.fee
                // passing the limit calculated, so it can be used in the validation in transaction hook
                .estimate(Transaction.LOANS_REPAY_ALL, monetaryAmount.currency, maxAmount)
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
            {...mergeProps(form.getFieldProps(LOAN_AMOUNT_FIELD, false, true), getTokenInputProps(maxAmount))}
          />
          {showBorrowLimit && (
            <BorrowLimit
              // Only shows the alert if the user interacted with the form
              shouldDisplayLiquidationAlert={!!form.values[LOAN_AMOUNT_FIELD]}
              loanAction={variant}
              asset={asset}
              actionAmount={monetaryAmount}
              prices={prices}
              remainingDebt={variant === 'repay' ? maxAmount : undefined}
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
