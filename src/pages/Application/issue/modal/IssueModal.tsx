
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import BTCPaymentPendingStatus from '../BTCPaymentPendingStatus';
import IssueRequestStatusUI from './IssueRequestStatusUI';
import WhoopsStatusUI from './WhoopsStatusUI';
import PriceInfo from '../../PriceInfo';
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

type IssueModalProps = {
  open: boolean;
  onClose: () => void;
};

const IssueModal = (props: IssueModalProps): JSX.Element => {
  const { address, prices } = useSelector((state: StoreType) => state.general);
  const selectedIdRequest = useSelector((state: StoreType) => state.issue.id);
  const userIssueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address) || [];
  const request = userIssueRequests.filter(request => request.id === selectedIdRequest)[0];
  const { t } = useTranslation();

  const renderModalStatusPanel = (request: IssueRequest) => {
    switch (request.status) {
    case IssueRequestStatus.PendingWithBtcTxNotFound: {
      return <BTCPaymentPendingStatus request={request} />;
    }
    case IssueRequestStatus.RequestedRefund: {
      return <WhoopsStatusUI request={request} />;
    }
    default: {
      return <IssueRequestStatusUI request={request} />;
    }
    }
  };

  return (
    <Modal
      className='issue-modal'
      show={props.open}
      onHide={props.onClose}
      size='xl'>
      {request && (
        <>
          {/* TODO: could componentize */}
          <h4
            className={clsx(
              'break-words',
              'font-medium',
              'text-base',
              'text-interlayRose',
              'text-center',
              'uppercase'
            )}>
            {t('issue_page.request', { id: request.id })}
          </h4>
          {/* TODO: could componentize */}
          <IconButton
            className={clsx(
              'w-12',
              'h-12',
              'absolute',
              'top-3',
              'right-3'
            )}
            onClick={props.onClose}>
            <CloseIcon
              width={18}
              height={18}
              className='text-textSecondary' />
          </IconButton>
          {/* TODO: could componentize */}
          <hr
            className={clsx(
              'border-t-2',
              'my-2',
              'border-interlayRose'
            )} />
          <Modal.Body>
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
                      'text-interlayRose',
                      'space-x-1'
                    )}>
                    <span className='text-5xl'>
                      {request.issuedAmountBtc || request.requestedAmountPolkaBTC}
                    </span>
                    <span className='text-2xl'>
                      PolkaBTC
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
                  <span className='text-interlayPomegranate'>{t('note')}:</span>
                  <span className='text-textSecondary'>{t('issue_page.fully_decentralized')}</span>
                </p>
              </div>
              <div>{renderModalStatusPanel(request)}</div>
            </div>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
};

export default IssueModal;
