import { CollateralPosition, CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { TFunction, useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { CTA, Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, Status } from '@/component-library';
import ErrorModal from '@/legacy-components/ErrorModal';
import { useGetAccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useGetLTV } from '../../hooks/use-get-ltv';
import { BorrowLimit } from '../BorrowLimit';
import { LoanActionInfo } from '../LoanActionInfo';
import { StyledDescription } from './CollateralModal.style';

type ToggleCollateralVariables = { isEnabling: boolean; underlyingCurrency: CurrencyExt };

const toggleCollateral = ({ isEnabling, underlyingCurrency }: ToggleCollateralVariables) => {
  if (isEnabling) {
    return window.bridge.loans.enableAsCollateral(underlyingCurrency);
  } else {
    return window.bridge.loans.disableAsCollateral(underlyingCurrency);
  }
};

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

  const handleSuccess = () => {
    onClose?.();
    refetch();
  };

  const toggleCollateralMutation = useMutation<void, Error, ToggleCollateralVariables>(toggleCollateral, {
    onSuccess: handleSuccess
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

    const isEnabling = variant === 'enable';

    return toggleCollateralMutation.mutate({ isEnabling, underlyingCurrency: position.amount.currency });
  };

  return (
    <>
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
          <CTA size='large' onClick={handleClickBtn} loading={toggleCollateralMutation.isLoading}>
            {content.buttonLabel}
          </CTA>
        </ModalFooter>
      </Modal>
      {toggleCollateralMutation.isError && (
        <ErrorModal
          open={toggleCollateralMutation.isError}
          onClose={() => toggleCollateralMutation.reset()}
          title='Error'
          description={toggleCollateralMutation.error?.message || ''}
        />
      )}
    </>
  );
};

export { CollateralModal };
export type { CollateralModalProps };
