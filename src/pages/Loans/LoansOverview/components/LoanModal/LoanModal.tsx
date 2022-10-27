import { LendPosition, LoanAsset, LoanPosition } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';

import { Modal, ModalProps, TabsItem } from '@/component-library';
import { LoanType } from '@/types/loans';

import { BorrowForm } from './BorrowForm';
import { LendForm } from './LendForm';
import { StyledTabs, StyledWrapper } from './LoanModal.style';

type Props = {
  variant: LoanType;
  asset?: LoanAsset;
  position: LoanPosition | undefined;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type LoanModalProps = Props & InheritAttrs;

const LoanModal = ({ variant = 'lend', asset, position, ...props }: LoanModalProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (!asset) {
    return null;
  }

  if (variant === 'borrow') {
    return (
      <Modal {...props}>
        <StyledTabs size='large' fullWidth>
          <TabsItem title={t('loans.borrow')}>
            <StyledWrapper>
              <BorrowForm asset={asset} variant='borrow' position={position} />
            </StyledWrapper>
          </TabsItem>
          <TabsItem title={t('loans.repay')}>
            <StyledWrapper>
              <BorrowForm asset={asset} variant='repay' position={position} />
            </StyledWrapper>
          </TabsItem>
        </StyledTabs>
      </Modal>
    );
  }

  return (
    <Modal {...props}>
      <StyledTabs size='large' fullWidth>
        <TabsItem title={t('loans.lend')}>
          <StyledWrapper>
            <LendForm asset={asset} variant='lend' position={position as LendPosition} />
          </StyledWrapper>
        </TabsItem>
        <TabsItem title={t('loans.withdraw')}>
          <StyledWrapper>
            <LendForm asset={asset} variant='withdraw' position={position as LendPosition} />
          </StyledWrapper>
        </TabsItem>
      </StyledTabs>
    </Modal>
  );
};

export { LoanModal };
export type { LoanModalProps };
