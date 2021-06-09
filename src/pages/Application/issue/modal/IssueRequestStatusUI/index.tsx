
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { toast } from 'react-toastify';
import Big from 'big.js';

import CompletedIssueRequest from './CompletedIssueRequest';
import CancelledIssueRequest from './CancelledIssueRequest';
import ButtonMaybePending from 'common/components/pending-button';
import InterlayLink from 'components/UI/InterlayLink';
import BitcoinTransaction from 'common/components/bitcoin-links/transaction';
import { shortAddress } from 'common/utils/utils';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import {
  IssueRequest,
  IssueRequestStatus
} from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import { updateIssueRequestAction } from 'common/actions/issue.actions';
import { updateBalancePolkaBTCAction } from 'common/actions/general.actions';

type Props = {
  request: IssueRequest;
};

const IssueRequestStatusUI = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    polkaBtcLoaded,
    balancePolkaBTC
  } = useSelector((state: StoreType) => state.general);
  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);
  const [stableParachainConfirmations, setStableParachainConfirmations] = React.useState(100);
  const [requestConfirmations, setRequestConfirmations] = React.useState(0);
  const [executePending, setExecutePending] = React.useState(false);

  // TODO: should be executed on mount event
  React.useEffect(() => {
    const fetchData = async () => {
      const [btcConf, paraConf, paraHeight] = await Promise.all([
        await window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
        await window.polkaBTC.btcRelay.getStableParachainConfirmations(),
        await window.polkaBTC.system.getCurrentBlockNumber()
      ]);
      setStableBitcoinConfirmations(btcConf);
      setStableParachainConfirmations(paraConf);
      setRequestConfirmations(paraHeight - Number(props.request.creation));
    };
    fetchData();
  });

  const execute = async (request: IssueRequest) => {
    if (!polkaBtcLoaded) return;
    setExecutePending(true);

    try {
      // Execute issue
      await window.polkaBTC.issue.execute('0x' + request.id, request.btcTxId);

      const completedReq = request;
      completedReq.status = IssueRequestStatus.Completed;

      dispatch(
        updateBalancePolkaBTCAction(
          new Big(balancePolkaBTC)
            .add(new Big(request.issuedAmountBtc || request.requestedAmountPolkaBTC))
            .toString()
        )
      );
      dispatch(updateIssueRequestAction(completedReq));

      toast.success(t('issue_page.successfully_executed', { id: request.id }));
    } catch (error) {
      toast.error(`${t('issue_page.execute_failed')}: ${error.message}`);
    } finally {
      setExecutePending(false);
    }
  };

  function getStatus(status: IssueRequestStatus) {
    // Note: the following states are handled already in issue-modal.tsx
    // IssueRequestStatus.RequestedRefund
    // IssueRequestStatus.PendingWithBtcTxNotFound
    switch (status) {
    case IssueRequestStatus.Completed:
      return <CompletedIssueRequest request={props.request} />;
    case IssueRequestStatus.Cancelled:
    case IssueRequestStatus.Expired:
      return <CancelledIssueRequest />;
    case IssueRequestStatus.PendingWithBtcTxNotIncluded:
    case IssueRequestStatus.PendingWithTooFewConfirmations:
      return (
        <>
          <div className='status-title'>
            {t('received')}
          </div>
          <div className='row'>
            <div className='col'>
              <div className='waiting-confirmations-circle'>
                <div>{t('issue_page.waiting_for')}</div>
                <div>{t('confirmations')}</div>
                <div className='number-of-confirmations'>
                  {`${props.request.confirmations}/${stableBitcoinConfirmations}`}
                </div>
                <div className='number-of-confirmations'>
                  {`${requestConfirmations}/${stableParachainConfirmations}`}
                </div>
              </div>
              <div className='row btc-transaction-wrapper'>
                <div className='col'>
                  <div className='btc-transaction-view'>
                    {t('issue_page.btc_transaction')}
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <div className='btc-transaction-view'>
                    <BitcoinTransaction
                      txId={props.request.btcTxId}
                      shorten />
                  </div>
                  <div className='row mt-3'>
                    <div className='col text-center'>
                      <InterlayLink
                        href={BTC_TRANSACTION_API + props.request.btcTxId}
                        target='_blank'
                        rel='noopener noreferrer'>
                        <button className='btn green-button'>
                          {t('issue_page.view_on_block_explorer')}
                        </button>
                      </InterlayLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    case IssueRequestStatus.PendingWithEnoughConfirmations:
      return (
        <>
          <div className='status-title'>
            {t('confirmed')}
          </div>
          <div className='row'>
            <div className='col'>
              <div className='row'>
                <div className='col text-center'>
                  <div className='fas fa-check-circle confirmed-tick'></div>
                </div>
              </div>
              <div className='row btc-transaction-wrapper'>
                <div className='col'>
                  <div className='btc-transaction-view'>
                    {t('issue_page.btc_transaction')}
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <div className='btc-transaction-view'>
                    {shortAddress(props.request.btcTxId)}
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='col text-center'>
                  <InterlayLink
                    // TODO: use the transaction wrapper for this link
                    href={BTC_TRANSACTION_API + props.request.btcTxId}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <button className='btn green-button'>
                      {t('issue_page.view_on_block_explorer')}
                    </button>
                  </InterlayLink>
                </div>
              </div>
              <div className='row mt-5 justify-center'>
                <div className='col-10'>{t('issue_page.receive_polkabtc_tokens')}</div>
              </div>
              <div className='row mt-3 justify-center'>
                <div className='col-6 text-center'>
                  <ButtonMaybePending
                    isPending={executePending}
                    className='pink-button'
                    onClick={() => execute(props.request)}>
                    {t('issue_page.claim_polkabtc')}
                  </ButtonMaybePending>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  return <div className='status-view'>{getStatus(props.request.status)}</div>;
};

export default IssueRequestStatusUI;
