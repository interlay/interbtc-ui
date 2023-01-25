import { LiquidityPool } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalProps, TabsItem } from '@/component-library';

import { DepositForm } from '../DepositForm';
import { WithdrawForm } from '../WithdrawForm';
import { StyledTabs, StyledWrapper } from './PoolModal.style';

type Props = {
  pool?: LiquidityPool;
  accountId: AccountId;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type PoolModalProps = Props & InheritAttrs;

const PoolModal = ({ pool, onClose, accountId, ...props }: PoolModalProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (!pool) {
    return null;
  }

  return (
    <Modal aria-label={`${pool.lpToken.ticker} pool deposit or withdraw`} onClose={onClose} align='top' {...props}>
      <ModalBody noPadding>
        <StyledTabs size='large' fullWidth>
          <TabsItem title={t('deposit')}>
            <StyledWrapper>
              <DepositForm pool={pool} accountId={accountId} onChangePool={onClose} />
            </StyledWrapper>
          </TabsItem>
          <TabsItem title={t('withdraw')}>
            <StyledWrapper>
              <WithdrawForm pool={pool} accountId={accountId} onChangePool={onClose} />
            </StyledWrapper>
          </TabsItem>
        </StyledTabs>
      </ModalBody>
    </Modal>
  );
};

export { PoolModal };
export type { PoolModalProps };
