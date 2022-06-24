import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IssueStatus } from '@interlay/interbtc-api';

import BTCPaymentPendingStatusUI from './BTCPaymentPendingStatusUI';
import IssueRequestStatusUI from './IssueRequestStatusUI';
import WhoopsStatusUI from './WhoopsStatusUI';
import PriceInfo from 'components/PriceInfo';
import Hr2 from 'components/hrs/Hr2';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { WrappedTokenAmount } from 'config/relay-chains';
import { getColorShade } from 'utils/helpers/colors';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { displayMonetaryAmount, getUsdAmount, shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

// TODO: should type properly (`Relay`)
const renderModalStatusPanel = (request: any) => {
  switch (request.status) {
    case IssueStatus.PendingWithBtcTxNotFound: {
      return <BTCPaymentPendingStatusUI request={request} />;
    }
    case IssueStatus.RequestedRefund: {
      return <WhoopsStatusUI request={request} />;
    }
    default: {
      return <IssueRequestStatusUI request={request} />;
    }
  }
};

interface Props {
  issue: any; // TODO: should type properly (`Relay`)
}

const IssueUI = ({ issue }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { address, prices } = useSelector((state: StoreType) => state.general);

  const receivedWrappedTokenAmount: WrappedTokenAmount = issue.execution
    ? issue.execution.amountWrapped
    : issue.request.amountWrapped;
  const bridgeFee: WrappedTokenAmount = issue.execution
    ? issue.execution.bridgeFeeWrapped
    : issue.request.bridgeFeeWrapped;
  const sentBackingTokenAmount = receivedWrappedTokenAmount.add(bridgeFee);

  return (
    <div className={clsx('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-10')}>
      <div className='space-y-6'>
        <div className='text-center'>
          {/* TODO: could componentize */}
          <h4 className={clsx('space-x-1', 'text-xl')}>
            <span>{t('receive')}</span>
            <span
              className={clsx(
                { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {displayMonetaryAmount(receivedWrappedTokenAmount)}
            </span>
            <span>{WRAPPED_TOKEN_SYMBOL}</span>
          </h4>
          <span
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
              'block'
            )}
          >
            {`≈ $ ${getUsdAmount(receivedWrappedTokenAmount, prices.bitcoin?.usd)}`}
          </span>
        </div>
        <div>
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('bridge_fee')}
              </h5>
            }
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={displayMonetaryAmount(bridgeFee)}
            unitName='BTC'
            approxUSD={getUsdAmount(bridgeFee, prices.bitcoin?.usd)}
          />
          <Hr2 className={clsx('border-t-2', 'my-2.5')} />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('total_deposit')}
              </h5>
            }
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={displayMonetaryAmount(sentBackingTokenAmount)}
            unitName='BTC'
            approxUSD={getUsdAmount(sentBackingTokenAmount, prices.bitcoin?.usd)}
          />
        </div>
        <div className='space-y-4'>
          {/* TODO: could componentize */}
          <div className={clsx('flex', 'justify-between')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.destination_address')}
            </span>
            <span className='font-medium'>{shortAddress(address)}</span>
          </div>
          <div className={clsx('flex', 'justify-between')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.parachain_block')}
            </span>
            <span className='font-medium'>{issue.request.height.active}</span>
          </div>
          <div className={clsx('flex', 'justify-between')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.vault_dot_address')}
            </span>
            <span className='font-medium'>{shortAddress(issue.vault.accountId)}</span>
          </div>
          <div className={clsx('flex', 'justify-between')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.vault_btc_address')}
            </span>
            <span className='font-medium'>{shortAddress(issue.vaultBackingAddress)}</span>
          </div>
        </div>
        <p className='space-x-1'>
          <span className={getColorShade('red')}>{t('note')}:</span>
          <span
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            {t('issue_page.fully_decentralized', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </span>
        </p>
      </div>
      <>{renderModalStatusPanel(issue)}</>
    </div>
  );
};

export default IssueUI;
