import { useTranslation } from 'react-i18next';

import { Modal, ModalProps, Tabs, TabsItem } from '@/component-library';
import { LoanType } from '@/pages/Loans/types';
import {
  BorrowAssetData,
  BorrowPositionData,
  LendAssetData,
  LendPositionData
} from '@/utils/hooks/api/loans/use-get-loans-data';

import { BorrowForm } from './BorrowForm';
import { LendForm } from './LendForm';

type Props = {
  variant: LoanType;
  asset?: LendAssetData | BorrowAssetData;
  position?: LendPositionData | BorrowPositionData;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type LoanModalProps = Props & InheritAttrs;

const LoanModal = ({ variant = 'lend', asset, ...props }: LoanModalProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (!asset) {
    return null;
  }

  if (variant === 'borrow') {
    return (
      <Modal {...props}>
        <Tabs>
          <TabsItem title={t('loans.borrow')}>
            <BorrowForm asset={asset as BorrowAssetData} variant='borrow' />
          </TabsItem>
          <TabsItem title={t('loans.repay')}>
            <BorrowForm asset={asset as BorrowAssetData} variant='repay' />
          </TabsItem>
        </Tabs>
      </Modal>
    );
  }

  return (
    <Modal {...props}>
      <Tabs>
        <TabsItem title={t('loans.lend')}>
          <LendForm asset={asset as LendAssetData} variant='lend' />
        </TabsItem>
        <TabsItem title={t('loans.withdraw')}>
          <LendForm asset={asset as LendAssetData} variant='withdraw' />
        </TabsItem>
      </Tabs>
    </Modal>
  );
};

export { LoanModal };
export type { LoanModalProps };
