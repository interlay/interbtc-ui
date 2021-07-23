
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';

import IssueForm from './IssueForm';
import RedeemForm from './RedeemForm';
import TransferForm from './TransferForm';
import BurnForm from './BurnForm';
import MainContainer from 'parts/MainContainer';
import Tabs, {
  Tab,
  TabPanel
} from 'components/Tabs';
import { StoreType } from 'common/types/util.types';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters, { QueryParameters } from 'utils/hooks/use-update-query-parameters';
import TAB_IDS from 'utils/constants/tab-ids';
import { QUERY_PARAMETERS } from 'utils/constants/links';

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

const Home = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  const query = useQueryParams();
  const selectedTabId = query.get(QUERY_PARAMETERS.TAB);
  const updateQueryParameters = useUpdateQueryParameters();

  const [burnable, setBurnable] = React.useState(false);

  const updateQueryParametersRef = React.useRef<(newQueryParameters: QueryParameters) => void>();
  React.useEffect(() => {
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
    if (!polkaBtcLoaded) return;
    (async () => {
      try {
        const maxBurnableTokens = await window.polkaBTC.redeem.getMaxBurnableTokens();
        setBurnable(maxBurnableTokens > new Big(0));
      } catch (error) {
        // TODO: should add error handling
        console.log('[Application] error.message => ', error.message);
      }
    })();
  }, [polkaBtcLoaded]);

  if (selectedTabId === null) {
    return null;
  }

  const TAB_ITEMS = burnable ? TAB_ITEMS_WITH_BURN : TAB_ITEMS_WITHOUT_BURN;

  const selectedTabIndex = TAB_ITEMS.findIndex(tabItem => tabItem.id === selectedTabId);

  const handleTabSelect = (index: number) => () => {
    updateQueryParameters({
      [QUERY_PARAMETERS.TAB]: TAB_ITEMS[index].id
    });
  };

  return (
    <MainContainer>
      <div
        className={clsx(
          'container',
          'my-12',
          'mx-auto'
        )}>
        <div
          className={clsx(
            'bg-white',
            'mx-auto',
            'w-full',
            'md:max-w-xl',
            'shadow',
            'p-10',
            'rounded-lg'
          )}>
          <>
            <Tabs
              className={clsx(
                'grid',
                { 'grid-cols-3': TAB_ITEMS.length === 3 },
                { 'grid-cols-4': TAB_ITEMS.length === 4 },
                'rounded-lg',
                'bg-interlayPaleSky-200'
              )}>
              {TAB_ITEMS.map((tabItem, index) => {
                const selected = selectedTabIndex === index;

                return (
                  <Tab
                    anchorClassName={clsx(
                      'font-medium',
                      'px-4',
                      'py-2.5',
                      'uppercase',
                      selected ?
                        clsx(
                          'rounded-lg',
                          'text-white',
                          'transition',
                          'bg-interlayDenim'
                        ) : 'opacity-30'
                    )}
                    key={tabItem.id}
                    id={tabItem.id}
                    onSelect={handleTabSelect(index)}>
                    {t(tabItem.label)}
                  </Tab>
                );
              })}
            </Tabs>
            <hr
              className={clsx(
                'border-t-2',
                'my-2',
                'border-interlayDenim'
              )} />
          </>
          <TabPanel
            index={0}
            selectedIndex={selectedTabIndex}
            id={TAB_IDS.issue}>
            <IssueForm />
          </TabPanel>
          <TabPanel
            index={1}
            selectedIndex={selectedTabIndex}
            id={TAB_IDS.redeem}>
            <RedeemForm />
          </TabPanel>
          <TabPanel
            index={2}
            selectedIndex={selectedTabIndex}
            id={TAB_IDS.transfer}>
            <TransferForm />
          </TabPanel>
          {burnable && (
            <TabPanel
              index={3}
              selectedIndex={selectedTabIndex}
              id={TAB_IDS.burn}>
              <BurnForm />
            </TabPanel>
          )}
        </div>
      </div>
    </MainContainer>
  );
};

export default Home;
