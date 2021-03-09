
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import IssueSteps from './issue/issue-steps';
import IssueRequests from './issue/issue-requests';
import RedeemSteps from './redeem/redeem-steps';
import RedeemRequests from './redeem/redeem-requests';
import Transfer from './transfer/transfer';
import Tabs, { Tab, HorizontalLine } from './Tabs';
import { StoreType } from 'common/types/util.types';
import { TabTypes } from 'utils/enums/tab-types';
import './app.page.scss';

function Application(): ReactElement {
  // TODO: should avoid getting the store bloated
  const { selectedTabType } = useSelector((state: StoreType) => state.general);
  const issueStep = useSelector((state: StoreType) => state.issue.step);
  const premiumRedeem = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const { t } = useTranslation();

  const tabsHidden = issueStep !== 'ENTER_BTC_AMOUNT' && selectedTabType === TabTypes.Issue;

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
      </div>
      {selectedTabType === TabTypes.Issue && <IssueRequests />}
      {selectedTabType === TabTypes.Redeem && <RedeemRequests />}
    </section>
  );
}

export default Application;
