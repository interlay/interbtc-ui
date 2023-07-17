import { LoanAsset } from '@interlay/interbtc-api';
import { useEffect, useRef } from 'react';

import { Flex } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import {
  LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD,
  toggleCollateralLoanSchema,
  ToggleCollateralLoansFormData,
  useForm
} from '@/lib/form';
import { useGetAccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { CollateralModalVariant } from './CollateralModal';

type CollateralFormProps = {
  asset: LoanAsset;
  variant: Extract<CollateralModalVariant, 'enable' | 'disable'>;
  isOpen?: boolean;
  onSigning: () => void;
};

const CollateralForm = ({ asset, variant, isOpen, onSigning }: CollateralFormProps): JSX.Element | null => {
  const { refetch } = useGetAccountLendingStatistics();

  const overlappingModalRef = useRef<HTMLDivElement>(null);

  const transaction = useTransaction({
    onSigning,
    onSuccess: refetch
  });

  const handleSubmit = () => {
    if (variant === 'enable') {
      return transaction.execute(Transaction.LOANS_ENABLE_COLLATERAL, asset.currency);
    } else {
      return transaction.execute(Transaction.LOANS_DISABLE_COLLATERAL, asset.currency);
    }
  };

  const form = useForm<ToggleCollateralLoansFormData>({
    initialValues: {
      [LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD]: ''
    },
    validationSchema: toggleCollateralLoanSchema(),
    onSubmit: handleSubmit,
    onComplete: async (values) => {
      const feeTicker = values[LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD];

      if (variant === 'enable') {
        return transaction.fee.setCurrency(feeTicker).estimate(Transaction.LOANS_ENABLE_COLLATERAL, asset.currency);
      } else {
        return transaction.fee.setCurrency(feeTicker).estimate(Transaction.LOANS_DISABLE_COLLATERAL, asset.currency);
      }
    }
  });

  // Doing this call on mount so that the form becomes dirty
  // TODO: find better approach
  useEffect(() => {
    if (!isOpen) return;

    form.setFieldValue(LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD, transaction.fee.defaultCurrency.ticker, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <form onSubmit={form.handleSubmit}>
      <Flex direction='column' gap='spacing4'>
        <TransactionFeeDetails
          {...transaction.fee.detailsProps}
          selectProps={{
            ...form.getSelectFieldProps(LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD),
            modalRef: overlappingModalRef
          }}
        />
        <AuthCTA type='submit' size='large' disabled={isBtnDisabled} loading={transaction.isLoading}>
          {variant === 'enable' ? `Use ${asset.currency.ticker} as Collateral` : `Disable ${asset.currency.ticker}`}
        </AuthCTA>
      </Flex>
    </form>
  );
};

export { CollateralForm };
export type { CollateralFormProps };
