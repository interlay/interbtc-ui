import { LendPosition, LoanAsset } from '@interlay/interbtc-api';
import { TFunction, useTranslation } from 'react-i18next';

import { CTA, Flex, Modal, ModalProps } from '@/component-library';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';
import { useGetLoansData } from '@/utils/hooks/api/loans/use-get-loans-data';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { isLiquidation } from '../../utils/is-liquidation';
import { BorrowLimit } from '../BorrowLimit';
import { LoanActionInfo } from '../LoanActionInfo';
import { StyledDescription, StyledTitle } from './CollateralModal.style';

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

const getModalVariant = (
  isCollateralActive: boolean,
  newCollateralRatio: number,
  liquidationScore: number
): CollateralModalVariant => {
  if (!isCollateralActive) return 'enable';
  // User is trying switching off collateral
  if (isLiquidation(newCollateralRatio, liquidationScore)) return 'disable-error';

  return 'disable';
};

type Props = {
  asset?: LoanAsset;
  position?: LendPosition;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type CollateralModalProps = Props & InheritAttrs;

const CollateralModal = ({ asset, position, onClose, ...props }: CollateralModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { thresholds } = useGetLoansData();
  const { getNewCollateralRatio } = useGetAccountLoansOverview();
  const prices = useGetPrices();

  if (!asset || !position) {
    return null;
  }

  const { isCollateral: isCollateralActive, amount: lendPositionAmount } = position;

  const borrowLimitVariant = isCollateralActive ? 'borrow' : 'lend';

  const newCollateralRatio = getNewCollateralRatio(borrowLimitVariant, asset.currency, lendPositionAmount) || 0;

  const variant = getModalVariant(isCollateralActive, newCollateralRatio, thresholds.error);

  const content = getContentMap(t, variant, asset);

  // TODO: connext with the lib
  const handleClickBtn = () => {
    onClose();

    switch (variant) {
      case 'enable':
        return console.log('enabling');
      case 'disable':
        return console.log('disabling');
      default:
        return;
    }
  };

  return (
    <Modal onClose={onClose} {...props}>
      <Flex direction='column' gap='spacing8'>
        <Flex direction='column' gap='spacing4' alignItems='center'>
          <StyledTitle>{content.title}</StyledTitle>
          <StyledDescription color='tertiary'>{content.description}</StyledDescription>
        </Flex>
        <BorrowLimit variant={borrowLimitVariant} asset={lendPositionAmount} thresholds={thresholds} />
        {variant !== 'disable-error' && <LoanActionInfo prices={prices} />}
        <CTA size='large' onClick={handleClickBtn}>
          {content.buttonLabel}
        </CTA>
      </Flex>
    </Modal>
  );
};

export { CollateralModal };
export type { CollateralModalProps };
