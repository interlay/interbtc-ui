import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { displayMonetaryAmount, formatNumber } from '@/common/utils/utils';
import CloseIconButton from '@/components/buttons/CloseIconButton';
import InterlayCinnabarOutlinedButton from '@/components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from '@/components/buttons/InterlayMulberryOutlinedButton';
import ErrorMessage from '@/components/ErrorMessage';
import NumberInput from '@/components/NumberInput';
import InterlayModal, { InterlayModalInnerWrapper, InterlayModalTitle } from '@/components/UI/InterlayModal';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';

const AMOUNT = 'amount';

type RequestReplacementFormData = {
  [AMOUNT]: number;
};

interface Props {
  onClose: () => void;
  open: boolean;
  collateralToken: CollateralCurrencyExt;
  vaultAddress: string;
  lockedBTC: BitcoinAmount;
  collateralAmount: MonetaryAmount<CollateralCurrencyExt>;
}

const RequestReplacementModal = ({
  onClose,
  open,
  collateralToken,
  vaultAddress,
  lockedBTC,
  collateralAmount
}: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RequestReplacementFormData>();
  const [isRequestPending, setRequestPending] = React.useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const focusRef = React.useRef(null);

  const onSubmit = handleSubmit(async (data) => {
    setRequestPending(true);
    try {
      // Represents being less than 1 Satoshi
      if (new BitcoinAmount(data[AMOUNT])._rawAmount.lt(1)) {
        throw new Error('Amount to convert is less than 1 satoshi.');
      }
      const dustValue = await window.bridge.redeem.getDustValue();
      const amountPolkaBtc = new BitcoinAmount(data[AMOUNT]);
      if (amountPolkaBtc.lte(dustValue)) {
        throw new Error(`Please enter an amount greater than Bitcoin dust (${displayMonetaryAmount(dustValue)} BTC)`);
      }
      await window.bridge.replace.request(amountPolkaBtc, collateralToken);

      const vaultId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, vaultAddress);
      queryClient.invalidateQueries([GENERIC_FETCHER, 'mapReplaceRequests', vaultId]);
      toast.success('Replacement request is submitted');
      onClose();
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  const validateAmount = (value: number): string | undefined => {
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
          {t('vault.request_replacement')}
        </InterlayModalTitle>
        <CloseIconButton ref={focusRef} onClick={onClose} />
        <form className='space-y-4' onSubmit={onSubmit}>
          <p>{t('vault.withdraw_your_collateral')}</p>
          <p>{t('vault.you_have')}</p>
          <p>
            {displayMonetaryAmount(collateralAmount)} {collateralToken.ticker}
          </p>
          <p>
            {t('locked')}{' '}
            {formatNumber(lockedBTC.toBig().toNumber(), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 8
            })}{' '}
            BTC
          </p>
          <p>{t('vault.replace_amount')}</p>
          <div>
            <NumberInput
              min={0}
              {...register(AMOUNT, {
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
