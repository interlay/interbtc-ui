
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import StatusView from './status-view';
import ReimburseView from './reimburse-view';
import { getUsdAmount, shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { RedeemRequestStatus } from 'common/types/redeem.types';
import BitcoinLogo from 'assets/img/small-bitcoin-logo.png';

type RedeemModalProps = {
  show: boolean;
  onClose: () => void;
};

function RedeemModal(props: RedeemModalProps): ReactElement {
  const { address, prices } = useSelector((state: StoreType) => state.general);
  const selectedIdRequest = useSelector((state: StoreType) => state.redeem.id);
  const userRedeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
  const request = userRedeemRequests.filter(request => request.id === selectedIdRequest)[0];
  const { t } = useTranslation();

  return (
    <Modal
      className='redeem-modal'
      show={props.show}
      onHide={props.onClose}
      size='xl'>
      {request && (
        <>
          <div className='redeem-modal-title'>{t('issue_page.request', { id: request.id })}</div>
          <i
            className='fas fa-times close-icon'
            onClick={props.onClose} />
          <div className='redeem-modal-horizontal-line' />
          <Modal.Body>
            <div className='row'>
              <div className='col-xl-6 col-lg-12 justify-content-center'>
                <div className='redeem-amount'>
                  <span className='wizard-number'>{request.amountPolkaBTC}</span>&nbsp;PolkaBTC
                </div>
                <div className='row usd-price-modal'>
                  <div className='col'>
                    {'~ $' + getUsdAmount(request.amountPolkaBTC || '0', prices.bitcoin.usd)}
                  </div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('bridge_fee')}</div>
                  <div className='col-6'>
                    <img
                      className='inline-block'
                      src={BitcoinLogo}
                      width='23px'
                      height='23px'
                      alt='bitcoin logo' />
                    {' '}
                    &nbsp;
                    {request.fee} BTC
                    <div className='send-price'>
                      {'~ $' + getUsdAmount(request.fee, prices.bitcoin.usd)}
                    </div>
                  </div>
                </div>
                <hr className='total-divider' />
                <div className='step-item row'>
                  <div className='col-6 total-amount temp-text-left total-added-value'>{t('you_will_receive')}</div>
                  <div className='col-6 total-amount'>
                    <img
                      className='inline-block'
                      src={BitcoinLogo}
                      width='23px'
                      height='23px'
                      alt='bitcoin logo' />
                      &nbsp;
                    {request.amountBTC} BTC
                    <div className='send-price'>
                      {'~ $' + getUsdAmount(request.amountBTC, prices.bitcoin.usd)}
                    </div>
                  </div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('issue_page.destination_address')}</div>
                  <div className='col-6 right-text'>{shortAddress(request.userBTCAddress || '')}</div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('issue_page.parachain_block')}</div>
                  <div className='col-6 right-text'>{request.creation}</div>
                </div>
                <div className='step-item row'>
                  <div className='col-6 temp-text-left'>{t('issue_page.vault_dot_address_modal')}</div>
                  <div className='col-6 right-text'>{shortAddress(request.vaultDOTAddress || '')}</div>
                </div>
              </div>
              <div className='col-xl-6 col-lg-12'>
                {request.status === RedeemRequestStatus.Expired ? (
                  <ReimburseView
                    request={request}
                    onClose={props.onClose} />
                ) : (
                  <StatusView request={request} />
                )}
              </div>
            </div>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}

export default RedeemModal;
