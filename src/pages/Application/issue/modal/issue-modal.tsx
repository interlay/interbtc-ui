
// ray test touch <
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import PaymentView from './PaymentView';
import StatusView from './status-view';
import WhoopsView from './whoops-view';
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
      return <PaymentView request={request} />;
    }
    case IssueRequestStatus.RequestedRefund: {
      return <WhoopsView request={request} />;
    }
    default: {
      return <StatusView request={request} />;
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
          {/* ray test touch < */}
          {/* TODO: could be a component */}
          <i
            className='fas fa-times close-icon'
            onClick={props.onClose} />
          {/* ray test touch > */}
          <div className='issue-modal-horizontal-line' />
          <Modal.Body>
            <div className='row'>
              <div className='col-xl-6 col-lg-12 justify-center'>
                <div className='issue-amount'>
                  <span className='wizard-number'>
                    {request.issuedAmountBtc || request.requestedAmountPolkaBTC}
                  </span>
                  &nbsp;PolkaBTC
                </div>
                <div className='row usd-price-modal'>
                  <div className='col'>
                    {'~ $' + getUsdAmount(
                      request.issuedAmountBtc || request.requestedAmountPolkaBTC || '0',
                      prices.bitcoin.usd
                    )}
                  </div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('bridge_fee')}</div>
                  <div className='col-6 right-text'>
                    <BitcoinLogoIcon
                      className='inline-block'
                      width={23}
                      height={23} />
                    {' '}
                    &nbsp;
                    {displayBtcAmount(request.fee)} BTC
                    <div className='send-price'>
                      {'~ $' + getUsdAmount(request.fee, prices.bitcoin.usd)}
                    </div>
                  </div>
                </div>
                <hr className='total-divider' />
                <div className='step-item row'>
                  <div className='col-6 total-added-value temp-text-left'>{t('total_deposit')}</div>
                  <div className='col-6 total-amount right-text'>
                    <BitcoinLogoIcon
                      className='inline-block'
                      width={23}
                      height={23} />
                    {' '}
                    &nbsp;
                    {displayBtcAmount(request.amountBTC)}
                    {' '}
                    BTC
                    <div className='send-price'>
                      {'~ $' + getUsdAmount(
                        request.issuedAmountBtc || request.requestedAmountPolkaBTC,
                        prices.bitcoin.usd
                      )}
                    </div>
                  </div>
                </div>
                {/* TODO: should be reusable */}
                <div className='step-item row mt-2'>
                  <div className='col-6 temp-text-left'>{t('issue_page.destination_address')}</div>
                  <div className='col-6 right-text'>{shortAddress(address)}</div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('issue_page.parachain_block')}</div>
                  <div className='col-6 right-text'>{request.creation}</div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('issue_page.vault_dot_address')}</div>
                  <div className='col-6 right-text'>{shortAddress(request.vaultDOTAddress)}</div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('issue_page.vault_btc_address')}</div>
                  <div className='col-6 right-text'>{shortAddress(request.vaultBTCAddress)}</div>
                </div>
                <div className='row justify-center mt-3'>
                  <div className='col-9 note-title'>{t('note')}:</div>
                </div>
                <div className='row justify-center'>
                  <div className='col-9 note-text'>{t('issue_page.fully_decentralized')}</div>
                </div>
              </div>
              <div className='col-xl-6 col-lg-12'>{renderModalStatusPanel(request)}</div>
            </div>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
};

export default IssueModal;
// ray test touch >
