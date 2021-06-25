
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';
import Timer from 'components/Timer';
import BitcoinTransaction from 'common/components/bitcoin-links/transaction';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { BLOCK_TIME } from 'config/parachain';
import {
  getUsdAmount,
  shortAddress
} from 'common/utils/utils';
import {
  RedeemRequest,
  RedeemRequestStatus
} from 'common/types/redeem.types';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

interface Props {
  request: RedeemRequest;
}

const RedeemRequestStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    polkaBtcLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);
  const [punishmentDOTAmount, setPunishmentDOTAmount] = React.useState(new Big(0));
  const [burnDOTAmount, setBurnDOTAmount] = React.useState(new Big(0));
  const [dotAmount, setDOTAmount] = React.useState(new Big(0));
  const [initialLeftSeconds, setInitialLeftSeconds] = React.useState<number>();

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        const [
          punishmentFee,
          btcDotRate,
          theStableBitcoinConfirmations,
          redeemPeriod
        ] = await Promise.all([
          window.polkaBTC.vaults.getPunishmentFee(),
          window.polkaBTC.oracle.getExchangeRate(),
          window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
          window.polkaBTC.redeem.getRedeemPeriod()
        ]);

        const polkaBTCAmount = request ? new Big(request.amountPolkaBTC) : new Big(0);
        const theBurnDOTAmount = polkaBTCAmount.mul(btcDotRate);
        const thePunishmentDOTAmount = theBurnDOTAmount.mul(new Big(punishmentFee));
        const theDOTAmount = theBurnDOTAmount.add(thePunishmentDOTAmount);
        setBurnDOTAmount(theBurnDOTAmount);
        setPunishmentDOTAmount(thePunishmentDOTAmount);
        setDOTAmount(theDOTAmount);
        setStableBitcoinConfirmations(theStableBitcoinConfirmations);

        const requestTimestamp = Math.floor(new Date(Number(request.timestamp)).getTime() / 1000);
        const theInitialLeftSeconds = requestTimestamp + (redeemPeriod * BLOCK_TIME) - Math.floor(Date.now() / 1000);
        setInitialLeftSeconds(theInitialLeftSeconds);
      } catch (error) {
        console.log('[RedeemRequestStatusUI useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    polkaBtcLoaded
  ]);

  function getStatus(status: RedeemRequestStatus): React.ReactFragment {
    switch (status) {
    case RedeemRequestStatus.Completed:
      return (
        <>
          <div className='completed-status-title'>{t('completed')}</div>
          <div className='row'>
            <div className='col text-center font-bold '>
              {t('issue_page.you_received')}{' '}
              <span className='orange-amount font-bold'>{request.amountPolkaBTC + ' BTC'}</span>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='col'>
              <div className='completed-confirmations-circle'>
                <div>{t('issue_page.in_parachain_block')}</div>
                <div className='number-of-confirmations'>{request.creation}</div>
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
              <div className='btc-transaction-id'>{shortAddress(request.btcTxId)}</div>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <div className='btc-transaction'>
                <InterlayLink
                  href={BTC_TRANSACTION_API + request.btcTxId}
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
    case RedeemRequestStatus.PendingWithBtcTxNotFound:
      return (
        <React.Fragment>
          <div className='status-title'>{t('pending')}</div>
          <p
            className={clsx(
              'flex',
              'justify-center',
              'items-center',
              'space-x-1'
            )}>
            <span className='text-textSecondary'>
              {t('redeem_page.vault_has_time_to_complete')}
            </span>
            {initialLeftSeconds && <Timer initialLeftSeconds={initialLeftSeconds} />}
          </p>
          <div className='row mt-5'>
            <div className='col'>
              <div className='pending-circle'>
                <div>{t('redeem_page.waiting_for')}</div>
                <div>{t('nav_vault')}</div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    case RedeemRequestStatus.Reimbursed:
      return (
        <React.Fragment>
          <div className='completed-status-title'>{t('redeem_page.burn_success')}</div>
          <div className='row'>
            <div className='col text-center'>{t('redeem_page.burn_notice')}</div>
          </div>
          <div className='row mt-5'>
            <div className='col text-center font-bold '>
              <span className='orange-amount font-bold'>
                {request.amountPolkaBTC + ' PolkaBTC '}
              </span>
                                (~ ${getUsdAmount(request.amountPolkaBTC, prices.bitcoin.usd)})
              <span className='orange-amount font-bold'>{t('redeem_page.burned')}</span>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col text-center font-bold '>
              <span className='pink-amount font-bold'>
                {t('redeem_page.recover_receive_dot') + dotAmount.toString() + ' DOT '}
              </span>
                                (~ ${getUsdAmount(dotAmount.toString(), prices.polkadot.usd)})
              <span className='pink-amount font-bold'>{t('redeem_page.recover_receive_total')}</span>
            </div>
          </div>
          <div className='p-2.5 row'>
            <div className='col-6'>{t('redeem_page.compensation_burn')}</div>
            <div className='col-6'>
              <PolkadotLogoIcon
                className='inline-block'
                width={23}
                height={23} /> &nbsp;
              {burnDOTAmount.toString()} DOT
              <div className='send-price'>
                {'~ $' + getUsdAmount(burnDOTAmount.toString(), prices.polkadot.usd)}
              </div>
            </div>
          </div>
          <div className='p-2.5 row'>
            <div className='col-6'>{t('redeem_page.compensation_payment')}</div>
            <div className='col-6'>
              <PolkadotLogoIcon
                className='inline-block'
                width={23}
                height={23} /> &nbsp;
              {punishmentDOTAmount.toString()} DOT
              <div className='send-price'>
                {'~ $' + getUsdAmount(punishmentDOTAmount.toString(), prices.polkadot.usd)}
              </div>
            </div>
          </div>
          <hr className='total-divider' />
          <div className='p-2.5 row'>
            <div className='col-6 font-medium text-green'>{t('you_received')}</div>
            <div className='col-6 font-medium'>
              <PolkadotLogoIcon
                className='inline-block'
                width={23}
                height={23} />
              &nbsp;
              {dotAmount.toString()} DOT
              <div className='send-price'>
                {'~ $' + getUsdAmount(dotAmount.toString(), prices.polkadot.usd)}
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col text-center mt-4'>
              <InterlayLink
                href='https://polkadot.js.org/apps/#/explorer'
                target='_blank'
                rel='noopener noreferrer'>
                <button className='modal-btn-green'>{t('issue_page.view_parachain_block')}</button>
              </InterlayLink>
            </div>
          </div>
        </React.Fragment>
      );
    case RedeemRequestStatus.Retried:
      return (
        <React.Fragment>
          <div className='completed-status-title'>{t('redeem_page.compensation_success')}</div>
          <div className='row'>
            <div className='col text-center'>{t('redeem_page.compensation_notice')}</div>
          </div>
          <div className='row mt-5'>
            <div className='col text-center font-bold '>
              <span className='pink-amount font-bold'>
                {t('redeem_page.recover_receive_dot') + punishmentDOTAmount.toString() + ' DOT '}
              </span>
                                (~ ${getUsdAmount(punishmentDOTAmount.toString(), prices.polkadot.usd)})
              <span className='pink-amount font-bold'>{t('redeem_page.recover_receive_total')}</span>
            </div>
          </div>
          <div className='p-2.5 row'>
            <div className='col-6'>{t('redeem_page.compensation_payment')}</div>
            <div className='col-6'>
              <PolkadotLogoIcon
                className='inline-block'
                width={23}
                height={23} /> &nbsp;
              {punishmentDOTAmount.toString()} DOT
              <div className='send-price'>
                {'~ $' + getUsdAmount(punishmentDOTAmount.toString(), prices.polkadot.usd)}
              </div>
            </div>
          </div>
          <hr className='total-divider' />
          <div className='p-2.5 row'>
            <div className='col-6 font-medium text-green'>{t('you_received')}</div>
            <div className='col-6 font-medium'>
              <PolkadotLogoIcon
                className='inline-block'
                width={23}
                height={23} />
              &nbsp;
              {punishmentDOTAmount.toString()} DOT
              <div className='send-price'>
                {'~ $' + getUsdAmount(punishmentDOTAmount.toString(), prices.polkadot.usd)}
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
          <div className='row justify-center'>
            <div className='col-9 note-title'>
              {t('note')}&nbsp;
              <i className='fas fa-exclamation-circle'></i>
            </div>
          </div>
          <div className='row justify-center'>
            <div className='col-9 note-text'>{t('redeem_page.retry_new_redeem')}</div>
          </div>
        </React.Fragment>
      );
    default:
      return (
        <React.Fragment>
          <div className='status-title'>{t('received')}</div>
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
        </React.Fragment>
      );
    }
  }

  return <div className='status-view'>{getStatus(request.status)}</div>;
};

export default RedeemRequestStatusUI;
