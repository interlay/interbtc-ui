import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { btcToSat } from '@interlay/interbtc';
import Big from 'big.js';

import InterlayCinnabarOutlinedButton from 'components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import { addReplaceRequestsAction } from 'common/actions/vault.actions';
import { StoreType } from 'common/types/util.types';
import { parachainToUIReplaceRequests } from 'common/utils/requests';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { BTCAmount } from '@interlay/monetary-js';

type RequestReplacementForm = {
  amount: number;
};

type RequestReplacementProps = {
  onClose: () => void;
  show: boolean;
};

export default function RequestReplacementModal(props: RequestReplacementProps): JSX.Element {
  const { register, handleSubmit, errors } = useForm<RequestReplacementForm>();
  const dispatch = useDispatch();
  const { address } = useSelector((state: StoreType) => state.general);
  const lockedDot = useSelector((state: StoreType) => state.vault.collateral);
  const lockedBtc = useSelector((state: StoreType) => state.vault.lockedBTC);
  const [isRequestPending, setRequestPending] = useState(false);
  const { t } = useTranslation();

  const onSubmit = handleSubmit(async ({ amount }) => {
    setRequestPending(true);
    try {
      if (btcToSat(new Big(amount)) === undefined) {
        throw new Error('Amount to convert is less than 1 satoshi.');
      }
      const dustValue = await window.polkaBTC.redeem.getDustValue();
      const amountPolkaBtc = BTCAmount.from.BTC(amount);
      if (amountPolkaBtc.lte(dustValue)) {
        throw new Error(`Please enter an amount greater than Bitcoin dust (${dustValue.toHuman()} BTC)`);
      }
      await window.polkaBTC.replace.request(amountPolkaBtc);

      const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const requests = await window.polkaBTC.vaults.mapReplaceRequests(vaultId);
      if (!requests) return;

      dispatch(addReplaceRequestsAction(parachainToUIReplaceRequests(requests)));
      toast.success('Replacment request is submitted');
      props.onClose();
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}>
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{t('vault.request_replacement')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-12 request-header'>{t('vault.withdraw_your_collateral')}</div>
            <div className='col-12'>{t('vault.your_have')}</div>
            <div className='col-12'> {lockedDot} DOT</div>
            <div className='col-12 vault-empty-space'>
              {t('locked')} {lockedBtc} BTC
            </div>
            <div className='col-12 vault-empty-space'>{t('vault.replace_amount')}</div>
            <div className='col-12'>
              <div className='input-group'>
                <input
                  name='amount'
                  type='float'
                  className={'form-control custom-input' + (errors.amount ? ' border-interlayCinnabar' : '')}
                  aria-describedby='basic-addon2'
                  ref={register({
                    required: true
                  })}>
                </input>
                <div className='input-group-append'>
                  <span
                    className='input-group-text'
                    id='basic-addon2'>
                                        InterBTC
                  </span>
                </div>
                {errors.amount && (
                  <div className='input-error text-interlayConifer'>
                    {errors.amount.type === 'required' ?
                      'Amount is required' :
                      errors.amount.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <InterlayMulberryOutlinedButton onClick={props.onClose}>
            {t('cancel')}
          </InterlayMulberryOutlinedButton>
          <InterlayCinnabarOutlinedButton
            type='submit'
            pending={isRequestPending}>
            {t('request')}
          </InterlayCinnabarOutlinedButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
