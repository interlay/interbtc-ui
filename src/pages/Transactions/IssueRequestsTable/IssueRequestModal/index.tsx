import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { IssueStatus } from '@interlay/interbtc-api';

import BTCPaymentPendingStatusUI from './BTCPaymentPendingStatusUI';
import IssueRequestStatusUI from './IssueRequestStatusUI';
import WhoopsStatusUI from './WhoopsStatusUI';
import RequestModalTitle from '../../RequestModalTitle';
import PriceInfo from 'pages/Bridge/PriceInfo';
import CloseIconButton from 'components/buttons/CloseIconButton';
import Hr1 from 'components/hrs/Hr1';
import Hr2 from 'components/hrs/Hr2';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import {
  WrappedTokenAmount,
  WRAPPED_TOKEN_SYMBOL
} from 'config/relay-chains';
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

interface CustomProps {
  // TODO: should type properly (`Relay`)
  request: any;
}

const IssueRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element | null => {
  const { t } = useTranslation();

  const {
    address,
    prices
  } = useSelector((state: StoreType) => state.general);

  const focusRef = React.useRef(null);

  const receivedWrappedTokenAmount =
    request.execution ?
      request.execution.amountWrapped :
      request.request.amountWrapped;
  const bridgeFee =
    request.execution ?
      request.execution.bridgeFeeWrapped :
      request.request.bridgeFeeWrapped;
  const sentBackingTokenAmount =
    // TODO: double-check
    (receivedWrappedTokenAmount as WrappedTokenAmount)
      .add(bridgeFee as WrappedTokenAmount);

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
              {/* TODO: could componentize */}
              <h4
                className={clsx(
                  'font-medium',
                  { 'text-interlayDenim':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  'space-x-1'
                )}>
                <span className='text-5xl'>
                  {displayMonetaryAmount(receivedWrappedTokenAmount)}
                </span>
                <span className='text-2xl'>
                  {WRAPPED_TOKEN_SYMBOL}
                </span>
              </h4>
              <span
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  'block'
                )}>
                {`≈ $ ${getUsdAmount(
                  receivedWrappedTokenAmount,
                  prices.bitcoin.usd
                )}`}
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
                value={displayMonetaryAmount(bridgeFee)}
                unitName='BTC'
                approxUSD={getUsdAmount(bridgeFee, prices.bitcoin.usd)} />
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
                    {t('total_deposit')}
                  </h5>
                }
                unitIcon={
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                }
                value={displayMonetaryAmount(sentBackingTokenAmount)}
                unitName='BTC'
                approxUSD={getUsdAmount(sentBackingTokenAmount, prices.bitcoin.usd)} />
            </div>
            <div className='space-y-4'>
              {/* TODO: could componentize */}
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
                  {shortAddress(address)}
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
                  {shortAddress(request.vault.accountId)}
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
                  {t('issue_page.vault_btc_address')}
                </span>
                <span className='font-medium'>
                  {shortAddress(request.vaultBackingAddress)}
                </span>
              </div>
            </div>
            <p className='space-x-1'>
              <span className='text-interlayCinnabar'>{t('note')}:</span>
              <span
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('issue_page.fully_decentralized', {
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })}
              </span>
            </p>
          </div>
          <>{renderModalStatusPanel(request)}</>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default IssueRequestModal;
