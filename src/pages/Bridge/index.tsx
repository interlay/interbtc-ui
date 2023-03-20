import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import Hr1 from '@/legacy-components/hrs/Hr1';
import Panel from '@/legacy-components/Panel';
import InterlayTabGroup, {
  InterlayTab,
  InterlayTabList,
  InterlayTabPanel,
  InterlayTabPanels
} from '@/legacy-components/UI/InterlayTabGroup';
import MainContainer from '@/parts/MainContainer';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import TAB_IDS from '@/utils/constants/tab-ids';
import { useGetCollateralCurrencies } from '@/utils/hooks/api/use-get-collateral-currencies';
import useQueryParams from '@/utils/hooks/use-query-params';
import useUpdateQueryParameters, { QueryParameters } from '@/utils/hooks/use-update-query-parameters';

import BurnForm from './BurnForm';
import IssueForm from './IssueForm';
import RedeemForm from './RedeemForm';

const TAB_ITEMS_WITHOUT_BURN = [
  {
    id: TAB_IDS.issue,
    label: 'issue'
  },
  {
    id: TAB_IDS.redeem,
    label: 'redeem'
  }
];

const TAB_ITEMS_WITH_BURN = [
  ...TAB_ITEMS_WITHOUT_BURN,
  {
    id: TAB_IDS.burn,
    label: 'burn'
  }
];

type BurnableToken = {
  collateral: CollateralCurrencyExt;
  maxBurnable: MonetaryAmount<CollateralCurrencyExt>;
};

const Bridge = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const queryParams = useQueryParams();
  const selectedTabId = queryParams.get(QUERY_PARAMETERS.TAB);
  const updateQueryParameters = useUpdateQueryParameters();

  const [burnable, setBurnable] = React.useState<BurnableToken[]>([]);

  const { data: collateralCurrencies } = useGetCollateralCurrencies(bridgeLoaded);

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
      case selectedTabId === TAB_IDS.burn && !burnable.length:
      case selectedTabId && !tabIdValues.includes(selectedTabId):
        updateQueryParametersRef.current({
          [QUERY_PARAMETERS.TAB]: TAB_IDS.issue
        });
    }
  }, [selectedTabId, burnable]);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!collateralCurrencies) return;

    (async () => {
      try {
        const burnableTokens: BurnableToken[] = [];

        collateralCurrencies.forEach(async (collateral) => {
          const maxBurnable = await window.bridge.redeem.getMaxBurnableTokens(collateral);

          if (maxBurnable.gt(BitcoinAmount.zero())) {
            burnableTokens.push({ collateral, maxBurnable });
          }
        });

        setBurnable(burnableTokens);
      } catch (error) {
        // TODO: should add error handling
        console.log('[Bridge] error => ', error);
      }
    })();
  }, [bridgeLoaded, collateralCurrencies]);

  if (selectedTabId === null) {
    return null;
  }

  const TAB_ITEMS = burnable ? TAB_ITEMS_WITH_BURN : TAB_ITEMS_WITHOUT_BURN;

  const selectedTabIndex = TAB_ITEMS.findIndex((tabItem) => tabItem.id === selectedTabId);

  const handleTabSelect = (index: number) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.TAB]: TAB_ITEMS[index].id
    });
  };

  return (
    <MainContainer>
      <Panel className={clsx('mx-auto', 'w-full', 'md:max-w-xl', 'p-10')}>
        <InterlayTabGroup
          defaultIndex={selectedTabIndex}
          onChange={(index) => {
            handleTabSelect(index);
          }}
        >
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
              <IssueForm />
            </InterlayTabPanel>
            <InterlayTabPanel>
              <RedeemForm />
            </InterlayTabPanel>
            {burnable.length && (
              <InterlayTabPanel>
                <BurnForm />
              </InterlayTabPanel>
            )}
          </InterlayTabPanels>
        </InterlayTabGroup>
      </Panel>
    </MainContainer>
  );
};

export default Bridge;
