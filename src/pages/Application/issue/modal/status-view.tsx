import React, { ReactElement, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IssueRequest, IssueRequestStatus } from '../../../../common/types/issue.types';
import BitcoinTransaction from '../../../../common/components/bitcoin-links/transaction';
import ButtonMaybePending from '../../../../common/components/pending-button';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from '../../../../common/types/util.types';
import { toast } from 'react-toastify';
import { updateIssueRequestAction } from '../../../../common/actions/issue.actions';
import { updateBalancePolkaBTCAction } from '../../../../common/actions/general.actions';
import { shortAddress } from '../../../../common/utils/utils';
import Big from 'big.js';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_TRANSACTION_API } from 'config/bitcoin';

type StatusViewProps = {
  request: IssueRequest;
};

export default function StatusView(props: StatusViewProps): ReactElement {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { polkaBtcLoaded, balancePolkaBTC } = useSelector((state: StoreType) => state.general);
  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = useState(1);
  const [stableParachainConfirmations, setStableParachainConfirmations] = useState(100);
  const [requestConfirmations, setRequestConfirmations] = useState(0);
  const [executePending, setExecutePending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [btcConf, paraConf, paraHeight] = await Promise.all([
        await window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
        await window.polkaBTC.btcRelay.getStableParachainConfirmations(),
        await window.polkaBTC.system.getCurrentActiveBlockNumber()
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
      await window.polkaBTC.issue.execute(request.id, request.btcTxId);

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
      return (
        <>
          <div className='completed-status-title'>{t('completed')}</div>
          <div className='row'>
            <div className='col text-center bold-text '>
              {t('issue_page.you_received')}{' '}
              <span className='pink-amount bold-text'>
                {props.request.issuedAmountBtc || props.request.requestedAmountPolkaBTC} PolkaBTC
              </span>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='col'>
              <div className='completed-confirmations-circle'>
                <div>{t('issue_page.in_parachain_block')}</div>
                <div className='number-of-confirmations '>{props.request.creation}</div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col text-center mt-4'>
              <InterlayLink
                href='https://polkadot.js.org/apps/#/explorer'
                target='_blank'
                rel='noopener noreferrer'>
                <button className='modal-btn-green'>{t('issue_page.view_parachain_block')}</button>
              </InterlayLink>
            </div>
          </div>

          <div className='row btc-transaction-wrapper'>
            <div className='col'>
              <div className='btc-transaction-title'>{t('issue_page.btc_transaction')}</div>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <div className='btc-transaction-id'>{shortAddress(props.request.btcTxId)}</div>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <div className='btc-transaction'>
                <InterlayLink
                  href={BTC_TRANSACTION_API + props.request.btcTxId}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <button className='modal-btn-green'>
                    {t('issue_page.view_on_block_explorer')}
                  </button>
                </InterlayLink>
              </div>
            </div>
          </div>
        </>
      );
    case IssueRequestStatus.Cancelled:
    case IssueRequestStatus.Expired:
      return (
        <>
          <div className='cancel-status-title'>{t('cancelled')}</div>
          <div className='row'>
            <div className='col text-center'>
              <i className='fas fa-times-circle canceled-circle'></i>
            </div>
          </div>
          <div className='row justify-center mt-4'>
            <div className='col-9 status-description'>{t('issue_page.you_did_not_send')}</div>
          </div>
          <div className='row justify-center mt-5'>
            <div className='col-9 note-title'>
              {t('note')}&nbsp;
              <i className='fas fa-exclamation-circle'></i>
            </div>
          </div>
          <div className='row justify-center'>
            <div className='col-9 note-text'>{t('issue_page.contact_team')}</div>
          </div>
        </>
      );
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
}
