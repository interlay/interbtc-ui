import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RedeemStatus } from '@interlay/interbtc-api';

import RedeemRequestStatusUI from './RedeemRequestStatusUI';
import ReimburseStatusUI from './ReimburseStatusUI';
import PriceInfo from 'pages/Bridge/PriceInfo';
import PrimaryColorSpan from 'components/PrimaryColorSpan';
import Hr2 from 'components/hrs/Hr2';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { displayMonetaryAmount, getUsdAmount, shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

interface Props {
  redeem: any; // TODO: should type properly (`Relay`)
  onClose: () => void;
}

const RedeemUI = ({ redeem, onClose }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { prices } = useSelector((state: StoreType) => state.general);

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
            <PrimaryColorSpan className='text-5xl'>
              {displayMonetaryAmount(redeemedWrappedTokenAmount)}
            </PrimaryColorSpan>
            <PrimaryColorSpan className='text-2xl'>{WRAPPED_TOKEN_SYMBOL}</PrimaryColorSpan>
          </h4>
          <span
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
              'block'
            )}
          >
            {`≈ $ ${getUsdAmount(redeemedWrappedTokenAmount, prices.bitcoin?.usd)}`}
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
            value={displayMonetaryAmount(redeem.bridgeFee)}
            unitName='BTC'
            approxUSD={getUsdAmount(redeem.bridgeFee, prices.bitcoin?.usd)}
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
            value={displayMonetaryAmount(redeem.btcTransferFee)}
            unitName='BTC'
            approxUSD={getUsdAmount(redeem.btcTransferFee, prices.bitcoin?.usd)}
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
            value={displayMonetaryAmount(redeem.request.requestedAmountBacking)}
            unitName='BTC'
            approxUSD={getUsdAmount(redeem.request.requestedAmountBacking, prices.bitcoin?.usd)}
          />
        </div>
        <div className='space-y-4'>
          <div className={clsx('flex', 'justify-between')}>
            <span
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('issue_page.destination_address')}
            </span>
            <span className='font-medium'>{shortAddress(redeem.userBackingAddress || '')}</span>
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
            <span className='font-medium'>{redeem.request.height.active}</span>
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
            <span className='font-medium'>{shortAddress(redeem.vault.accountId || '')}</span>
          </div>
        </div>
      </div>
      <>{renderModalStatusPanel(redeem)}</>
    </div>
  );
};

export default RedeemUI;