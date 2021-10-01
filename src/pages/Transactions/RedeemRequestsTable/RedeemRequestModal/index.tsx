import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Redeem,
  RedeemStatus
} from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

import RedeemRequestStatusUI from './RedeemRequestStatusUI';
import ReimburseStatusUI from './ReimburseStatusUI';
import PriceInfo from 'pages/Bridge/PriceInfo';
import IconButton from 'components/buttons/IconButton';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import {
  displayMonetaryAmount,
  getUsdAmount,
  shortAddress
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

interface CustomProps {
  request: Redeem;
}

const RedeemRequestModal = ({
  open,
  onClose,
  request
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element | null => {
  const { t } = useTranslation();

  const { prices } = useSelector((state: StoreType) => state.general);

  const focusRef = React.useRef(null);

  const renderModalStatusPanel = (request: Redeem) => {
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
    request.amountBTC.add(request.bridgeFee).add(request.btcTransferFee);

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
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'break-words',
            'text-base',
            'text-interlayCalifornia',
            'text-center',
            'uppercase'
          )}>
          {t('issue_page.request', { id: request.id })}
        </InterlayModalTitle>
        <hr
          className={clsx(
            'border-t-2',
            'my-2',
            'border-interlayCalifornia'
          )} />
        <IconButton
          ref={focusRef}
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            width={18}
            height={18}
            className='text-textSecondary' />
        </IconButton>
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
                <span className='text-5xl'>
                  {displayMonetaryAmount(redeemedWrappedTokenAmount)}
                </span>
                <span
                  className={clsx(
                    'text-2xl',
                    'text-interlayDenim'
                  )}>
                  interBTC
                </span>
              </h4>
              <span
                className={clsx(
                  'text-textSecondary',
                  'block'
                )}>
                {`≈ $ ${getUsdAmount(request.amountBTC || BitcoinAmount.zero, prices.bitcoin.usd)}`}
              </span>
            </div>
            <div>
              <PriceInfo
                title={
                  <h5 className='text-textSecondary'>
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
                  <h5 className='text-textSecondary'>
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
              <hr
                className={clsx(
                  'border-t-2',
                  'my-2.5',
                  'border-textSecondary'
                )} />
              <PriceInfo
                title={
                  <h5 className='text-textSecondary'>
                    {t('you_will_receive')}
                  </h5>
                }
                unitIcon={
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                }
                value={displayMonetaryAmount(request.amountBTC)}
                unitName='BTC'
                approxUSD={getUsdAmount(request.amountBTC, prices.bitcoin.usd)} />
            </div>
            <div className='space-y-4'>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span className='text-textSecondary'>
                  {t('issue_page.destination_address')}
                </span>
                <span className='font-medium'>
                  {shortAddress(request.userBTCAddress || '')}
                </span>
              </div>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span className='text-textSecondary'>
                  {t('issue_page.parachain_block')}
                </span>
                <span className='font-medium'>
                  {request.creationBlock}
                </span>
              </div>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span className='text-textSecondary'>
                  {t('issue_page.vault_dot_address')}
                </span>
                <span className='font-medium'>
                  {shortAddress(request.vaultParachainAddress || '')}
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
