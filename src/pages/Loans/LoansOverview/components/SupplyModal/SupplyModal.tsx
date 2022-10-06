import { Modal, ModalProps, Tabs, TabsItem } from '@/component-library';
import { SupplyAssetData, SupplyPositionData } from '@/utils/hooks/api/loans/use-get-loans-data';

import { SupplyForm } from './SupplyForm';

type Props = {
  asset?: SupplyAssetData;
  position?: SupplyPositionData;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SupplyModalProps = Props & InheritAttrs;

const SupplyModal = ({ asset, ...props }: SupplyModalProps): JSX.Element | null => {
  if (!asset) {
    return null;
  }

  return (
    <Modal {...props}>
      <Tabs>
        <TabsItem title='Supply'>
          <SupplyForm asset={asset} variant='supply' />
        </TabsItem>
        <TabsItem title='Withdraw'>
          <SupplyForm asset={asset} variant='withdraw' />
        </TabsItem>
      </Tabs>
    </Modal>
  );
};

export { SupplyModal };
export type { SupplyModalProps };
