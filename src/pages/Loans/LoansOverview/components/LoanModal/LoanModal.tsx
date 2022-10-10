import { Modal, ModalProps, Tabs, TabsItem } from '@/component-library';
import { LoanType } from '@/pages/Loans/types';
import {
  BorrowAssetData,
  BorrowPositionData,
  SupplyAssetData,
  SupplyPositionData
} from '@/utils/hooks/api/loans/use-get-loans-data';

import { BorrowForm } from './BorrowForm';
import { SupplyForm } from './SupplyForm';

type Props = {
  variant: LoanType;
  asset?: SupplyAssetData | BorrowAssetData;
  position?: SupplyPositionData | BorrowPositionData;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type LoanModalProps = Props & InheritAttrs;

const LoanModal = ({ variant = 'lend', asset, ...props }: LoanModalProps): JSX.Element | null => {
  if (!asset) {
    return null;
  }

  if (variant === 'borrow') {
    return (
      <Modal {...props}>
        <Tabs>
          <TabsItem title='Borrow'>
            <BorrowForm asset={asset as BorrowAssetData} variant='borrow' />
          </TabsItem>
          <TabsItem title='Repay'>
            <BorrowForm asset={asset as BorrowAssetData} variant='repay' />
          </TabsItem>
        </Tabs>
      </Modal>
    );
  }

  return (
    <Modal {...props}>
      <Tabs>
        <TabsItem title='Supply'>
          <SupplyForm asset={asset as SupplyAssetData} variant='lend' />
        </TabsItem>
        <TabsItem title='Withdraw'>
          <SupplyForm asset={asset as SupplyAssetData} variant='withdraw' />
        </TabsItem>
      </Tabs>
    </Modal>
  );
};

export { LoanModal };
export type { LoanModalProps };
