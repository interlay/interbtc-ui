
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import IssueRequestWrapper from './IssueRequestWrapper';
import PriceInfo from '../../PriceInfo';
import Tooltip from 'components/Tooltip';
import {
  copyToClipboard,
  getUsdAmount,
  safeRoundEightDecimals
} from 'common/utils/utils';
import { IssueRequest } from 'common/types/issue.types';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

interface Props {
  request: IssueRequest;
}

const WhoopsStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);

  return (
    <IssueRequestWrapper
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
        value={request.requestedAmountPolkaBTC}
        unitName='PolkaBTC'
        approxUSD={getUsdAmount(request.requestedAmountPolkaBTC, prices.bitcoin.usd)} />
      <PriceInfo
        className='w-full'
        title={
          <h5 className='text-interlayTreePoppy'>
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
        approxUSD={getUsdAmount(request.btcAmountSubmittedByUser, prices.bitcoin.usd)} />
      <PriceInfo
        className='w-full'
        title={
          <h5 className='text-interlayMalachite'>
            {t('issue_page.refund_issued')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={request.issuedAmountBtc}
        unitName='PolkaBTC'
        approxUSD={getUsdAmount(request.issuedAmountBtc, prices.bitcoin.usd)} />
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
          Number(request.btcAmountSubmittedByUser) - Number(request.issuedAmountBtc)
        )}
        unitName='BTC'
        approxUSD={
          getUsdAmount(
            (Number(request.btcAmountSubmittedByUser) - Number(request.issuedAmountBtc)).toString(),
            prices.bitcoin.usd
          )
        } />
      <p className='text-textSecondary'>
        {t('issue_page.refund_requested_vault')}
        &nbsp;{t('issue_page.refund_vault_to_return')}
        <span className='text-interlayPomegranate'>
          &nbsp;{safeRoundEightDecimals(request.refundAmountBtc)}
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
    </IssueRequestWrapper>
  );
};

export default WhoopsStatusUI;
