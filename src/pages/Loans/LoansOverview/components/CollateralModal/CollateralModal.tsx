import { CollateralPosition, CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useEffect, useRef } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { CTA, Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, Status } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import {
  LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD,
  toggleCollateralLoanSchema,
  ToggleCollateralLoansFormData,
  useForm
} from '@/lib/form';
import { useGetAccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { BorrowLimit } from '../BorrowLimit';
import { StyledDescription } from './CollateralModal.style';

type CollateralModalVariant = 'enable' | 'disable' | 'disable-error' | 'disable-vault-collateral';

const getContentMap = (t: TFunction, variant: CollateralModalVariant, asset: LoanAsset) =>
  ({
    enable: {
      title: 'Enable as Collateral',
      description:
        'Each asset used as collateral increases your borrowing limit. Be aware that this can subject the asset to being seized in liquidation.',
      buttonLabel: `Use ${asset.currency.ticker} as Collateral`
    },
    disable: {
      title: 'Disable Collateral',
      description:
        "This asset will no longer be used towards your borrowing limit, and can't be seized in liquidation.",
      buttonLabel: `Disable ${asset.currency.ticker}`
    },
    'disable-error': {
      title: 'Collateral Required',
      description:
        'This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral.',
      buttonLabel: `Dismiss`
    },
    'disable-vault-collateral': {
      title: 'Already used as vault collateral',
      description:
        'This asset is already used as vault collateral and therefore can not be used as collateral for lending.',
      buttonLabel: `Dismiss`
    }
  }[variant]);

const getModalVariant = (
  isCollateralActive: boolean,
  ltvStatus: Status | undefined,
  vaultCollateralAmount: MonetaryAmount<CurrencyExt>
): CollateralModalVariant => {
  if (!vaultCollateralAmount.isZero()) return 'disable-vault-collateral';
  if (!isCollateralActive) return 'enable';
  // User is trying switching off collateral
  if (!ltvStatus || ltvStatus !== 'success') return 'disable-error';

  return 'disable';
};

type Props = {
  asset: LoanAsset;
  position: CollateralPosition;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type CollateralModalProps = Props & InheritAttrs;

const CollateralModal = ({ asset, position, onClose, isOpen, ...props }: CollateralModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { refetch } = useGetAccountLendingStatistics();
  const { getLTV } = useGetLTV();
  const prices = useGetPrices();

  const overlappingModalRef = useRef<HTMLDivElement>(null);

  const transaction = useTransaction({
    onSigning: onClose,
    onSuccess: refetch
  });

  const { isCollateral: isCollateralActive, amount: lendPositionAmount, vaultCollateralAmount } = position;

  const loanAction = isCollateralActive ? 'withdraw' : 'lend';
  const currentLTV = getLTV({ type: loanAction, amount: lendPositionAmount });
  const variant = getModalVariant(isCollateralActive, currentLTV?.status, vaultCollateralAmount);

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
    onComplete: async () => {
      if (variant === 'enable') {
        return transaction.fee.estimate(Transaction.LOANS_ENABLE_COLLATERAL, asset.currency);
      } else {
        return transaction.fee.estimate(Transaction.LOANS_DISABLE_COLLATERAL, asset.currency);
      }
    }
  });

  // Doing this call on mount so that the form becomes dirty
  // TODO: find better approach
  useEffect(() => {
    if (variant === 'disable-error' || variant === 'disable-vault-collateral' || !isOpen) return;

    form.setFieldValue(LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD, transaction.fee.defaultCurrency.ticker, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, variant]);

  const content = getContentMap(t, variant, asset);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnInteractOutside={(el) => !overlappingModalRef.current?.contains(el)}
      {...props}
    >
      <ModalHeader>{content.title}</ModalHeader>
      <ModalBody>
        <Flex direction='column' gap='spacing8'>
          <StyledDescription color='tertiary'>{content.description}</StyledDescription>
          {variant !== 'disable-vault-collateral' && (
            <BorrowLimit loanAction={loanAction} asset={asset} actionAmount={lendPositionAmount} prices={prices} />
          )}
        </Flex>
      </ModalBody>
      <ModalFooter>
        {variant === 'disable-error' || variant === 'disable-vault-collateral' ? (
          <CTA size='large' onPress={onClose}>
            {content.buttonLabel}
          </CTA>
        ) : (
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
                {content.buttonLabel}
              </AuthCTA>
            </Flex>
          </form>
        )}
      </ModalFooter>
    </Modal>
  );
};

export { CollateralModal };
export type { CollateralModalProps };
