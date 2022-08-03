import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import Panel from '@/components/Panel';
import InterlayRouterLink from '@/components/UI/InterlayRouterLink';
import InterlayTabGroup, {
  InterlayTab,
  InterlayTabList,
  InterlayTabPanel,
  InterlayTabPanels
} from '@/components/UI/InterlayTabGroup';
import WarningBanner from '@/components/WarningBanner';
import MainContainer from '@/parts/MainContainer';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { POLKADOT } from '@/utils/constants/relay-chain-names';
import useQueryParams from '@/utils/hooks/use-query-params';
import useUpdateQueryParameters, { QueryParameters } from '@/utils/hooks/use-update-query-parameters';

import CrossChainTransferForm from './CrossChainTransferForm';
import TransferForm from './TransferForm';

const TAB_IDS = Object.freeze({
  transfer: 'transfer',
  crossChainTransfer: 'crossChainTransfer'
});

const TAB_ITEMS = [
  {
    id: TAB_IDS.transfer,
    label: 'transfer'
  },
  {
    id: TAB_IDS.crossChainTransfer,
    label: 'cross chain transfer'
  }
];

const Transfer = (): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedTabId = queryParams.get(QUERY_PARAMETERS.TAB);
  const updateQueryParameters = useUpdateQueryParameters();

  const { t } = useTranslation();

  const updateQueryParametersRef = React.useRef<(newQueryParameters: QueryParameters) => void>();

  React.useLayoutEffect(() => {
    updateQueryParametersRef.current = updateQueryParameters;
  });

  React.useEffect(() => {
    if (!updateQueryParametersRef.current) return;

    const tabIdValues = Object.values(TAB_IDS);
    switch (true) {
      case selectedTabId === null:
      case selectedTabId && !tabIdValues.includes(selectedTabId):
        updateQueryParametersRef.current({
          [QUERY_PARAMETERS.TAB]: TAB_IDS.transfer
        });
    }
  }, [selectedTabId]);

  const selectedTabIndex = TAB_ITEMS.findIndex((tabItem) => tabItem.id === selectedTabId);

  const handleTabSelect = (index: number) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.TAB]: TAB_ITEMS[index].id
    });
  };

  return (
    <MainContainer>
      {process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT && (
        <WarningBanner className={clsx('mx-auto', 'md:max-w-xl')} warningLevel='info'>
          <p>
            In order to transfer Interlay tokens to Acala or Moonbeam, please use their respective dApps. Send tokens to{' '}
            <InterlayRouterLink to={{ pathname: 'https://apps.acala.network/bridge' }} target='_blank'>
              Acala
            </InterlayRouterLink>{' '}
            |{' '}
            <InterlayRouterLink to={{ pathname: 'https://apps.moonbeam.network/moonbeam' }} target='_blank'>
              Moonbeam
            </InterlayRouterLink>
          </p>
        </WarningBanner>
      )}
      <Panel className={clsx('mx-auto', 'w-full', 'md:max-w-xl', 'p-10')}>
        <InterlayTabGroup defaultIndex={selectedTabIndex} onChange={handleTabSelect}>
          <InterlayTabList>
            {TAB_ITEMS.map((tabItem) => (
              <InterlayTab key={tabItem.id} className='uppercase'>
                {t(tabItem.label)}
              </InterlayTab>
            ))}
          </InterlayTabList>
          <Hr1 className={clsx('border-t-2', 'my-2')} />
          <InterlayTabPanels className='mt-2'>
            <InterlayTabPanel>
              <TransferForm />
            </InterlayTabPanel>
            <InterlayTabPanel>
              <CrossChainTransferForm />
            </InterlayTabPanel>
          </InterlayTabPanels>
        </InterlayTabGroup>
      </Panel>
    </MainContainer>
  );
};

export default Transfer;
