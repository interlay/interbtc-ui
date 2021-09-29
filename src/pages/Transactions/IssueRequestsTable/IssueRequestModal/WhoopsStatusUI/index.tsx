import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Issue } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import PriceInfo from 'pages/Bridge/PriceInfo';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import {
  copyToClipboard,
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

interface Props {
  request: Issue;
}

const WhoopsStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);

  if (!request.btcAmountSubmittedByUser) {
    throw new Error('Something went wrong!');
  }
  if (!request.executedAmountBTC) {
    throw new Error('Something went wrong!');
  }

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
        value={displayMonetaryAmount(request.wrappedAmount)}
        unitName='interBTC'
        approxUSD={getUsdAmount(request.wrappedAmount, prices.bitcoin.usd)} />
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
        value={displayMonetaryAmount(request.btcAmountSubmittedByUser)}
        unitName='BTC'
        approxUSD={getUsdAmount(
          request.btcAmountSubmittedByUser ?
            request.btcAmountSubmittedByUser :
            BitcoinAmount.zero, prices.bitcoin.usd
        )} />
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
        value={displayMonetaryAmount(request.executedAmountBTC || request.wrappedAmount)}
        unitName='interBTC'
        approxUSD={
          getUsdAmount(request.executedAmountBTC || request.wrappedAmount, prices.bitcoin.usd)
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
        value={displayMonetaryAmount(request.btcAmountSubmittedByUser.sub(request.executedAmountBTC))}
        unitName='BTC'
        approxUSD={
          getUsdAmount(
            request.btcAmountSubmittedByUser.sub(request.executedAmountBTC),
            prices.bitcoin.usd
          )
        } />
      <p className='text-textSecondary'>
        {t('issue_page.refund_requested_vault')}
        &nbsp;{t('issue_page.refund_vault_to_return')}
        <span className='text-interlayCinnabar'>
          &nbsp;{displayMonetaryAmount(request.refundAmountBTC)}
        </span>
        &nbsp;BTC&nbsp;
        {t('issue_page.refund_vault_to_address')}.
      </p>
      <InterlayTooltip label={t('click_to_copy')}>
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
      </InterlayTooltip>
    </RequestWrapper>
  );
};

export default WhoopsStatusUI;
