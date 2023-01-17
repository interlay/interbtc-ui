import { BorrowPosition, LendPosition, LoanAsset } from '@interlay/interbtc-api';
import { TFunction, useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalProps, TabsItem } from '@/component-library';
import { LoanAction, LoanType } from '@/types/loans';

import { LoanForm } from '../LoanForm';
import { StyledTabs, StyledWrapper } from './LoanModal.style';

type TabData = { variant: LoanAction; title: string };

type LoanTypeData = { tabs: TabData[] };

const getData = (t: TFunction, variant: LoanType): LoanTypeData => {
  const data: Record<LoanType, LoanTypeData> = {
    lend: {
      tabs: [
        { variant: 'lend', title: t('loans.lend') },
        { variant: 'withdraw', title: t('loans.withdraw') }
      ]
    },
    borrow: {
      tabs: [
        { variant: 'borrow', title: t('loans.borrow') },
        { variant: 'repay', title: t('loans.repay') }
      ]
    }
  };

  return data[variant];
};

type Props = {
  variant: LoanType;
  asset?: LoanAsset;
  position?: LendPosition | BorrowPosition;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type LoanModalProps = Props & InheritAttrs;

const LoanModal = ({ variant = 'lend', asset, position, onClose, ...props }: LoanModalProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (!asset) {
    return null;
  }

  const { tabs } = getData(t, variant);

  return (
    <Modal aria-label={`${variant} ${asset.currency.ticker}`} onClose={onClose} align='top' {...props}>
      <ModalBody noPadding>
        <StyledTabs size='large' fullWidth>
          {tabs.map((tab) => (
            <TabsItem title={tab.title} key={tab.variant}>
              <StyledWrapper>
                <LoanForm asset={asset} variant={tab.variant} position={position} onChangeLoan={onClose} />
              </StyledWrapper>
            </TabsItem>
          ))}
        </StyledTabs>
      </ModalBody>
    </Modal>
  );
};

export { LoanModal };
export type { LoanModalProps };
