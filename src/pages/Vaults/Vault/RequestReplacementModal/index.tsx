import { CollateralCurrency } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount } from '@/common/utils/utils';
import CloseIconButton from '@/components/buttons/CloseIconButton';
import InterlayCinnabarOutlinedButton from '@/components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from '@/components/buttons/InterlayMulberryOutlinedButton';
import ErrorMessage from '@/components/ErrorMessage';
import NumberInput from '@/components/NumberInput';
import InterlayModal, { InterlayModalInnerWrapper, InterlayModalTitle } from '@/components/UI/InterlayModal';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { CurrencyValues } from '@/types/currency';

const AMOUNT = 'amount';

type RequestReplacementFormData = {
  [AMOUNT]: number;
};

interface Props {
  onClose: () => void;
  open: boolean;
  collateralCurrency: CurrencyValues | undefined;
  vaultAddress: string;
}

const RequestReplacementModal = ({ onClose, open, collateralCurrency, vaultAddress }: Props): JSX.Element => {
  const { register, handleSubmit, errors } = useForm<RequestReplacementFormData>();
  const lockedCollateral = useSelector((state: StoreType) => state.vault.collateral);
  const lockedBtc = useSelector((state: StoreType) => state.vault.lockedBTC);
  const [isRequestPending, setRequestPending] = React.useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const focusRef = React.useRef(null);

  const onSubmit = handleSubmit(async (data) => {
    setRequestPending(true);
    try {
      if (BitcoinAmount.from.BTC(data[AMOUNT]).to.Satoshi() === undefined) {
        throw new Error('Amount to convert is less than 1 satoshi.');
      }
      const dustValue = await window.bridge.redeem.getDustValue();
      const amountPolkaBtc = BitcoinAmount.from.BTC(data[AMOUNT]);
      if (amountPolkaBtc.lte(dustValue)) {
        throw new Error(`Please enter an amount greater than Bitcoin dust (${displayMonetaryAmount(dustValue)} BTC)`);
      }
      await window.bridge.replace.request(amountPolkaBtc, collateralCurrency?.currency as CollateralCurrency);

      const vaultId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, vaultAddress);
      queryClient.invalidateQueries([GENERIC_FETCHER, 'mapReplaceRequests', vaultId]);
      toast.success('Replacement request is submitted');
      onClose();
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  const validateAmount = (value: string): string | undefined => {
    const wrappedTokenAmount = BitcoinAmount.from.BTC(value);
    if (wrappedTokenAmount.lte(BitcoinAmount.zero)) {
      return t('Amount must be greater than zero!');
    }

    if (wrappedTokenAmount.gt(lockedBtc)) {
      return t(`Amount must be less than locked BTC balance!`);
    }

    return undefined;
  };

  return (
    <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
      <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
        <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
          {t('vault.request_replacement')}
        </InterlayModalTitle>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <form className='space-y-4' onSubmit={onSubmit}>
          <p>{t('vault.withdraw_your_collateral')}</p>
          <p>{t('vault.you_have')}</p>
          <p>
            {displayMonetaryAmount(lockedCollateral)} {collateralCurrency?.id}
          </p>
          <p>
            {t('locked')} {displayMonetaryAmount(lockedBtc)} BTC
          </p>
          <p>{t('vault.replace_amount')}</p>
          <div>
            <NumberInput
              name={AMOUNT}
              min={0}
              ref={register({
                required: {
                  value: true,
                  message: t('Amount is required!')
                },
                validate: (value) => validateAmount(value)
              })}
            />
            <ErrorMessage>{errors[AMOUNT]?.message}</ErrorMessage>
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

export default RequestReplacementModal;
