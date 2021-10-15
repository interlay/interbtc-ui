
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import clsx from 'clsx';
import { BitcoinAmount } from '@interlay/monetary-js';

import InterlayCinnabarOutlinedButton from 'components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import IconButton from 'components/buttons/IconButton';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { displayMonetaryAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

type RequestReplacementForm = {
  amount: number;
};

interface Props {
  onClose: () => void;
  show: boolean;
}

const RequestReplacementModal = ({
  onClose,
  show
}: Props): JSX.Element => {
  const { register, handleSubmit, errors } = useForm<RequestReplacementForm>();
  const { address } = useSelector((state: StoreType) => state.general);
  const lockedDot = useSelector((state: StoreType) => state.vault.collateral);
  const lockedBtc = useSelector((state: StoreType) => state.vault.lockedBTC);
  const [isRequestPending, setRequestPending] = React.useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const focusRef = React.useRef(null);

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
      onClose();
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={show}
      onClose={onClose}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'mb-4'
          )}>
          {t('vault.request_replacement')}
        </InterlayModalTitle>
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
            className={clsx(
              { 'text-interlaySecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
              { 'dark:text-kintsugiSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )} />
        </IconButton>
        <form
          className='space-y-4'
          onSubmit={onSubmit}>
          <p>
            {t('vault.withdraw_your_collateral')}
          </p>
          <p>{t('vault.your_have')}</p>
          <p>
            {displayMonetaryAmount(lockedDot)} {COLLATERAL_TOKEN_SYMBOL}
          </p>
          <p>
            {t('locked')} {displayMonetaryAmount(lockedBtc)} BTC
          </p>
          <p>
            {t('vault.replace_amount')}
          </p>
          <div className='input-group'>
            <input
              name='amount'
              type='float'
              className={clsx(
                'form-control',
                { 'border-interlayCinnabar': errors.amount }
              )}
              aria-describedby='basic-addon2'
              ref={register({
                required: true
              })}>
            </input>
            <div className='input-group-append'>
              <span className='input-group-text'>
                {WRAPPED_TOKEN_SYMBOL}
              </span>
            </div>
            {errors.amount && (
              <p className='text-interlayConifer'>
                {errors.amount.type === 'required' ?
                  'Amount is required' :
                  errors.amount.message}
              </p>
            )}
          </div>
          <div
            className={clsx(
              'flex',
              'justify-end',
              'space-x-2'
            )}>
            <InterlayMulberryOutlinedButton onClick={onClose}>
              {t('cancel')}
            </InterlayMulberryOutlinedButton>
            <InterlayCinnabarOutlinedButton
              type='submit'
              pending={isRequestPending}>
              {t('request')}
            </InterlayCinnabarOutlinedButton>
          </div>
        </form>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default RequestReplacementModal;
