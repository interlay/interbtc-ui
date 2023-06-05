import { newMonetaryAmount } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { formatNumber } from '@/common/utils/utils';
import { AuthCTA } from '@/components';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import FormTitle from '@/legacy-components/FormTitle';
import TextField from '@/legacy-components/TextField';
import Tokens, { TokenOption } from '@/legacy-components/Tokens';
import InterlayButtonBase from '@/legacy-components/UI/InterlayButtonBase';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import isValidPolkadotAddress from '@/utils/helpers/is-valid-polkadot-address';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';

import TokenAmountField from '../TokenAmountField';

const TRANSFER_AMOUNT = 'transfer-amount';
const RECIPIENT_ADDRESS = 'recipient-address';

type TransferFormData = {
  [TRANSFER_AMOUNT]: string;
  [RECIPIENT_ADDRESS]: string;
};

const TransferForm = (): JSX.Element => {
  const { t } = useTranslation();

  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<TransferFormData>({
    mode: 'onChange'
  });

  const [activeToken, setActiveToken] = React.useState<TokenOption | undefined>(undefined);

  const transaction = useTransaction(Transaction.TOKENS_TRANSFER, {
    onSigning: () => {
      reset({
        [TRANSFER_AMOUNT]: '',
        [RECIPIENT_ADDRESS]: ''
      });
    }
  });

  const onSubmit = async (data: TransferFormData) => {
    if (!activeToken) return;
    if (data[TRANSFER_AMOUNT] === undefined) return;

    transaction.execute(data[RECIPIENT_ADDRESS], newMonetaryAmount(data[TRANSFER_AMOUNT], activeToken.token, true));
  };

  const validateTransferAmount = React.useCallback(
    (value: string): string | undefined => {
      if (!activeToken) return;

      const balance = newMonetaryAmount(activeToken.transferableBalance, activeToken.token, true);
      const transferAmount = newMonetaryAmount(value, activeToken.token, true);

      return balance.lt(transferAmount) ? t('insufficient_funds') : undefined;
    },
    [activeToken, t]
  );

  const validateAddress = React.useCallback(
    (address: string): string | undefined => {
      return isValidPolkadotAddress(address) ? undefined : t('validation.invalid_polkadot_address');
    },
    [t]
  );

  const handleTokenChange = (token: any) => {
    setActiveToken(token);
  };

  const handleClickBalance = () => setValue(TRANSFER_AMOUNT, activeToken?.transferableBalance || '');

  return (
    <>
      <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>{t('transfer_page.transfer_currency')}</FormTitle>
        <div>
          <p
            className={clsx(
              'mb-2',
              'text-right',
              { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            Transferable balance:
            <InterlayButtonBase className={clsx('ml-1')} type='button' onClick={handleClickBalance}>
              {activeToken?.transferableBalance
                ? formatNumber(Number(activeToken.transferableBalance), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 5
                  })
                : 0}
            </InterlayButtonBase>
          </p>
          <div className={clsx('flex', 'gap-2')}>
            {/* TODO: use forwardRef to pull in select value as form data */}
            <Tokens variant='formField' showBalances={false} callbackFunction={handleTokenChange} />
            <TokenAmountField
              id={TRANSFER_AMOUNT}
              {...register(TRANSFER_AMOUNT, {
                required: {
                  value: true,
                  message: t('redeem_page.please_enter_amount')
                },
                validate: (value) => validateTransferAmount(value)
              })}
              error={!!errors[TRANSFER_AMOUNT]}
              helperText={errors[TRANSFER_AMOUNT]?.message}
            />
          </div>
        </div>
        <div>
          <TextField
            id={RECIPIENT_ADDRESS}
            type='text'
            label={t('recipient')}
            placeholder={t('recipient_account')}
            {...register(RECIPIENT_ADDRESS, {
              required: {
                value: true,
                message: t('enter_recipient_address')
              },
              validate: (value) => validateAddress(value)
            })}
            error={!!errors[RECIPIENT_ADDRESS]}
            helperText={errors[RECIPIENT_ADDRESS]?.message}
          />
        </div>
        <AuthCTA
          fullWidth
          size='large'
          type='submit'
          disabled={parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)}
        >
          {t('transfer')}
        </AuthCTA>
      </form>
    </>
  );
};

export default withErrorBoundary(TransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
