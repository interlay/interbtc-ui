import { LiquidityPool } from '@interlay/interbtc-api';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalProps, TabsItem } from '@/component-library';
import { useGetAccountPools } from '@/hooks/api/amm/use-get-account-pools';

import { DepositForm } from '../DepositForm';
import { WithdrawForm } from '../WithdrawForm';
import { StyledTabs, StyledWrapper } from './PoolModal.style';

type Props = {
  pool?: LiquidityPool;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type PoolModalProps = Props & InheritAttrs;

const PoolModal = ({ pool, onClose, ...props }: PoolModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { refetch } = useGetAccountPools();
  const overlappingModalRef = useRef<HTMLDivElement>(null);

  if (!pool) {
    return null;
  }

  return (
    <Modal
      aria-label={`${pool.lpToken.ticker} pool deposit or withdraw`}
      onClose={onClose}
      align='top'
      // Pool modal should not close while user interacts with stacked modal (slippage modal)
      shouldCloseOnInteractOutside={(el) => !overlappingModalRef.current?.contains(el)}
      {...props}
    >
      <ModalBody noPadding>
        <StyledTabs size='large' fullWidth disabledKeys={pool.isEmpty ? ['withdraw'] : []}>
          <TabsItem key='deposit' title={t('deposit')}>
            <StyledWrapper>
              <DepositForm
                overlappingModalRef={overlappingModalRef}
                pool={pool}
                onSuccess={refetch}
                onSigning={onClose}
              />
            </StyledWrapper>
          </TabsItem>
          <TabsItem key='withdraw' title={t('withdraw')}>
            <StyledWrapper>
              <WithdrawForm
                overlappingModalRef={overlappingModalRef}
                pool={pool}
                onSuccess={refetch}
                onSigning={onClose}
              />
            </StyledWrapper>
          </TabsItem>
        </StyledTabs>
      </ModalBody>
    </Modal>
  );
};

export { PoolModal };
export type { PoolModalProps };
