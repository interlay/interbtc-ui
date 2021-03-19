
import * as React from 'react';
import {
  useSelector,
  useDispatch,
  useStore
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
// ray test touch <
import { Transaction } from '@interlay/polkabtc';
// ray test touch >

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
import fetchIssueTransactions from 'common/live-data/issue-transaction.watcher';
import fetchRedeemTransactions from 'common/live-data/redeem-transaction.watcher';
import { StoreType } from 'common/types/util.types';
import { TabTypes } from 'utils/enums/tab-types';
import './app.page.scss';

function Application() {
  // TODO: should avoid getting the store bloated
  // ray test touch <
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
  // ray test touch >
  const { selectedTabType } = useSelector((state: StoreType) => state.general);
  const issueStep = useSelector((state: StoreType) => state.issue.step);
  const premiumRedeem = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const { t } = useTranslation();

  const tabsHidden = issueStep !== 'ENTER_BTC_AMOUNT' && selectedTabType === TabTypes.Issue;

  /**
   * TODO: should create a custom hook to simplify the logic.
   * - Re: `react-use`
   * - Re: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
   * - Re: https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
   * - Could avoid using redux.
   * - Should use nested `setTimeout` instead of `setInterval`.
   * - Should merge issue and redeem logic as they make the same calls.
   */
  const dispatch = useDispatch();
  const store = useStore();
  // ray test touch <
  // React.useEffect(() => {
  //   if (!dispatch) return;
  //   if (!store) return;
  //   fetchIssueTransactions(dispatch, store);
  //   const timerId = setInterval(() => fetchIssueTransactions(dispatch, store), 10000);
  //   return () => {
  //     clearInterval(timerId);
  //   };
  // }, [
  //   dispatch,
  //   store
  // ]);
  // React.useEffect(() => {
  //   if (!dispatch) return;
  //   if (!store) return;
  //   fetchRedeemTransactions(dispatch, store);
  //   const timerId = setInterval(() => fetchRedeemTransactions(dispatch, store), 10000);
  //   return () => {
  //     clearInterval(timerId);
  //   };
  // }, [
  //   dispatch,
  //   store
  // ]);

  React.useEffect(() => {
    if (!dispatch) return;
    if (!store) return;
    if (!polkaBtcLoaded) return;

    // Initial population
    fetchIssueTransactions(dispatch, store);
    fetchRedeemTransactions(dispatch, store);

    // With a default connection to the local node
    const connectionAPI = window.polkaBTC.api;

    const transaction = new Transaction(connectionAPI);

    // TODO: should unsubscribe when unmounted
    // Subscribe to system events via storage
    connectionAPI.query.system.events(events => {
      const myAccountRecord = events.find(record => {
        const event = record.event;
        const myAccountItem = event.data.find(item => item.toString() === window.polkaBTC.account);

        return !!myAccountItem;
      });

      // ray test touch <
      console.log(`\nReceived ${events.length} events:`);
      // ray test touch >

      if (myAccountRecord) {
        // ray test touch <
        console.log('ray : ***** myAccountRecord => ', myAccountRecord);
        // // Loop through the Vec<EventRecord>
        // events.forEach(record => {
        //   // Extract the phase, event and the event types
        //   const { event, phase } = record;
        //   const types = event.typeDef;
        //   // Show what we are busy with
        //   console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
        //   console.log(`\t\t${event.meta.documentation.toString()}`);
        //   // Loop through each of the parameters, displaying the type and data
        //   event.data.forEach((data, index) => {
        //     console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
        //   });
        // });
        // ray test touch >

        switch (true) {
        // TODO: could define `isSuccessful` as a static method as it's an utility
        case transaction.isSuccessful(events, connectionAPI.events.issue.CancelIssue):
        case transaction.isSuccessful(events, connectionAPI.events.issue.ExecuteIssue):
        case transaction.isSuccessful(events, connectionAPI.events.issue.RequestIssue): {
          // ray test touch <
          console.log('ray : ***** issue successful so fetch issue transactions');
          // ray test touch >
          fetchIssueTransactions(dispatch, store);
          break;
        }
        case transaction.isSuccessful(events, connectionAPI.events.redeem.CancelRedeem):
        case transaction.isSuccessful(events, connectionAPI.events.redeem.ExecuteRedeem):
        case transaction.isSuccessful(events, connectionAPI.events.redeem.LiquidationRedeem):
        case transaction.isSuccessful(events, connectionAPI.events.redeem.RequestRedeem): {
          fetchRedeemTransactions(dispatch, store);
          break;
        }
        }
      } else {
        // ray test touch <
        console.log('ray : ***** NOT myAccountRecord');
        // console.log(`\nReceived ${events.length} events:`);
        // // Loop through the Vec<EventRecord>
        // events.forEach(record => {
        //   // Extract the phase, event and the event types
        //   const { event, phase } = record;
        //   const types = event.typeDef;
        //   // Show what we are busy with
        //   console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
        //   console.log(`\t\t${event.meta.documentation.toString()}`);
        //   // Loop through each of the parameters, displaying the type and data
        //   event.data.forEach((data, index) => {
        //     console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
        //   });
        // });
        // ray test touch >
      }
    });
  }, [
    dispatch,
    store,
    polkaBtcLoaded
  ]);
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
