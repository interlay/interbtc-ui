
import { useEffect } from 'react';
import {
  useSelector,
  useDispatch,
  useStore
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import IssueSteps from './issue/issue-steps';
import IssueRequests from './issue/issue-requests';
import RedeemSteps from './redeem/redeem-steps';
import RedeemRequests from './redeem/redeem-requests';
import Transfer from './transfer/transfer';
import Tabs, {
  Tab,
  HorizontalLine
} from './Tabs';
// ray test touch <
import useInterval from 'utils/hooks/use-interval';
import useUpdateIssueTransactions from 'services/use-update-issue-transactions';
// ray test touch >
import fetchRedeemTransactions from 'common/live-data/redeem-transaction.watcher';
import { StoreType } from 'common/types/util.types';
import { TabTypes } from 'utils/enums/tab-types';
import './app.page.scss';

function Application() {
  // TODO: should avoid getting the store bloated
  const { selectedTabType } = useSelector((state: StoreType) => state.general);
  const issueStep = useSelector((state: StoreType) => state.issue.step);
  const premiumRedeem = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const { t } = useTranslation();

  const tabsHidden = issueStep !== 'ENTER_BTC_AMOUNT' && selectedTabType === TabTypes.Issue;

  // TODO: should avoid using redux
  const dispatch = useDispatch();
  const store = useStore();

  // ray test touch <
  useUpdateIssueTransactions(0, 15, 10000);

  useEffect(() => {
    if (!dispatch) return;
    if (!store) return;

    fetchRedeemTransactions(dispatch, store);
  }, [
    dispatch,
    store
  ]);

  useInterval(() => {
    fetchRedeemTransactions(dispatch, store);
  }, 10000);
  // ray test touch >

  return (
    <MainContainer className='text-center white-background min-vh-100 app-page'>
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
              {selectedTabType === TabTypes.Issue && (
                <div className='issue-step-title'>{t('issue_page.deposit')}</div>
              )}
            </div>
          ) : (
            <>
              <Tabs>
                <Tab
                  tabType={TabTypes.Issue}
                  selectedTabType={selectedTabType}>
                  {t('issue')}
                </Tab>
                <Tab
                  tabType={TabTypes.Redeem}
                  selectedTabType={selectedTabType}>
                  {t('redeem')}
                </Tab>
                <Tab
                  tabType={TabTypes.Transfer}
                  selectedTabType={selectedTabType}>
                  {t('transfer')}
                </Tab>
              </Tabs>
              <HorizontalLine selectedTabType={selectedTabType} />
            </>
          )}
          <div className='content'>
            {selectedTabType === TabTypes.Issue && <IssueSteps />}
            {selectedTabType === TabTypes.Redeem && <RedeemSteps />}
            {selectedTabType === TabTypes.Transfer && <Transfer />}
          </div>
        </div>
      </div>
      {selectedTabType === TabTypes.Issue && <IssueRequests />}
      {selectedTabType === TabTypes.Redeem && <RedeemRequests />}
    </MainContainer>
  );
}

export default Application;
