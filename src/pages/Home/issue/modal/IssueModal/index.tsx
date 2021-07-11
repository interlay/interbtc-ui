
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import BTCPaymentPendingStatusUI from 'pages/Home/issue/BTCPaymentPendingStatusUI';
import IssueRequestStatusUI from 'pages/Home/issue/modal/IssueRequestStatusUI';
import WhoopsStatusUI from 'pages/Home/issue/modal/WhoopsStatusUI';
import PriceInfo from 'pages/Home/PriceInfo';
import InterlayModal, {
  Props as ModalProps,
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import IconButton from 'components/IconButton';
import {
  displayBtcAmount,
  getUsdAmount,
  shortAddress
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import {
  IssueRequestStatus,
  IssueRequest
} from 'common/types/issue.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

const renderModalStatusPanel = (request: IssueRequest) => {
  switch (request.status) {
  case IssueRequestStatus.PendingWithBtcTxNotFound: {
    return <BTCPaymentPendingStatusUI request={request} />;
  }
  case IssueRequestStatus.RequestedRefund: {
    return <WhoopsStatusUI request={request} />;
  }
  default: {
    return <IssueRequestStatusUI request={request} />;
  }
  }
};

interface CustomProps {
  requestId: string;
}

const IssueModal = ({
  open,
  onClose,
  requestId
}: CustomProps & Omit<ModalProps, 'children'>): JSX.Element | null => {
  const { t } = useTranslation();

  const {
    address,
    prices
  } = useSelector((state: StoreType) => state.general);
  const userIssueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];

  const focusRef = React.useRef(null);

  const request = userIssueRequests.filter(request => request.id === requestId)[0];

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
        {/* TODO: could componentize */}
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'break-words',
            'text-base',
            'text-interlayDenim',
            'text-center',
            'uppercase'
          )}>
          {t('issue_page.request', { id: request.id })}
        </InterlayModalTitle>
        {/* TODO: could componentize */}
        <hr
          className={clsx(
            'border-t-2',
            'my-2',
            'border-interlayDenim'
          )} />
        {/* TODO: could componentize */}
        <IconButton
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
              {/* TODO: could componentize */}
              <h4
                className={clsx(
                  'font-medium',
                  'text-interlayDenim',
                  'space-x-1'
                )}>
                <span className='text-5xl'>
                  {request.issuedAmountBtc || request.requestedAmountPolkaBTC}
                </span>
                <span className='text-2xl'>
                  InterBTC
                </span>
              </h4>
              <span
                className={clsx(
                  'text-textSecondary',
                  'block'
                )}>
                {`≈ $ ${getUsdAmount(
                  request.issuedAmountBtc || request.requestedAmountPolkaBTC || '0',
                  prices.bitcoin.usd
                )}`}
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
              {/* TODO: could componentize */}
              <hr
                className={clsx(
                  'border-t-2',
                  'my-2.5',
                  'border-textSecondary'
                )} />
              <PriceInfo
                title={
                  <h5 className='text-textSecondary'>
                    {t('total_deposit')}
                  </h5>
                }
                unitIcon={
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                }
                value={displayBtcAmount(request.amountBTC)}
                unitName='BTC'
                approxUSD={getUsdAmount(
                  request.issuedAmountBtc || request.requestedAmountPolkaBTC,
                  prices.bitcoin.usd
                )} />
            </div>
            <div className='space-y-4'>
              {/* TODO: could componentize */}
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span className='text-textSecondary'>
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
                  {shortAddress(request.vaultDOTAddress)}
                </span>
              </div>
              <div
                className={clsx(
                  'flex',
                  'justify-between'
                )}>
                <span className='text-textSecondary'>
                  {t('issue_page.vault_btc_address')}
                </span>
                <span className='font-medium'>
                  {shortAddress(request.vaultBTCAddress)}
                </span>
              </div>
            </div>
            <p className='space-x-1'>
              <span className='text-interlayCinnabar'>{t('note')}:</span>
              <span className='text-textSecondary'>{t('issue_page.fully_decentralized')}</span>
            </p>
          </div>
          <>{renderModalStatusPanel(request)}</>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default IssueModal;
