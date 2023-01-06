import { useTranslation } from 'react-i18next';

import { Modal, ModalBody, ModalProps, TabsItem } from '@/component-library';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';

import { PoolForm } from '../PoolForm';
import { StyledTabs, StyledWrapper } from './PoolModal.style';

type Props = {
  liquidityPool?: AccountLiquidityPool;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type PoolModalProps = Props & InheritAttrs;

const PoolModal = ({ liquidityPool, onClose, ...props }: PoolModalProps): JSX.Element | null => {
  const { t } = useTranslation();

  if (!liquidityPool) {
    return null;
  }

  return (
    <Modal aria-label={`${liquidityPool.lpToken.ticker} pool deposit or withdraw`} onClose={onClose} {...props}>
      <ModalBody noPadding>
        <StyledTabs size='large' fullWidth>
          <TabsItem title={t('deposit')}>
            <StyledWrapper>
              <PoolForm variant='deposit' liquidityPool={liquidityPool} onChangePool={onClose} />
            </StyledWrapper>
          </TabsItem>
          <TabsItem title={t('withdraw')}>
            <StyledWrapper>
              <PoolForm variant='withdraw' liquidityPool={liquidityPool} onChangePool={onClose} />
            </StyledWrapper>
          </TabsItem>
        </StyledTabs>
      </ModalBody>
    </Modal>
  );
};

export { PoolModal };
export type { PoolModalProps };
