
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';

import IssueSteps from './issue/issue-steps';
import IssueRequestsTable from './issue/IssueRequestsTable';
import RedeemSteps from './redeem/redeem-steps';
import RedeemRequestsTable from './redeem/RedeemRequestsTable';
import Transfer from './Transfer';
import Burn from './Burn';
import MainContainer from 'parts/MainContainer';
import Tabs, {
  Tab,
  TabPanel
} from 'components/Tabs';
import useUpdateIssueRequests from 'services/use-update-issue-requests';
import useUpdateRedeemRequests from 'services/use-update-redeem-requests';
import { StoreType } from 'common/types/util.types';
import useQuery from 'utils/hooks/use-query';
import useUpdateQueryParameters, { QueryParameters } from 'utils/hooks/use-update-query-parameters';
import TAB_IDS from 'utils/constants/tab-ids';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import './app.page.scss';

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

const Application = (): JSX.Element | null => {
  const { t } = useTranslation();

  const issueStep = useSelector((state: StoreType) => state.issue.step);
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  const query = useQuery();
  const selectedTabId = query.get(QUERY_PARAMETERS.tab);
  const updateQueryParameters = useUpdateQueryParameters();

  const [burnable, setBurnable] = React.useState(false);

  /**
   * TODO:
   * - Should avoid using redux.
   * - Could merge fetching issue and redeem transactions
   * or at least should use SWR caching strategy (https or react-query).
   */
  useUpdateIssueRequests(0, 100, 10000);
  useUpdateRedeemRequests(0, 100, 10000);

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
        [QUERY_PARAMETERS.tab]: TAB_IDS.issue
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
      [QUERY_PARAMETERS.tab]: TAB_ITEMS[index].id
    });
  };

  const tabsHidden = issueStep !== 'ENTER_BTC_AMOUNT' && selectedTabId === TAB_IDS.issue;

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
          {tabsHidden ? (
            <h4
              className={clsx(
                'text-2xl',
                'text-interlayTreePoppy',
                'font-medium',
                'text-center',
                'my-3'
              )}>
              {t('issue_page.deposit')}
            </h4>
          ) : (
            <>
              <Tabs
                className={clsx(
                  'grid',
                  { 'grid-cols-3': TAB_ITEMS.length === 3 },
                  { 'grid-cols-4': TAB_ITEMS.length === 4 },
                  'rounded-lg',
                  'bg-interlaySilverChalice-200'
                )}>
                {TAB_ITEMS.map((tabItem, index) => (
                  <Tab
                    anchorClassName={clsx(
                      'font-medium',
                      'px-4',
                      'py-2.5',
                      'uppercase',
                      { 'rounded-lg text-white transition': selectedTabId === tabItem.id },
                      { 'bg-interlayRose': tabItem.id === TAB_IDS.issue && selectedTabId === TAB_IDS.issue },
                      { 'bg-interlayTreePoppy': tabItem.id === TAB_IDS.redeem && selectedTabId === TAB_IDS.redeem },
                      { 'bg-interlayDodgerBlue':
                        tabItem.id === TAB_IDS.transfer && selectedTabId === TAB_IDS.transfer },
                      { 'bg-interlayPomegranate': tabItem.id === TAB_IDS.burn && selectedTabId === TAB_IDS.burn },
                      { 'opacity-30': selectedTabId !== tabItem.id }
                    )}
                    key={tabItem.id}
                    id={tabItem.id}
                    onSelect={handleTabSelect(index)}>
                    {t(tabItem.label)}
                  </Tab>
                ))}
              </Tabs>
              <hr
                className={clsx(
                  'border-t-2',
                  'my-2',
                  { 'border-interlayRose': selectedTabId === TAB_IDS.issue },
                  { 'border-interlayTreePoppy': selectedTabId === TAB_IDS.redeem },
                  { 'border-interlayDodgerBlue': selectedTabId === TAB_IDS.transfer },
                  { 'border-interlayPomegranate': selectedTabId === TAB_IDS.burn }
                )} />
            </>
          )}
          <TabPanel
            index={0}
            selectedIndex={selectedTabIndex}
            id={TAB_IDS.issue}>
            <IssueSteps />
          </TabPanel>
          <TabPanel
            index={1}
            selectedIndex={selectedTabIndex}
            id={TAB_IDS.redeem}>
            <RedeemSteps />
          </TabPanel>
          <TabPanel
            index={2}
            selectedIndex={selectedTabIndex}
            id={TAB_IDS.transfer}>
            <Transfer />
          </TabPanel>
          {burnable && (
            <TabPanel
              index={3}
              selectedIndex={selectedTabIndex}
              id={TAB_IDS.burn}>
              <Burn />
            </TabPanel>
          )}
        </div>
      </div>
      {selectedTabId === TAB_IDS.issue && <IssueRequestsTable />}
      {selectedTabId === TAB_IDS.redeem && <RedeemRequestsTable />}
    </MainContainer>
  );
};

export default Application;
