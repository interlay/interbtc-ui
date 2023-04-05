import { CollateralCurrencyExt, newVaultId } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { displayMonetaryAmount } from '@/common/utils/utils';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { BTC_ADDRESS_REGEX } from '@/constants';
import CloseIconButton from '@/legacy-components/buttons/CloseIconButton';
import InterlayCinnabarOutlinedButton from '@/legacy-components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from '@/legacy-components/buttons/InterlayMulberryOutlinedButton';
import ErrorMessage from '@/legacy-components/ErrorMessage';
import NumberInput from '@/legacy-components/NumberInput';
import TextField from '@/legacy-components/TextField';
import InterlayModal, { InterlayModalInnerWrapper, InterlayModalTitle } from '@/legacy-components/UI/InterlayModal';

const WRAPPED_TOKEN_AMOUNT = 'amount';
const BTC_ADDRESS = 'btc-address';

type RequestRedeemFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
  [BTC_ADDRESS]: string;
};

interface Props {
  onClose: () => void;
  open: boolean;
  collateralToken: CollateralCurrencyExt;
  vaultAddress: string;
  lockedBTC: BitcoinAmount;
}

// TODO: share form with bridge page
const RequestRedeemModal = ({ onClose, open, collateralToken, vaultAddress, lockedBTC }: Props): JSX.Element => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RequestRedeemFormData>();
  const [isRequestPending, setRequestPending] = React.useState(false);
  const { t } = useTranslation();
  const focusRef = React.useRef(null);

  const onSubmit = handleSubmit(async (data) => {
    setRequestPending(true);
    try {
      // Represents being less than 1 Satoshi
      if (new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT])._rawAmount.lt(1)) {
        throw new Error('Amount to convert is less than 1 satoshi.');
      }
      const dustValue = await window.bridge.redeem.getDustValue();
      const amountPolkaBtc = new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT]);
      if (amountPolkaBtc.lte(dustValue)) {
        throw new Error(`Please enter an amount greater than Bitcoin dust (${displayMonetaryAmount(dustValue)} BTC)`);
      }

      const vaultId = newVaultId(window.bridge.api, vaultAddress, collateralToken, WRAPPED_TOKEN);
      await window.bridge.redeem.request(amountPolkaBtc, data[BTC_ADDRESS], vaultId);

      queryClient.invalidateQueries(['vaultsOverview', vaultAddress, collateralToken.ticker]);

      toast.success('Redeem request submitted');
      onClose();
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  const validateAmount = (value: string): string | undefined => {
    const wrappedTokenAmount = new BitcoinAmount(value);
    if (wrappedTokenAmount.lte(BitcoinAmount.zero())) {
      return t('Amount must be greater than zero!');
    }

    if (wrappedTokenAmount.gt(lockedBTC)) {
      return t(`Amount must be less than locked BTC balance!`);
    }

    return undefined;
  };

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
        <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
          {t('vault.request_redeem')}
        </InterlayModalTitle>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <form className='space-y-4' onSubmit={onSubmit}>
          <p>{t('vault.redeem_description')}</p>
          <p>
            {t('locked')} {lockedBTC.toHuman(8)} BTC
          </p>
          <p>{t('vault.redeem_amount')}</p>
          <div>
            <NumberInput
              min={0}
              {...register(WRAPPED_TOKEN_AMOUNT, {
                required: {
                  value: true,
                  message: t('Amount is required!')
                },
                validate: (value) => validateAmount(value)
              })}
            />
            <ErrorMessage>{errors[WRAPPED_TOKEN_AMOUNT]?.message}</ErrorMessage>
          </div>
          <p>{t('vault.btc_address')}</p>
          <div>
            <TextField
              id={BTC_ADDRESS}
              type='text'
              placeholder={t('enter_btc_address')}
              {...register(BTC_ADDRESS, {
                required: {
                  value: true,
                  message: t('redeem_page.enter_btc')
                },
                pattern: {
                  value: BTC_ADDRESS_REGEX,
                  message: t('redeem_page.valid_btc_address')
                }
              })}
              error={!!errors[BTC_ADDRESS]}
              helperText={errors[BTC_ADDRESS]?.message}
            />
          </div>

          <div className={clsx('flex', 'justify-end', 'space-x-2')}>
            <InterlayMulberryOutlinedButton onClick={onClose}>{t('cancel')}</InterlayMulberryOutlinedButton>
            <InterlayCinnabarOutlinedButton type='submit' pending={isRequestPending}>
              {t('request')}
            </InterlayCinnabarOutlinedButton>
          </div>
        </form>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default RequestRedeemModal;
