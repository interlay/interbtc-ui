import { forwardRef } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showBuyModal } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { CTAProps, Flex, Modal, ModalBody, ModalHeader, P, TabsItem } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { StyledCTA, StyledEntities, StyledEntitiesItem, StyledTabs, StyledWrapper } from './FundWallet.style';
import { useEntities, UseEntitiesResult } from './use-entities';

const TABS = ['buy', 'exchange'] as const;

type FundWalletMethod = typeof TABS[number];

const getData = (method: FundWalletMethod, entities: UseEntitiesResult, t: TFunction) =>
  ({
    buy: {
      title: t('fund_wallet_modal.buy'),
      description: (
        <Flex direction='column' gap='spacing1'>
          <P color='tertiary'>{t('fund_wallet_modal.buy_via_banxa', { ticker: GOVERNANCE_TOKEN.ticker })}</P>
          <P color='tertiary'>{t('fund_wallet_modal.banxa_leading_solution')}</P>
        </Flex>
      ),
      entities: entities.payments
    },
    exchange: {
      title: t('fund_wallet_modal.exchange'),
      description: (
        <P color='tertiary'>{t('fund_wallet_modal.please_check_terms', { ticker: GOVERNANCE_TOKEN.ticker })}</P>
      ),
      entities: entities.exchanges
    }
  }[method]);

type FundWalletProps = CTAProps;

const FundWallet = forwardRef<HTMLButtonElement, FundWalletProps>(
  (props, ref): JSX.Element => {
    const { t } = useTranslation();
    const entitiesData = useEntities();
    const dispatch = useDispatch();
    const { isBuyModalOpen } = useSelector((state: StoreType) => state.general);

    return (
      <>
        <StyledCTA variant='outlined' ref={ref} onPress={() => dispatch(showBuyModal(true))} {...props}>
          {t('fund_wallet')}
        </StyledCTA>
        <Modal align='top' isOpen={isBuyModalOpen} onClose={() => dispatch(showBuyModal(false))}>
          <ModalHeader>{t('fund_wallet')}</ModalHeader>
          <ModalBody noPadding>
            <StyledTabs size='large' fullWidth>
              {TABS.map((tab) => {
                const { title, description, entities } = getData(tab, entitiesData, t);

                return (
                  <TabsItem title={title} key={tab}>
                    <StyledWrapper direction='column' gap='spacing8'>
                      {description}
                      <StyledEntities>
                        {entities.map((entity, key) => (
                          <StyledEntitiesItem
                            key={key}
                            target='_blank'
                            rel='noopener noreferrer'
                            to={{ pathname: entity.pathname, search: entity.search }}
                          >
                            {entity.icon}
                          </StyledEntitiesItem>
                        ))}
                      </StyledEntities>
                    </StyledWrapper>
                  </TabsItem>
                );
              })}
            </StyledTabs>
          </ModalBody>
        </Modal>
      </>
    );
  }
);

FundWallet.displayName = 'FundWallet';

export { FundWallet };
export type { FundWalletProps };
