
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';

import Tooltip from 'components/Tooltip';
import Timer from 'components/Timer';
import { IssueRequest } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import {
  copyToClipboard,
  displayBtcAmount,
  getUsdAmount
} from 'common/utils/utils';

interface Props {
  request: IssueRequest;
}

const PaymentView = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);
  const { issuePeriod } = useSelector((state: StoreType) => state.issue);
  const amount = new Big(request.requestedAmountPolkaBTC).add(new Big(request.fee)).toString();
  const [initialLeftSeconds, setInitialLeftSeconds] = React.useState<number>();

  React.useEffect(() => {
    if (!request.timestamp) return;

    const requestTimestamp = Math.floor(new Date(request.timestamp).getTime() / 1000);
    const theInitialLeftSeconds = requestTimestamp + issuePeriod - Math.floor(Date.now() / 1000);
    setInitialLeftSeconds(theInitialLeftSeconds);
  }, [
    request.timestamp,
    issuePeriod
  ]);

  return (
    <div className='space-y-8'>
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
          <span className='text-interlayTreePoppy'>&nbsp;{request.amountBTC}&nbsp;</span>
          BTC
        </div>
        <span
          className={clsx(
            'text-textSecondary',
            'block'
          )}>
          {`≈ $ ${getUsdAmount(request.amountBTC, prices.bitcoin.usd)}`}
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
          <span className='text-textSecondary'>{t('issue_page.within')}</span>
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
        <span className='text-interlayTreePoppy'>
          {displayBtcAmount(request.amountBTC)}&nbsp;mBTC
        </span>
      </p>
      <QRCode
        className='mx-auto'
        value={`bitcoin:${request.vaultBTCAddress}?amount=${amount}`} />
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

export default PaymentView;
