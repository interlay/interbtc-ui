import React, { useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import {
  changeRedeemStepAction,
  resetRedeemWizardAction,
  changeRedeemIdAction
} from '../../../common/actions/redeem.actions';
import RedeemModal from './modal/redeem-modal';
import { getUsdAmount } from '../../../common/utils/utils';

export default function RedeemInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { address, prices } = useSelector((state: StoreType) => state.general);
  const { id } = useSelector((state: StoreType) => state.redeem);
  const requests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
  const [showModal, setShowModal] = useState(false);
  const request = requests.filter(request => request.id === id)[0];

  const onClose = () => {
    dispatch(resetRedeemWizardAction());
    dispatch(changeRedeemStepAction('AMOUNT_AND_ADDRESS'));
  };

  const openModal = () => {
    dispatch(changeRedeemIdAction(request.id));
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <React.Fragment>
      <FormGroup>
        {request && (
          <React.Fragment>
            <div className='wizard-redeem-title'>
              <i className='fas fa-exclamation-circle'></i>
              {t('redeem_page.redeem_processed')}
            </div>
            <div className='row'>
              <div className='col-12 info-redeem-title'>
                <span>{t('redeem_page.will_receive_BTC')}&nbsp;</span> {request.amountPolkaBTC} BTC
              </div>
            </div>
            <div className='row'>
              <div className='col-12 info-redeem-price'>
                                ~${getUsdAmount(request.amountPolkaBTC, prices.bitcoin.usd)}
              </div>
            </div>
            <div className='row'>
              <div className='col btc-destination-address'>
                {t('redeem_page.btc_destination_address')}
              </div>
            </div>
            <div className='row '>
              <div className='col payment-address'>
                <span className='copy-address'>{request.btcAddress}</span>
              </div>
            </div>
            <div className='row'>
              <div className='col inform-you'>{t('redeem_page.we_will_inform_you_btc')}</div>
            </div>
            <div className='row'>
              <div className='col typically-takes'>{t('redeem_page.typically_takes')}</div>
            </div>
          </React.Fragment>
        )}
      </FormGroup>
      <div className='row'>
        <div className='col'>
          <button
            className='btn black-button app-btn'
            onClick={openModal}>
            {t('redeem_page.view_progress')}
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <button
            className='btn green-button mt-5 app-btn'
            onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
      <RedeemModal
        show={showModal}
        onClose={closeModal} />
    </React.Fragment>
  );
}
