import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import RequestWrapper from 'pages/Home/RequestWrapper';
import PriceInfo from 'pages/Home/PriceInfo';
import Tooltip from 'components/Tooltip';
import {
  copyToClipboard,
  getUsdAmount,
  safeRoundEightDecimals
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { Issue } from '@interlay/interbtc';
import { BTCAmount } from '@interlay/monetary-js';

interface Props {
  request: Issue;
}

const WhoopsStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);

  return (
    <RequestWrapper
      id='WhoopsStatusUI'
      className='px-12'>
      <div className='text-center'>
        <h2
          className={clsx(
            'text-lg',
            'font-medium'
          )}>
          {t('issue_page.refund_whoops')}
        </h2>
        <p
          className={clsx(
            'text-textSecondary',
            'text-sm'
          )}>
          {t('issue_page.refund_sent_more_btc')}
        </p>
      </div>
      <PriceInfo
        className='w-full'
        title={
          <h5 className='text-textSecondary'>
            {t('issue_page.refund_requested')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={request.amountInterBTC}
        unitName='InterBTC'
        approxUSD={getUsdAmount(BTCAmount.from.BTC(request.amountInterBTC), prices.bitcoin.usd)} />
      <PriceInfo
        className='w-full'
        title={
          <h5 className='text-interlayCalifornia'>
            {t('issue_page.refund_deposited')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={safeRoundEightDecimals(Number(request.btcAmountSubmittedByUser))}
        unitName='BTC'
        approxUSD={getUsdAmount(BTCAmount.from.BTC(request.btcAmountSubmittedByUser || '0'), prices.bitcoin.usd)} />
      <PriceInfo
        className='w-full'
        title={
          <h5 className='text-interlayConifer'>
            {t('issue_page.refund_issued')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={request.executedAmountBTC || request.amountInterBTC}
        unitName='InterBTC'
        approxUSD={
          getUsdAmount(BTCAmount.from.BTC(request.executedAmountBTC || request.amountInterBTC), prices.bitcoin.usd)
        } />
      <hr
        className={clsx(
          'border-t-2',
          'my-2.5',
          'border-textSecondary',
          'w-full'
        )} />
      <PriceInfo
        className='w-full'
        title={
          <h5 className='text-textPrimary'>
            {t('issue_page.refund_difference')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={safeRoundEightDecimals(
          Number(request.btcAmountSubmittedByUser) - Number(request.executedAmountBTC)
        )}
        unitName='BTC'
        approxUSD={
          getUsdAmount(
            BTCAmount.from.BTC((Number(request.btcAmountSubmittedByUser) - Number(request.executedAmountBTC))),
            prices.bitcoin.usd
          )
        } />
      <p className='text-textSecondary'>
        {t('issue_page.refund_requested_vault')}
        &nbsp;{t('issue_page.refund_vault_to_return')}
        <span className='text-interlayCinnabar'>
          &nbsp;{safeRoundEightDecimals(request.refundAmountBTC)}
        </span>
        &nbsp;BTC&nbsp;
        {t('issue_page.refund_vault_to_address')}.
      </p>
      <Tooltip overlay={t('click_to_copy')}>
        <span
          className={clsx(
            'block',
            'p-2.5',
            'border-2',
            'font-medium',
            'rounded-lg',
            'cursor-pointer',
            'text-center',
            'w-full'
          )}
          onClick={() => copyToClipboard('1')}>
          {request.refundBtcAddress}
        </span>
      </Tooltip>
    </RequestWrapper>
  );
};

export default WhoopsStatusUI;
