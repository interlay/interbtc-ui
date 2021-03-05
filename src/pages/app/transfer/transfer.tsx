import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StoreType } from '../../../common/types/util.types';
import ButtonMaybePending from '../../../common/components/pending-button';
import { getUsdAmount, updateBalances } from '../../../common/utils/utils';
import { btcToSat } from '@interlay/polkabtc';
import { updateBalancePolkaBTCAction } from '../../../common/actions/general.actions';
import PolkaBTCLogo from '../../../assets/img/polkabtc-logo-cropped.png';
import AcalaLogo from '../../../assets/img/acala-logo-cropped.png';
import PlasmLogo from '../../../assets/img/plasm-logo.png';
import Big from 'big.js';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';

type TransferForm = {
    amountPolkaBTC: string;
    address: string;
};

export default function Transfer() {
  const { t } = useTranslation();
  const senderAddress = useSelector((state: StoreType) => state.general.address);
  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const { balancePolkaBTC, balanceDOT } = useSelector((state: StoreType) => state.general);
  const defaultValues = { defaultValues: { amountPolkaBTC: '', btcAddress: '' } };
  const { register, handleSubmit, errors, getValues, reset } = useForm<TransferForm>(defaultValues);
  const [isRequestPending, setRequestPending] = useState(false);
  const [usdAmount, setUsdAmount] = useState('0.00');
  const [displayNetworkModal, setDisplayNetworkModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [networkImage, setNetworkImage] = useState(PolkaBTCLogo);
  const [networkName, setNetworkName] = useState('PolkaBTC');
  const dispatch = useDispatch();

  const onSubmit = handleSubmit(async ({ amountPolkaBTC, address }) => {
    setRequestPending(true);
    try {
      window.polkaBTC.treasury.setAccount(senderAddress);
      await window.polkaBTC.treasury.transfer(address, btcToSat(amountPolkaBTC));
      dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(amountPolkaBTC)).toString()));
      updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
      toast.success(t('successful_transfer'));
      reset({ amountPolkaBTC: '', address: '' });
    } catch (error) {
      console.log(error);
    }
    setRequestPending(false);
  });

  return (
    <div className='transfer'>
      <form onSubmit={onSubmit}>
        <div className='row'>
          <div className='col-12 wizard-header-text font-blue'>{t('transfer_page.transfer_to')}</div>
        </div>
        <div className='row'>
          <div className='col-6'>
            <input
              id='amount-btc-input'
              name='amountPolkaBTC'
              type='number'
              step='any'
              placeholder='0.00'
              className={'' + (errors.amountPolkaBTC ? ' error-borders' : '')}
              onChange={() => {
                setUsdAmount(getUsdAmount(getValues('amountPolkaBTC') || '0.00', usdPrice));
              }}
              ref={register({
                required: true,
                validate: value => {
                  if (Number(balancePolkaBTC) === 0) return t('insufficient_funds') + '';
                  if (Number(balanceDOT) === 0) return t('insufficient_funds_dot') + '';
                  if (value > balancePolkaBTC) {
                    return t('redeem_page.current_balance') + balancePolkaBTC;
                  }
                  return undefined;
                }
              })} />
          </div>
          <div className='col-6 mark-currency'>PolkaBTC</div>
        </div>
        <div className='row usd-price'>
          <div className='col'>{'~ $' + usdAmount}</div>
        </div>
        {errors.amountPolkaBTC && (
          <div className='wizard-input-error'>
            {errors.amountPolkaBTC.type === 'required' ?
              t('redeem_page.please_enter_amount') :
              errors.amountPolkaBTC.message}
          </div>
        )}
        <div className='row'>
          <div className='col-12'>
            <p className='form-heading'>{t('recipient')}</p>
            <div className='row'>
              <div className='input-address-wrapper col'>
                <input
                  id='btc-address-input'
                  name='address'
                  type='string'
                  className={'' + (errors.address ? ' error-borders' : '')}
                  placeholder={t('recipient_account')}
                  ref={register({
                    required: true
                  })} />
              </div>
              <Button
                variant='outline-primary'
                className='col-xs-3 mx-1'
                onClick={() => setDisplayNetworkModal(true)}>
                <img
                  src={networkImage}
                  width='23px'
                  height='23px'
                  alt={`${networkName} logo`}>
                </img>&nbsp;{networkName}
              </Button>
            </div>
          </div>
        </div>
        {errors.address && (
          <div className='address-input-error'>
            {errors.address.type === 'required' ? t('enter_recipient_address') : errors.address.message}
          </div>
        )}
        <div className='mb-5'></div>
        <ButtonMaybePending
          className='btn green-button app-btn'
          isPending={isRequestPending}
          disabled={isDisabled}
          onClick={onSubmit}>
          {isDisabled ? t('coming_soon') : t('transfer')}
        </ButtonMaybePending>
      </form>
      <Modal
        className='transferNetworkSelectionModal'
        show={displayNetworkModal}
        onHide={() => setDisplayNetworkModal(false)}
        centered
        size='sm'
        animation={false}>
        <Modal.Header>
          <Modal.Title>Select a network:</Modal.Title>
        </Modal.Header>
        <Modal.Body className='pb-4'>
          {[
            { img: PolkaBTCLogo, text: 'PolkaBTC' },
            { img: AcalaLogo, text: 'Acala' },
            { img: PlasmLogo, text: 'Plasm' }
          ].map(data =>
            <div className='row justify-content-md-center'>
              <Button
                variant='light'
                className='col-8 m-2'
                onClick={() => {
                  setNetworkName(data.text);
                  setNetworkImage(data.img);
                  setDisplayNetworkModal(false);
                  if (data.text === 'PolkaBTC') {
                    setIsDisabled(false);
                  } else {
                    setIsDisabled(true);
                  }
                }
                }>
                <img
                  src={data.img}
                  width='23px'
                  height='23px'
                  alt='logo'>
                </img>&nbsp;{data.text}
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
