
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { BitcoinAmount } from '@interlay/monetary-js';

import IssueForm from './IssueForm';
import RedeemForm from './RedeemForm';
import TransferForm from './TransferForm';
import BurnForm from './BurnForm';
import MainContainer from 'parts/MainContainer';
import Hr1 from 'components/hrs/Hr1';
import InterlayTabGroup, {
  InterlayTabList,
  InterlayTabPanels,
  InterlayTab,
  InterlayTabPanel
} from 'components/UI/InterlayTabGroup';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters, { QueryParameters } from 'utils/hooks/use-update-query-parameters';
import TAB_IDS from 'utils/constants/tab-ids';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

const TAB_ITEMS_WITHOUT_BURN = [
  {
    id: TAB_IDS.issue,
    label: 'issue'
  },
  {
    id: TAB_IDS.redeem,
    label: 'redeem'
  },
  {
    id: TAB_IDS.transfer,
    label: 'transfer'
  }
];

const TAB_ITEMS_WITH_BURN = [
  ...TAB_ITEMS_WITHOUT_BURN,
  {
    id: TAB_IDS.burn,
    label: 'burn'
  }
];

const Bridge = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const queryParams = useQueryParams();
  const selectedTabId = queryParams.get(QUERY_PARAMETERS.TAB);
  const updateQueryParameters = useUpdateQueryParameters();

  const [burnable, setBurnable] = React.useState(false);

  const updateQueryParametersRef = React.useRef<(newQueryParameters: QueryParameters) => void>();
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    updateQueryParametersRef.current = updateQueryParameters;
  });

  React.useEffect(() => {
    if (!updateQueryParametersRef.current) return;

    const tabIdValues = Object.values(TAB_IDS);
    switch (true) {
    case selectedTabId === null:
    case selectedTabId === TAB_IDS.burn && !burnable:
    case selectedTabId && !tabIdValues.includes(selectedTabId):
      updateQueryParametersRef.current({
        [QUERY_PARAMETERS.TAB]: TAB_IDS.issue
      });
    }
  }, [
    selectedTabId,
    burnable
  ]);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    (async () => {
      try {
        const maxBurnableTokens = await window.bridge.interBtcApi.redeem.getMaxBurnableTokens(COLLATERAL_TOKEN);
        setBurnable(maxBurnableTokens.gt(BitcoinAmount.zero));
      } catch (error) {
        // TODO: should add error handling
        console.log('[Bridge] error => ', error);
      }
    })();
  }, [bridgeLoaded]);

  if (selectedTabId === null) {
    return null;
  }

  const TAB_ITEMS = burnable ? TAB_ITEMS_WITH_BURN : TAB_ITEMS_WITHOUT_BURN;

  const selectedTabIndex = TAB_ITEMS.findIndex(tabItem => tabItem.id === selectedTabId);

  const handleTabSelect = (index: number) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.TAB]: TAB_ITEMS[index].id
    });
  };

  return (
    <MainContainer>
      <div
        className={clsx(
          { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
          { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
          'border',

          // TODO: could be reused
          // MEMO: inspired by https://mui.com/components/buttons/
          'border-black',
          'border-opacity-25',
          'dark:border-white',
          'dark:border-opacity-25',

          'mx-auto',
          'w-full',
          'md:max-w-xl',
          'shadow',
          'p-10',
          'md:rounded-lg'
        )}>
        <InterlayTabGroup
          defaultIndex={selectedTabIndex}
          onChange={index => {
            handleTabSelect(index);
          }}>
          <InterlayTabList>
            {TAB_ITEMS.map((tabItem => (
              <InterlayTab
                key={tabItem.id}
                className='uppercase'>
                {t(tabItem.label)}
              </InterlayTab>
            )))}
          </InterlayTabList>
          <Hr1
            className={clsx(
              'border-t-2',
              'my-2'
            )} />
          <InterlayTabPanels className='mt-2'>
            <InterlayTabPanel>
              <IssueForm />
            </InterlayTabPanel>
            <InterlayTabPanel>
              <RedeemForm />
            </InterlayTabPanel>
            <InterlayTabPanel>
              <TransferForm />
            </InterlayTabPanel>
            {burnable && (
              <InterlayTabPanel>
                <BurnForm />
              </InterlayTabPanel>
            )}
          </InterlayTabPanels>
        </InterlayTabGroup>
      </div>
    </MainContainer>
  );
};

export default Bridge;
