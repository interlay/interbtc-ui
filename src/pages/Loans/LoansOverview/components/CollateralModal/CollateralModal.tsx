import { CollateralPosition, LoanAsset } from '@interlay/interbtc-api';
import { TFunction, useTranslation } from 'react-i18next';

import { Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, Status } from '@/component-library';
import { AuthCTA } from '@/components';
import { useGetAccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { BorrowLimit } from '../BorrowLimit';
import { LoanActionInfo } from '../LoanActionInfo';
import { StyledDescription } from './CollateralModal.style';

type CollateralModalVariant = 'enable' | 'disable' | 'disable-error';

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
    }
  }[variant]);

const getModalVariant = (isCollateralActive: boolean, ltvStatus?: Status): CollateralModalVariant => {
  if (!isCollateralActive) return 'enable';
  // User is trying switching off collateral
  if (!ltvStatus || ltvStatus !== 'success') return 'disable-error';

  return 'disable';
};

type Props = {
  asset?: LoanAsset;
  position?: CollateralPosition;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type CollateralModalProps = Props & InheritAttrs;

const CollateralModal = ({ asset, position, onClose, ...props }: CollateralModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { refetch } = useGetAccountLendingStatistics();
  const { getLTV } = useGetLTV();
  const prices = useGetPrices();

  const transaction = useTransaction({
    onSigning: onClose,
    onSuccess: refetch
  });

  if (!asset || !position) {
    return null;
  }

  const { isCollateral: isCollateralActive, amount: lendPositionAmount } = position;

  const loanAction = isCollateralActive ? 'withdraw' : 'lend';
  const currentLTV = getLTV({ type: loanAction, amount: lendPositionAmount });
  const variant = getModalVariant(isCollateralActive, currentLTV?.status);

  const content = getContentMap(t, variant, asset);

  const handleClickBtn = () => {
    if (variant === 'disable-error') {
      return onClose?.();
    }

    if (variant === 'enable') {
      return transaction.execute(Transaction.LOANS_ENABLE_COLLATERAL, asset.currency);
    } else {
      return transaction.execute(Transaction.LOANS_DISABLE_COLLATERAL, asset.currency);
    }
  };

  return (
    <Modal onClose={onClose} {...props}>
      <ModalHeader>{content.title}</ModalHeader>
      <ModalBody>
        <Flex direction='column' gap='spacing8'>
          <StyledDescription color='tertiary'>{content.description}</StyledDescription>
          <BorrowLimit loanAction={loanAction} asset={asset} actionAmount={lendPositionAmount} prices={prices} />
          {variant !== 'disable-error' && <LoanActionInfo prices={prices} />}
        </Flex>
      </ModalBody>
      <ModalFooter>
        <AuthCTA size='large' onPress={handleClickBtn}>
          {content.buttonLabel}
        </AuthCTA>
      </ModalFooter>
    </Modal>
  );
};

export { CollateralModal };
export type { CollateralModalProps };
