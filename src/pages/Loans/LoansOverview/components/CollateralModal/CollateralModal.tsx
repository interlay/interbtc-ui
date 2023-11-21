import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useRef } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { CTA, Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, Status } from '@/component-library';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { CollateralPosition, LoanAsset } from '@/types/loans';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { BorrowLimit } from '../BorrowLimit';
import { CollateralForm } from './CollateralForm';
import { StyledDescription } from './CollateralModal.style';

type CollateralModalVariant = 'enable' | 'disable' | 'disable-error' | 'disable-vault-collateral';

const getContentMap = (t: TFunction, variant: CollateralModalVariant) =>
  ({
    enable: {
      title: 'Enable as Collateral',
      description:
        'Each asset used as collateral increases your borrowing limit. Be aware that this can subject the asset to being seized in liquidation.'
    },
    disable: {
      title: 'Disable Collateral',
      description: "This asset will no longer be used towards your borrowing limit, and can't be seized in liquidation."
    },
    'disable-error': {
      title: 'Collateral Required',
      description:
        'This asset is required to support your borrowed assets. Either repay borrowed assets, or supply another asset as collateral.'
    },
    'disable-vault-collateral': {
      title: 'Already used as vault collateral',
      description:
        'This asset is already used as vault collateral and therefore can not be used as collateral for lending.'
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
  asset?: LoanAsset;
  position?: CollateralPosition;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type CollateralModalProps = Props & InheritAttrs;

const CollateralModal = ({ asset, position, onClose, isOpen, ...props }: CollateralModalProps): JSX.Element | null => {
  const { t } = useTranslation();

  const { getLTV } = useGetLTV();
  const prices = useGetPrices();

  const overlappingModalRef = useRef<HTMLDivElement>(null);

  if (!asset || !position) {
    return null;
  }

  const { isCollateral: isCollateralActive, amount: lendPositionAmount, vaultCollateralAmount } = position;

  const loanAction = isCollateralActive ? 'withdraw' : 'lend';
  const currentLTV = getLTV({ type: loanAction, amount: lendPositionAmount });
  const variant = getModalVariant(isCollateralActive, currentLTV?.status, vaultCollateralAmount);

  const content = getContentMap(t, variant);

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
            {t('dismiss')}
          </CTA>
        ) : (
          <CollateralForm
            asset={asset}
            onSigning={onClose}
            variant={variant}
            isOpen={isOpen}
            overlappingModalRef={overlappingModalRef}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export { CollateralModal };
export type { CollateralModalProps, CollateralModalVariant };
