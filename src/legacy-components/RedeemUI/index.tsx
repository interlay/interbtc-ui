import { RedeemStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { ReactComponent as BitcoinLogoIcon } from '@/assets/img/bitcoin-logo.svg';
import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import Hr2 from '@/legacy-components/hrs/Hr2';
import PriceInfo from '@/legacy-components/PriceInfo';
import PrimaryColorSpan from '@/legacy-components/PrimaryColorSpan';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import RedeemRequestStatusUI from './RedeemRequestStatusUI';
import ReimburseStatusUI from './ReimburseStatusUI';

interface Props {
  redeem: any; // TODO: should type properly (`Relay`)
  onClose: () => void;
}

const RedeemUI = ({ redeem, onClose }: Props): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const redeemedWrappedTokenAmount = redeem.request.requestedAmountBacking
    .add(redeem.bridgeFee)
    .add(redeem.btcTransferFee);

  // TODO: should type properly (`Relay`)
  const renderModalStatusPanel = (redeem: any) => {
    switch (redeem.status) {
      case RedeemStatus.Expired: {
        return <ReimburseStatusUI redeem={redeem} onClose={onClose} />;
      }
      default: {
        return <RedeemRequestStatusUI redeem={redeem} />;
      }
    }
  };

  return (
    <div className={clsx('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-10')}>
      <div className='space-y-6'>
        <div className='text-center'>
          <h4 className={clsx('font-medium', 'space-x-1')}>
            <PrimaryColorSpan className='text-5xl'>{redeemedWrappedTokenAmount.toHuman(8)}</PrimaryColorSpan>
            <PrimaryColorSpan className='text-2xl'>{WRAPPED_TOKEN_SYMBOL}</PrimaryColorSpan>
          </h4>
          <span
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
              'block'
            )}
          >
            {`≈ ${displayMonetaryAmountInUSDFormat(
              redeemedWrappedTokenAmount,
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
            value={redeem.bridgeFee.toHuman(8)}
            unitName='BTC'
            approxUSD={displayMonetaryAmountInUSDFormat(
              redeem.bridgeFee,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}
          />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('bitcoin_network_fee')}
              </h5>
            }
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={redeem.btcTransferFee.toHuman(8)}
            unitName='BTC'
            approxUSD={displayMonetaryAmountInUSDFormat(
              redeem.btcTransferFee,
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
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={redeem.request.requestedAmountBacking.toHuman(8)}
            unitName='BTC'
            approxUSD={displayMonetaryAmountInUSDFormat(
              redeem.request.requestedAmountBacking,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}
          />
        </div>
        <div className='space-y-4'>
          <div className={clsx('flex', 'justify-between', 'items-center')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.destination_address')}
            </span>
            <AddressWithCopyUI address={redeem.userBackingAddress || ''} />
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
            <span className='font-medium'>{formatNumber(redeem.request.height.absolute)}</span>
          </div>
          <div className={clsx('flex', 'justify-between', 'items-center')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.vault_dot_address')}
            </span>
            <AddressWithCopyUI address={redeem.vault.accountId || ''} />
          </div>
        </div>
      </div>
      <>{renderModalStatusPanel(redeem)}</>
    </div>
  );
};

export default RedeemUI;
