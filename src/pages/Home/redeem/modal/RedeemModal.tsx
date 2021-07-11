
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RedeemRequestStatusUI from './RedeemRequestStatusUI';
import ReimburseStatusUI from './ReimburseStatusUI';
import IconButton from 'components/IconButton';
import PriceInfo from 'pages/Home/PriceInfo';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import {
  displayBtcAmount,
  getUsdAmount,
  shortAddress
} from 'common/utils/utils';
import { RedeemRequest } from 'common/types/redeem.types';
import { StoreType } from 'common/types/util.types';
import { RedeemRequestStatus } from 'common/types/redeem.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

interface CustomProps {
  requestId: string;
}

const RedeemModal = ({
  open,
  onClose,
  requestId
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element | null => {
  const { t } = useTranslation();

  const {
    address,
    prices
  } = useSelector((state: StoreType) => state.general);
  const userRedeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];

  const request = userRedeemRequests.filter(request => request.id === requestId)[0];

  const focusRef = React.useRef(null);

  const renderModalStatusPanel = (request: RedeemRequest) => {
    switch (request.status) {
    case RedeemRequestStatus.Expired: {
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

  if (!request) return null;

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
                  {request.amountPolkaBTC}
                </span>
                <span
                  className={clsx(
                    'text-2xl',
                    'text-interlayDenim'
                  )}>
                  InterBTC
                </span>
              </h4>
              <span
                className={clsx(
                  'text-textSecondary',
                  'block'
                )}>
                {`≈ $ ${getUsdAmount(request.amountPolkaBTC || '0', prices.bitcoin.usd)}`}
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
                value={displayBtcAmount(request.fee)}
                unitName='BTC'
                approxUSD={getUsdAmount(request.fee, prices.bitcoin.usd)} />
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
                value={displayBtcAmount(request.btcTransferFee)}
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
                value={displayBtcAmount(request.amountBTC)}
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
                  {request.creation}
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
                  {shortAddress(request.vaultDOTAddress || '')}
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

export default RedeemModal;
