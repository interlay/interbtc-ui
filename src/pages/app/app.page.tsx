
import React, { ReactElement } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';

import IssueSteps from './issue/issue-steps';
import IssueRequests from './issue/issue-requests';
import RedeemSteps from './redeem/redeem-steps';
import RedeemRequests from './redeem/redeem-requests';
import Transfer from './transfer/transfer';
import { setActiveTabAction } from 'common/actions/general.actions';
import {
  ActiveTab,
  StoreType
} from 'common/types/util.types';
import './app.page.scss';

function AppPage(): ReactElement {
  const dispatch = useDispatch();
  // TODO: should avoid getting the store bloated
  const { activeTab } = useSelector((state: StoreType) => state.general);
  const issueStep = useSelector((state: StoreType) => state.issue.step);
  const premiumRedeem = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const { t } = useTranslation();

  const handleTabChange = (tab: ActiveTab) => () => {
    dispatch(setActiveTabAction(tab));
  };

  const handleTabsHide = () => {
    return issueStep !== 'ENTER_BTC_AMOUNT' && activeTab === ActiveTab.Issue;
  };

  return (
    <section className='main-container text-center white-background min-vh-100 app-page'>
      <div className='container mt-5'>
        <div className='row justify-content-center'>
          <div
            // TODO: should use `clsx`
            className={
              'col-xl-6 col-lg-6 col-md-8 col-sm-12 col-xs-12 tab-content-wrapper' +
              (premiumRedeem ? ' pink-gradient' : '')
            }>
            {handleTabsHide() ? (
              <div className='step-title'>
                {activeTab === ActiveTab.Issue && (
                  <div className='issue-step-title'>{t('issue_page.deposit')}</div>
                )}
              </div>
            ) : (
              <>
                <div
                  id='main-tabs'
                  className='row app-tabs'>
                  <div
                    className='col-4 app-tab'
                    onClick={handleTabChange(ActiveTab.Issue)}>
                    <div
                      className={
                        activeTab === ActiveTab.Issue ?
                          ' active-tab active-tab-issue ' :
                          ' not-active'
                      }>
                      {t('issue')}
                    </div>
                  </div>
                  <div
                    className='col-4 app-tab'
                    onClick={handleTabChange(ActiveTab.Redeem)}>
                    <div
                      className={
                        activeTab === ActiveTab.Redeem ?
                          ' active-tab active-tab-redeem' :
                          ' not-active'
                      }>
                      {t('redeem')}
                    </div>
                  </div>
                  <div
                    className='col-4 app-tab'
                    onClick={handleTabChange(ActiveTab.Transfer)}>
                    <div
                      className={
                        activeTab === ActiveTab.Transfer ?
                          ' active-tab active-tab-transfer' :
                          ' not-active'
                      }>
                      {t('transfer')}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    activeTab === ActiveTab.Redeem ?
                      'horizontal-line line-yellow' :
                      activeTab === ActiveTab.Transfer ?
                        'horizontal-line line-blue' :
                        'horizontal-line'
                  }>
                </div>
              </>
            )}
            <div className='content'>
              {activeTab === ActiveTab.Issue && <IssueSteps />}
              {activeTab === ActiveTab.Redeem && <RedeemSteps />}
              {activeTab === ActiveTab.Transfer && <Transfer />}
            </div>
          </div>
        </div>
      </div>
      {activeTab === ActiveTab.Issue && <IssueRequests />}
      {activeTab === ActiveTab.Redeem && <RedeemRequests />}
    </section>
  );
}

export default AppPage;
