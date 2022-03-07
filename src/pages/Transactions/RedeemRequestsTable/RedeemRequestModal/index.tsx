import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { RedeemStatus } from '@interlay/interbtc-api';

import RedeemRequestStatusUI from './RedeemRequestStatusUI';
import ReimburseStatusUI from './ReimburseStatusUI';
import RequestModalTitle from '../../RequestModalTitle';
import PriceInfo from 'pages/Bridge/PriceInfo';
import PrimaryColorSpan from 'components/PrimaryColorSpan';
import CloseIconButton from 'components/buttons/CloseIconButton';
import Hr1 from 'components/hrs/Hr1';
import Hr2 from 'components/hrs/Hr2';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  displayMonetaryAmount,
  getUsdAmount,
  shortAddress
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';

interface CustomProps {
  // TODO: should type properly (`Relay`)
  request: any;
}

const RedeemRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element | null => {
  const { t } = useTranslation();

  const { prices } = useSelector((state: StoreType) => state.general);

  const focusRef = React.useRef(null);

  // TODO: should type properly (`Relay`)
  const renderModalStatusPanel = (request: any) => {
    switch (request.status) {
    case RedeemStatus.Expired: {
      return (
        <ReimburseStatusUI
          request={request}
          onClose={onClose} />
      );
    }
    default: {
      return <RedeemRequestStatusUI request={request} />;
    }
    }
  };

  const redeemedWrappedTokenAmount =
    request.request.requestedAmountBacking.add(request.bridgeFee).add(request.btcTransferFee);

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={onClose}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-12',
          'max-w-5xl'
        )}>
        <RequestModalTitle>
          {t('issue_page.request', { id: request.id })}
        </RequestModalTitle>
        <Hr1
          className={clsx(
            'border-t-2',
            'my-2'
          )} />
        <CloseIconButton
          ref={focusRef}
          onClick={onClose} />
        <div
          className={clsx(
            'grid',
            'grid-cols-1',
            'lg:grid-cols-2',
            'gap-10'
          )}>
          <div className='space-y-6'>
            <div className='text-center'>
              <h4
                className={clsx(
                  'font-medium',
                  'space-x-1'
                )}>
                <PrimaryColorSpan className='text-5xl'>
                  {displayMonetaryAmount(redeemedWrappedTokenAmount)}
                </PrimaryColorSpan>
                <PrimaryColorSpan className='text-2xl'>
                  {WRAPPED_TOKEN_SYMBOL}
                </PrimaryColorSpan>
              </h4>
              <span
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  'block'
                )}>
                {`≈ $ ${getUsdAmount(redeemedWrappedTokenAmount, prices.bitcoin.usd)}`}
              </span>
            </div>
            <div>
              <PriceInfo
                title={
                  <h5
                    className={clsx(
                      { 'text-interlayTextSecondaryInLightMode':
                        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                    )}>
                    {t('bridge_fee')}
                  </h5>
                }
                unitIcon={
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                }
                value={displayMonetaryAmount(request.bridgeFee)}
                unitName='BTC'
                approxUSD={getUsdAmount(request.bridgeFee, prices.bitcoin.usd)} />
              <PriceInfo
                title={
                  <h5
                    className={clsx(
                      { 'text-interlayTextSecondaryInLightMode':
                        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                    )}>
                    {t('bitcoin_network_fee')}
                  </h5>
                }
                unitIcon={
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                }
                value={displayMonetaryAmount(request.btcTransferFee)}
                unitName='BTC'
                approxUSD={getUsdAmount(request.btcTransferFee, prices.bitcoin.usd)} />
              <Hr2
                className={clsx(
                  'border-t-2',
                  'my-2.5'
                )} />
              <PriceInfo
                title={
                  <h5
                    className={clsx(
                      { 'text-interlayTextSecondaryInLightMode':
                        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                    )}>
                    {t('you_will_receive')}
                  </h5>
                }
                unitIcon={
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                }
                value={displayMonetaryAmount(request.request.requestedAmountBacking)}
                unitName='BTC'
                approxUSD={getUsdAmount(request.request.requestedAmountBacking, prices.bitcoin.usd)} />
            </div>
            <div className='space-y-4'>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span
                  className={clsx(
                    { 'text-interlayTextSecondaryInLightMode':
                      process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  )}>
                  {t('issue_page.destination_address')}
                </span>
                <span className='font-medium'>
                  {shortAddress(request.userBackingAddress || '')}
                </span>
              </div>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span
                  className={clsx(
                    { 'text-interlayTextSecondaryInLightMode':
                      process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  )}>
                  {t('issue_page.parachain_block')}
                </span>
                <span className='font-medium'>
                  {request.request.height.active}
                </span>
              </div>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span
                  className={clsx(
                    { 'text-interlayTextSecondaryInLightMode':
                      process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  )}>
                  {t('issue_page.vault_dot_address')}
                </span>
                <span className='font-medium'>
                  {shortAddress(request.vault.accountId || '')}
                </span>
              </div>
            </div>
          </div>
          <>{renderModalStatusPanel(request)}</>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default RedeemRequestModal;
