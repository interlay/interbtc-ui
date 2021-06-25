
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';

import RequestWrapper from 'pages/Application/RequestWrapper';
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

  function getStatus(status: RedeemRequestStatus): JSX.Element {
    switch (status) {
    case RedeemRequestStatus.Completed:
      return (
        <RequestWrapper>
          {/* TODO: could componentize */}
          <h2
            className={clsx(
              'text-3xl',
              'font-medium',
              'text-interlayMalachite'
            )}>
            {t('completed')}
          </h2>
          <p
            className={clsx(
              'space-x-1',
              'font-medium'
            )}>
            <span>{t('issue_page.you_received')}</span>
            <span className='text-interlayOutrageousOrange'>
              {`${request.amountPolkaBTC} BTC`}
            </span>
            .
          </p>
          {/* TODO: could componentize */}
          <div
            className={clsx(
              'w-48',
              'h-48',
              'ring-4',
              'ring-interlayMalachite',
              'rounded-full',
              'inline-flex',
              'flex-col',
              'items-center',
              'justify-center'
            )}>
            <span className='mt-4'>
              {t('issue_page.in_parachain_block')}
            </span>
            <span
              className={clsx(
                'text-2xl',
                'text-interlayMalachite',
                'font-medium'
              )}>
              {request.creation}
            </span>
          </div>
          <InterlayLink
            className={clsx(
              'text-interlayDodgerBlue',
              'space-x-1.5',
              'inline-flex',
              'items-center',
              'text-sm'
            )}
            href='https://polkadot.js.org/apps/#/explorer'
            target='_blank'
            rel='noopener noreferrer'>
            <span>{t('issue_page.view_parachain_block')}</span>
            <FaExternalLinkAlt />
          </InterlayLink>
          {/* TODO: could componentize */}
          <p className='space-x-1'>
            <span className='text-textSecondary'>{t('issue_page.btc_transaction')}:</span>
            <span className='font-medium'>{shortAddress(request.btcTxId)}</span>
          </p>
          <InterlayLink
            className={clsx(
              'text-interlayDodgerBlue',
              'space-x-1.5',
              'inline-flex',
              'items-center',
              'text-sm'
            )}
            href={`${BTC_TRANSACTION_API}${request.btcTxId}`}
            target='_blank'
            rel='noopener noreferrer'>
            <span>{t('issue_page.view_on_block_explorer')}</span>
            <FaExternalLinkAlt />
          </InterlayLink>
        </RequestWrapper>
      );
    case RedeemRequestStatus.PendingWithBtcTxNotFound:
      return (
        <RequestWrapper>
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
        </RequestWrapper>
      );
    case RedeemRequestStatus.Reimbursed:
      return (
        <RequestWrapper>
          <h2
            className={clsx(
              'text-3xl',
              'font-medium',
              'text-interlayMalachite'
            )}>
            {t('redeem_page.burn_success')}
          </h2>
          <div className='row'>
            <div className='col text-center'>{t('redeem_page.burn_notice')}</div>
          </div>
          <p className='font-medium'>
            <span className='text-interlayOutrageousOrange'>
              {`${request.amountPolkaBTC} PolkaBTC`}
            </span>
            <span>
              &nbsp;{`(≈ $${getUsdAmount(request.amountPolkaBTC, prices.bitcoin.usd)})`}
            </span>
            <span className='text-interlayOutrageousOrange'>
              &nbsp;{t('redeem_page.burned')}
            </span>
            .
          </p>
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
          <InterlayLink
            className={clsx(
              'text-interlayDodgerBlue',
              'space-x-1.5',
              'inline-flex',
              'items-center',
              'text-sm'
            )}
            href='https://polkadot.js.org/apps/#/explorer'
            target='_blank'
            rel='noopener noreferrer'>
            <span>{t('issue_page.view_parachain_block')}</span>
            <FaExternalLinkAlt />
          </InterlayLink>
        </RequestWrapper>
      );
    case RedeemRequestStatus.Retried:
      return (
        <RequestWrapper>
          <h2
            className={clsx(
              'text-3xl',
              'font-medium',
              'text-interlayMalachite'
            )}>
            {t('redeem_page.compensation_success')}
          </h2>
          <p>{t('redeem_page.compensation_notice')}</p>
          <p className='font-medium'>
            <span className='text-interlayRose'>
              {t('redeem_page.recover_receive_dot')}
            </span>
            <span className='text-interlayRose'>
              &nbsp;{`${punishmentDOTAmount.toString()} DOT`}
            </span>
            <span>
              &nbsp;({`≈ $${getUsdAmount(punishmentDOTAmount.toString(), prices.polkadot.usd)}`})
            </span>
            <span className='text-interlayRose'>
              &nbsp;{t('redeem_page.recover_receive_total')}.
            </span>
          </p>
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
          <InterlayLink
            className={clsx(
              'text-interlayDodgerBlue',
              'space-x-1.5',
              'inline-flex',
              'items-center',
              'text-sm'
            )}
            href='https://polkadot.js.org/apps/#/explorer'
            target='_blank'
            rel='noopener noreferrer'>
            <span>{t('issue_page.view_parachain_block')}</span>
            <FaExternalLinkAlt />
          </InterlayLink>
          <div className='row justify-center'>
            <div className='col-9 note-title'>
              {t('note')}&nbsp;
              <i className='fas fa-exclamation-circle'></i>
            </div>
          </div>
          <div className='row justify-center'>
            <div className='col-9 note-text'>{t('redeem_page.retry_new_redeem')}</div>
          </div>
        </RequestWrapper>
      );
    default:
      return (
        <RequestWrapper>
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
        </RequestWrapper>
      );
    }
  }

  return <div className='status-view'>{getStatus(request.status)}</div>;
};

export default RedeemRequestStatusUI;
