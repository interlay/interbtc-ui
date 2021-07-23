import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';

import Tooltip from 'components/Tooltip';
import Timer from 'components/Timer';
import { Issue } from '@interlay/interbtc';
import { StoreType } from 'common/types/util.types';
import {
  copyToClipboard,
  displayBtcAmount,
  getUsdAmount
} from 'common/utils/utils';

interface Props {
  request: Issue;
}

const BTCPaymentPendingStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);
  const { issuePeriod } = useSelector((state: StoreType) => state.issue);
  const amountBTCToSend = new Big(request.amountInterBTC).add(request.bridgeFee).toString();
  const [initialLeftSeconds, setInitialLeftSeconds] = React.useState<number>();

  React.useEffect(() => {
    if (!request.creationTimestamp) return;

    const requestTimestamp = Math.floor(new Date(Number(request.creationTimestamp)).getTime() / 1000);
    const theInitialLeftSeconds = requestTimestamp + issuePeriod - Math.floor(Date.now() / 1000);
    setInitialLeftSeconds(theInitialLeftSeconds);
  }, [
    request.creationTimestamp,
    issuePeriod
  ]);

  return (
    <div
      id='BTCPaymentPendingStatusUI'
      className='space-y-8'>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'justify-center',
          'items-center'
        )}>
        <div
          className='text-xl'>
          {t('send')}
          <span className='text-interlayCalifornia'>&nbsp;{amountBTCToSend}&nbsp;</span>
          BTC
        </div>
        <span
          className={clsx(
            'text-textSecondary',
            'block'
          )}>
          {`≈ $ ${getUsdAmount(amountBTCToSend, prices.bitcoin.usd)}`}
        </span>
      </div>
      <div>
        <p
          className={clsx(
            'text-center',
            'text-textSecondary'
          )}>
          {t('issue_page.single_transaction')}
        </p>
        {/* TODO: should improve the UX */}
        <Tooltip overlay={t('click_to_copy')}>
          <span
            className={clsx(
              'block',
              'p-2.5',
              'border-2',
              'font-medium',
              'rounded-lg',
              'cursor-pointer',
              'text-center'
            )}
            onClick={() => copyToClipboard(request.vaultBTCAddress)}>
            {request.vaultBTCAddress}
          </span>
        </Tooltip>
        <p
          className={clsx(
            'flex',
            'justify-center',
            'items-center',
            'space-x-1'
          )}>
          <span
            className={clsx(
              'text-textSecondary',
              'capitalize'
            )}>
            {t('issue_page.within')}
          </span>
          {initialLeftSeconds && <Timer initialLeftSeconds={initialLeftSeconds} />}
        </p>
      </div>
      <p className='space-x-1'>
        <span
          className={clsx(
            'text-textSecondary',
            'break-all'
          )}>
          {t('issue_page.warning_mbtc_wallets')}
        </span>
        <span className='text-interlayCalifornia'>
          {displayBtcAmount(new Big(amountBTCToSend).mul(1000).toString())}&nbsp;mBTC
        </span>
      </p>
      <QRCode
        className='mx-auto'
        value={`bitcoin:${request.vaultBTCAddress}?amount=${amountBTCToSend}`} />
      <div
        className={clsx(
          'text-textSecondary'
        )}>
        <div
          className={clsx(
            'inline-flex',
            'items-center',
            'space-x-0.5',
            'mr-1'
          )}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
          <span>:</span>
        </div>
        <span>{t('issue_page.waiting_deposit')}</span>
      </div>
    </div>
  );
};

export default BTCPaymentPendingStatusUI;
