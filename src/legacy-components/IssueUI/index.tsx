import { IssueStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { ReactComponent as BitcoinLogoIcon } from '@/assets/img/bitcoin-logo.svg';
import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { WRAPPED_TOKEN_SYMBOL, WrappedTokenAmount } from '@/config/relay-chains';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import Hr2 from '@/legacy-components/hrs/Hr2';
import PriceInfo from '@/legacy-components/PriceInfo';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import BTCPaymentPendingStatusUI from './BTCPaymentPendingStatusUI';
import IssueRequestStatusUI from './IssueRequestStatusUI';
import WhoopsStatusUI from './WhoopsStatusUI';

// TODO: should type properly (`Relay`)
const renderModalStatusPanel = (request: any, issueRequestsRefetch: () => Promise<void>) => {
  switch (request.status) {
    case IssueStatus.PendingWithBtcTxNotFound: {
      return <BTCPaymentPendingStatusUI request={request} />;
    }
    case IssueStatus.RequestedRefund: {
      return <WhoopsStatusUI request={request} />;
    }
    default: {
      return <IssueRequestStatusUI request={request} issueRequestsRefetch={issueRequestsRefetch} />;
    }
  }
};

interface Props {
  issue: any; // TODO: should type properly (`Relay`)
  issueRequestsRefetch: () => Promise<void>;
}

const IssueUI = ({ issue, issueRequestsRefetch }: Props): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const destinationAddress = issue.userParachainAddress;

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
              {receivedWrappedTokenAmount.toHuman(8)}
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
            {`≈ ${displayMonetaryAmountInUSDFormat(
              receivedWrappedTokenAmount,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}`}
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
            value={bridgeFee.toHuman(8)}
            unitName='BTC'
            approxUSD={displayMonetaryAmountInUSDFormat(
              bridgeFee,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}
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
            value={sentBackingTokenAmount.toHuman(8)}
            unitName='BTC'
            approxUSD={displayMonetaryAmountInUSDFormat(
              sentBackingTokenAmount,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}
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
            <AddressWithCopyUI address={destinationAddress} />
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
            <span className='font-medium'>{formatNumber(issue.request.height.absolute)}</span>
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
            <AddressWithCopyUI address={issue.vault.accountId} />
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
            <AddressWithCopyUI address={issue.vaultBackingAddress} />
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
      <>{renderModalStatusPanel(issue, issueRequestsRefetch)}</>
    </div>
  );
};

export default IssueUI;
