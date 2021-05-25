import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ButtonMaybePending from 'common/components/pending-button';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { addReplaceRequestsAction } from 'common/actions/vault.actions';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from 'common/types/util.types';
import { btcToSat, satToBTC } from '@interlay/polkabtc';
import { parachainToUIReplaceRequests } from 'common/utils/requests';
import { useTranslation } from 'react-i18next';
import { PolkaBTC } from '@interlay/polkabtc/build/interfaces';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

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
      const amountAsSatoshisString = btcToSat(amount.toString());
      if (amountAsSatoshisString === undefined) {
        throw new Error('Amount to convert is less than 1 satoshi.');
      }
      const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
      const amountAsSatoshi = window.polkaBTC.api.createType('Balance', amountAsSatoshisString);
      if (amountAsSatoshi.lte(dustValueAsSatoshi)) {
        const dustValue = satToBTC(dustValueAsSatoshi.toString());
        throw new Error(`Please enter an amount greater than Bitcoin dust (${dustValue} BTC)`);
      }
      const amountAsSatoshis = window.polkaBTC.api.createType('Balance', amountAsSatoshisString) as PolkaBTC;
      await window.polkaBTC.replace.request(amountAsSatoshis);

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
                  className={'form-control custom-input' + (errors.amount ? ' error-borders' : '')}
                  aria-describedby='basic-addon2'
                  ref={register({
                    required: true
                  })}>
                </input>
                <div className='input-group-append'>
                  <span
                    className='input-group-text'
                    id='basic-addon2'>
                                        PolkaBTC
                  </span>
                </div>
                {errors.amount && (
                  <div className='input-error'>
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
          <Button
            variant='secondary'
            onClick={props.onClose}>
            {t('cancel')}
          </Button>
          <ButtonMaybePending
            variant='outline-danger'
            type='submit'
            isPending={isRequestPending}>
            {t('request')}
          </ButtonMaybePending>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
