import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import PriceInfo from 'pages/Bridge/PriceInfo';
import Hr2 from 'components/hrs/Hr2';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  copyToClipboard,
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const WhoopsStatusUI = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);

  if (!request.backingPayment?.amount) {
    throw new Error('Something went wrong!');
  }
  if (!request.execution?.amountWrapped) {
    throw new Error('Something went wrong!');
  }

  return (
    <RequestWrapper className='px-12'>
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
            { 'text-interlayTextSecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'text-sm'
          )}>
          {t('issue_page.refund_sent_more_btc')}
        </p>
      </div>
      <PriceInfo
        className='w-full'
        title={
          <h5
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            {t('issue_page.refund_requested')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={displayMonetaryAmount(request.request.amountWrapped)}
        unitName={WRAPPED_TOKEN_SYMBOL}
        approxUSD={getUsdAmount(request.request.amountWrapped, prices.bitcoin.usd)} />
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
        value={displayMonetaryAmount(request.backingPayment.amount)}
        unitName='BTC'
        approxUSD={getUsdAmount(request.backingPayment.amount, prices.bitcoin.usd)} />
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
        value={displayMonetaryAmount(request.execution.amountWrapped)}
        unitName={WRAPPED_TOKEN_SYMBOL}
        approxUSD={
          getUsdAmount(request.execution.amountWrapped, prices.bitcoin.usd)
        } />
      <Hr2
        className={clsx(
          'border-t-2',
          'my-2.5',
          'w-full'
        )} />
      <PriceInfo
        className='w-full'
        title={
          <h5
            className={clsx(
              { 'text-interlayTextPrimaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            {t('issue_page.refund_difference')}
          </h5>
        }
        unitIcon={
          <BitcoinLogoIcon
            width={23}
            height={23} />
        }
        value={displayMonetaryAmount(request.backingPayment.amountWrapped.sub(request.execution.amountWrapped))}
        unitName='BTC'
        approxUSD={
          getUsdAmount(
            request.backingPayment.amountWrapped.sub(request.execution.amountWrapped),
            prices.bitcoin.usd
          )
        } />
      <p
        className={clsx(
          { 'text-interlayTextSecondaryInLightMode':
            process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {t('issue_page.refund_requested_vault')}
        &nbsp;{t('issue_page.refund_vault_to_return')}
        <span className='text-interlayCinnabar'>
          &nbsp;{displayMonetaryAmount(request.refund.amountPaid)}
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
          {request.refund.btcAddress}
        </span>
      </InterlayTooltip>
    </RequestWrapper>
  );
};

export default WhoopsStatusUI;
