import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IssueRequest } from '../../../../common/types/issue.types';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../../common/types/util.types';
import QRCode from 'qrcode.react';
import Big from 'big.js';
import Timer from '../../../../common/components/timer';
import InterlayTooltip from 'components/InterlayTooltip';
import { copyToClipboard, getUsdAmount } from '../../../../common/utils/utils';

type PaymentViewProps = {
  request: IssueRequest;
};

export default function PaymentView(props: PaymentViewProps): ReactElement {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);
  const { issuePeriod } = useSelector((state: StoreType) => state.issue);
  const amount = new Big(props.request.requestedAmountPolkaBTC).add(new Big(props.request.fee)).toString();
  const [leftSeconds, setLeftSeconds] = useState(-1);

  useEffect(() => {
    if (!props.request.timestamp) return;

    try {
      // seconds left = request.timestamp + issue period - current time
      const unixTimestamp = Math.floor(new Date(props.request.timestamp).getTime() / 1000);
      const secondsLeft = unixTimestamp + issuePeriod - Math.floor(Date.now() / 1000);
      setLeftSeconds(secondsLeft);
    } catch (error) {
      console.log('[PaymentView] error.message => ', error.message);
    }
  }, [
    props.request.timestamp,
    issuePeriod
  ]);

  return (
    <div className='payment-view'>
      <div className='payment-title'>
        <div className='row'>
          <div className='col mt-5'>
            {t('send')} &nbsp; <span className='send-amount'>{props.request.totalAmount} &nbsp;BTC</span>
          </div>
        </div>
        <div className='row'>
          <div className='col send-price'>
            {'~ $' + getUsdAmount(props.request.totalAmount, prices.bitcoin.usd)}
          </div>
        </div>
        <div className='row'>
          <div className='col payment-description'>{t('issue_page.single_transaction')}</div>
        </div>
        <div className='row '>
          <div className='col payment-address'>
            <InterlayTooltip overlay={t('click_to_copy')}>
              <span
                className='copy-address'
                onClick={() => copyToClipboard(props.request.vaultBTCAddress)}>
                {props.request.vaultBTCAddress}
              </span>
            </InterlayTooltip>
          </div>
        </div>
        <div className='row payment-timer-with'>
          <div className='col'>{t('issue_page.within')}</div>
        </div>
        <div className='row payment-timer'>
          <div className='col'>{leftSeconds !== -1 && <Timer seconds={leftSeconds}></Timer>}</div>
        </div>
        <div className='row mt-2 justify-content-center'>
          <div className='col note-text'>
            {t('issue_page.warning_mbtc_wallets')}
            <span className='send-amount'> {
              new Big(props.request.totalAmount).mul(1000).round(5).toString()
            }&nbsp;mBTC
            </span>
          </div>
        </div>
        <div className='row'>
          <div className='col qr-code-item'>
            <QRCode value={'bitcoin:' + props.request.vaultBTCAddress + '?amount=' + amount} />
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-9 note-title'>
            {t('note')}&nbsp;
            <i className='fas fa-exclamation-circle'></i>
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-9 note-text'>{t('issue_page.waiting_deposit')}</div>
        </div>
      </div>
    </div>
  );
}
