
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RequestWrapper from 'pages/Application/RequestWrapper';
import CompletedRedeemRequest from './CompletedRedeemRequest';
import ReimbursedRedeemRequest from './ReimbursedRedeemRequest';
import RetriedRedeemRequest from './RetriedRedeemRequest';
import PendingWithBtcTxNotFoundRedeemRequest from './PendingWithBtcTxNotFoundRedeemRequest';
import BitcoinTransaction from 'common/components/bitcoin-links/transaction';
import {
  RedeemRequest,
  RedeemRequestStatus
} from 'common/types/redeem.types';
import { StoreType } from 'common/types/util.types';

interface Props {
  request: RedeemRequest;
}

const RedeemRequestStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        const theStableBitcoinConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();

        setStableBitcoinConfirmations(theStableBitcoinConfirmations);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[RedeemRequestStatusUI useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    polkaBtcLoaded
  ]);

  function getStatus(status: RedeemRequestStatus): JSX.Element {
    switch (status) {
    case RedeemRequestStatus.Completed:
      return <CompletedRedeemRequest request={request} />;
    case RedeemRequestStatus.PendingWithBtcTxNotFound:
      return <PendingWithBtcTxNotFoundRedeemRequest request={request} />;
    case RedeemRequestStatus.Reimbursed:
      return <ReimbursedRedeemRequest request={request} />;
    case RedeemRequestStatus.Retried:
      return <RetriedRedeemRequest request={request} />;
    default:
      return (
        <RequestWrapper>
          <h2
            className={clsx(
              'text-3xl',
              'font-medium'
            )}>
            {t('received')}
          </h2>
          <div className='row'>
            <div className='col'>
              <div className='waiting-confirmations-circle'>
                <div>{t('redeem_page.waiting_for')}</div>
                <div>{t('confirmations')}</div>
                <div className='number-of-confirmations'>
                  {request.confirmations + '/' + stableBitcoinConfirmations}
                </div>
              </div>
            </div>
          </div>
          <div className='row btc-transaction-wrapper'>
            <div className='col'>
              <div className='btc-transaction-view'>{t('issue_page.btc_transaction')}</div>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <div className='btc-transaction-view'>
                <BitcoinTransaction
                  txId={request.btcTxId}
                  shorten />
              </div>
            </div>
          </div>
        </RequestWrapper>
      );
    }
  }

  return <div className='status-view'>{getStatus(request.status)}</div>;
};

export default RedeemRequestStatusUI;
