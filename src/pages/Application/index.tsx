
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import IssueSteps from './issue/issue-steps';
import IssueRequests from './issue/IssueRequests';
import RedeemSteps from './redeem/redeem-steps';
import RedeemRequests from './redeem/RedeemRequests';
import Transfer from './transfer/transfer';
import Tabs, {
  Tab,
  HorizontalLine
} from './Tabs';
import useUpdateIssueRequests from 'services/use-update-issue-requests';
import useUpdateRedeemRequests from 'services/use-update-redeem-requests';
import { StoreType } from 'common/types/util.types';
import useQuery from 'utils/hooks/use-query';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import TAB_TYPES from 'utils/constants/tab-types';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import './app.page.scss';

function Application(): JSX.Element | null {
  const query = useQuery();
  const selectedTabType = query.get(QUERY_PARAMETERS.type);
  const updateQueryParameters = useUpdateQueryParameters();
  const issueStep = useSelector((state: StoreType) => state.issue.step);
  const premiumRedeem = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const { t } = useTranslation();

  /**
   * TODO:
   * - Should avoid using redux.
   * - Could merge fetching issue and redeem transactions
   * or at least should use SWR caching strategy (https or react-query).
   */
  useUpdateIssueRequests(0, 100, 10000);
  useUpdateRedeemRequests(0, 100, 10000);

  const tabTypeValues = Object.values(TAB_TYPES);
  if (selectedTabType === null || !tabTypeValues.includes(selectedTabType)) {
    updateQueryParameters({
      [QUERY_PARAMETERS.type]: TAB_TYPES.issue
    });
  }
  if (selectedTabType === null) {
    return null;
  }

  const tabsHidden = issueStep !== 'ENTER_BTC_AMOUNT' && selectedTabType === TAB_TYPES.issue;

  return (
    <MainContainer className='text-center white-background app-page'>
      <div
        className={clsx(
          'container',
          'mt-12',
          'mx-auto'
        )}>
        <div
          className={clsx(
            'mx-auto',
            'w-full',
            'md:max-w-xl',
            'tab-content-wrapper',
            { 'pink-gradient': premiumRedeem }
          )}>
          {tabsHidden ? (
            <div className='step-title'>
              {selectedTabType === TAB_TYPES.issue && (
                <div className='issue-step-title'>{t('issue_page.deposit')}</div>
              )}
            </div>
          ) : (
            <>
              <Tabs>
                <Tab
                  tabType={TAB_TYPES.issue}
                  selectedTabType={selectedTabType}>
                  {t('issue')}
                </Tab>
                <Tab
                  tabType={TAB_TYPES.redeem}
                  selectedTabType={selectedTabType}>
                  {t('redeem')}
                </Tab>
                <Tab
                  tabType={TAB_TYPES.transfer}
                  selectedTabType={selectedTabType}>
                  {t('transfer')}
                </Tab>
              </Tabs>
              <HorizontalLine selectedTabType={selectedTabType} />
            </>
          )}
          <div className='content'>
            {selectedTabType === TAB_TYPES.issue && <IssueSteps />}
            {selectedTabType === TAB_TYPES.redeem && <RedeemSteps />}
            {selectedTabType === TAB_TYPES.transfer && <Transfer />}
          </div>
        </div>
      </div>
      {selectedTabType === TAB_TYPES.issue && <IssueRequests />}
      {selectedTabType === TAB_TYPES.redeem && <RedeemRequests />}
    </MainContainer>
  );
}

export default Application;
