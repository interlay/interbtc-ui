
import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { BitcoinAmount } from '@interlay/monetary-js';

import InterlayCinnabarOutlinedButton from 'components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { displayMonetaryAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';

type RequestReplacementForm = {
  amount: number;
};

interface Props {
  onClose: () => void;
  show: boolean;
}

const RequestReplacementModal = (props: Props): JSX.Element => {
  const { register, handleSubmit, errors } = useForm<RequestReplacementForm>();
  const { address } = useSelector((state: StoreType) => state.general);
  const lockedDot = useSelector((state: StoreType) => state.vault.collateral);
  const lockedBtc = useSelector((state: StoreType) => state.vault.lockedBTC);
  const [isRequestPending, setRequestPending] = React.useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(async ({ amount }) => {
    setRequestPending(true);
    try {
      if (BitcoinAmount.from.BTC(amount).to.Satoshi() === undefined) {
        throw new Error('Amount to convert is less than 1 satoshi.');
      }
      const dustValue = await window.bridge.interBtcApi.redeem.getDustValue();
      const amountPolkaBtc = BitcoinAmount.from.BTC(amount);
      if (amountPolkaBtc.lte(dustValue)) {
        throw new Error(`Please enter an amount greater than Bitcoin dust (${displayMonetaryAmount(dustValue)} BTC)`);
      }
      await window.bridge.interBtcApi.replace.request(amountPolkaBtc);

      const vaultId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);
      queryClient.invalidateQueries([
        GENERIC_FETCHER,
        'interBtcApi',
        'replace',
        'mapReplaceRequests',
        vaultId
      ]);
      toast.success('Replacement request is submitted');
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
            <div className='col-12 text-center mb-4'>{t('vault.withdraw_your_collateral')}</div>
            <div className='col-12'>{t('vault.your_have')}</div>
            <div className='col-12'> {displayMonetaryAmount(lockedDot)} DOT</div>
            <div className='col-12 mb-4'>
              {t('locked')} {displayMonetaryAmount(lockedBtc)} BTC
            </div>
            <div className='col-12 mb-4'>{t('vault.replace_amount')}</div>
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
                    interBTC
                  </span>
                </div>
                {errors.amount && (
                  <div className='-mt-4 text-interlayConifer'>
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
};

export default RequestReplacementModal;
