import { useState } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { FaCheck, FaHourglass } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import IssueModal from './modal/issue-modal';
import BitcoinTransaction from 'common/components/bitcoin-links/transaction';
import { StoreType } from 'common/types/util.types';
import { formatDateTimePrecise } from 'common/utils/utils';
import { changeIssueIdAction } from 'common/actions/issue.actions';
import { showAccountModalAction } from 'common/actions/general.actions';
import { Issue, IssueStatus } from '@interlay/polkabtc';

function IssueRequests(): JSX.Element {
  const { address, extensions, bitcoinHeight } = useSelector((state: StoreType) => state.general);
  const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleIssueModalClose = () => {
    setIssueModalOpen(false);
  };

  const openWizard = () => {
    if (extensions.length && address) {
      setIssueModalOpen(true);
    } else {
      dispatch(showAccountModalAction(true));
    }
  };

  const handleCompleted = (status: IssueStatus) => {
    switch (status) {
    case IssueStatus.RequestedRefund:
    case IssueStatus.Completed: {
      return <FaCheck className='inline-block' />;
    }
    case IssueStatus.Cancelled:
    case IssueStatus.Expired: {
      return (
        <Badge
          className='badge-style'
          variant='secondary'>
          {t('cancelled')}
        </Badge>
      );
    }
    default: {
      return <FaHourglass className='inline-block' />;
    }
    }
  };

  const requestClicked = (request: Issue): void => {
    dispatch(changeIssueIdAction(request.id));
    openWizard();
  };

  return (
    <div
      className={clsx(
        'container',
        'mt-12',
        'mx-auto',
        'text-center'
      )}>
      {issueRequests?.length > 0 && (
        <>
          <h5
            className={clsx(
              'font-bold',
              'text-xl',
              'mb-2'
            )}>
            {t('issue_requests')}
          </h5>
          <p className='mb-4'>
            {t('issue_page.click_on_issue_request')}
          </p>
          <Table
            hover
            responsive
            size='md'>
            <thead>
              <tr>
                <th>{t('issue_page.updated')}</th>
                <th>{t('issue_page.amount')}</th>
                <th>{t('issue_page.btc_transaction')}</th>
                <th>{t('issue_page.confirmations')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {issueRequests.map((request: Issue, index: number) => {
                const confirmations = (() => {
                  if (request.btcTxId === '') return t('not_applicable');
                  if (request.confirmations !== undefined) return request.confirmations;
                  if (request.btcBlockHeight !== undefined) return bitcoinHeight - request.btcBlockHeight;
                  return 0;
                })();
                return (
                  <tr
                    key={index}
                    onClick={() => requestClicked(request)}
                    className='table-row-opens-modal'>
                    <td>
                      {request.creationTimestamp ?
                        formatDateTimePrecise(new Date(request.creationTimestamp)) :
                        t('pending')}
                    </td>
                    <td>
                      {request.amountBTC}{' '}
                      <span className='grey-text'>PolkaBTC</span>
                    </td>
                    <td>
                      <BitcoinTransaction
                        txId={request.btcTxId}
                        shorten />
                    </td>
                    <td>
                      {confirmations}
                    </td>
                    <td>{handleCompleted(request.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <IssueModal
            open={issueModalOpen}
            onClose={handleIssueModalClose} />
        </>
      )}
    </div>
  );
}

export default IssueRequests;
