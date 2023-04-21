import { LiquidityPool } from '@interlay/interbtc-api';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalProps, TabsItem } from '@/component-library';
import { useGetAccountPools } from '@/utils/hooks/api/amm/use-get-account-pools';

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
  const ref = useRef<HTMLDivElement>(null);

  if (!pool) {
    return null;
  }

  const handleAction = () => {
    refetch();
    onClose?.();
  };

  return (
    <Modal
      aria-label={`${pool.lpToken.ticker} pool deposit or withdraw`}
      onClose={onClose}
      align='top'
      // Pool modal should not close while user interacts with stacked modal (slippage modal)
      shouldCloseOnInteractOutside={(el) => !ref.current?.contains(el)}
      {...props}
    >
      <ModalBody noPadding>
        <StyledTabs size='large' fullWidth>
          <TabsItem title={t('deposit')}>
            <StyledWrapper>
              <DepositForm slippageModalRef={ref} pool={pool} onDeposit={handleAction} />
            </StyledWrapper>
          </TabsItem>
          {!pool.isEmpty && (
            <TabsItem title={t('withdraw')}>
              <StyledWrapper>
                <WithdrawForm slippageModalRef={ref} pool={pool} onWithdraw={handleAction} />
              </StyledWrapper>
            </TabsItem>
          )}
        </StyledTabs>
      </ModalBody>
    </Modal>
  );
};

export { PoolModal };
export type { PoolModalProps };
