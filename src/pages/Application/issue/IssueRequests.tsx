
import { useState } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { FaCheck, FaHourglass } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import IssueModal from './modal/issue-modal';
import BitcoinTransaction from 'common/components/bitcoin-links/transaction';
import { IssueRequest, IssueRequestStatus } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import { formatDateTimePrecise } from 'common/utils/utils';
import { changeIssueIdAction } from 'common/actions/issue.actions';
import { showAccountModalAction } from 'common/actions/general.actions';

function IssueRequests(): JSX.Element {
  const { address, extensions } = useSelector((state: StoreType) => state.general);
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

  const handleCompleted = (status: IssueRequestStatus) => {
    switch (status) {
    case IssueRequestStatus.RequestedRefund:
    case IssueRequestStatus.Completed: {
      return <FaCheck className='inline-block' />;
    }
    case IssueRequestStatus.Cancelled:
    case IssueRequestStatus.Expired: {
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

  const requestClicked = (request: IssueRequest): void => {
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
              {issueRequests.map((request: IssueRequest, index: number) => {
                return (
                  <tr
                    key={index}
                    onClick={() => requestClicked(request)}
                    className='table-row-opens-modal'>
                    <td>
                      {request.timestamp ?
                        formatDateTimePrecise(new Date(Number(request.timestamp))) :
                        t('pending')}
                    </td>
                    <td>
                      {request.issuedAmountBtc || request.requestedAmountInterBTC}{' '}
                      <span className='grey-text'>InterBTC</span>
                    </td>
                    <td>
                      <BitcoinTransaction
                        txId={request.btcTxId}
                        shorten />
                    </td>
                    <td>
                      {request.btcTxId === '' ?
                        t('not_applicable') :
                        Math.max(request.confirmations, 0)}
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
