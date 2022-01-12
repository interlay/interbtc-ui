
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { newMonetaryAmount, CurrencyUnit } from '@interlay/interbtc-api';
import { Currency } from '@interlay/monetary-js';

import TokenAmountField from '../TokenAmountField';
import {
  Balances,
  TokenOption
} from '../../../parts/Topbar/Balances';
import SubmitButton from '../SubmitButton';
import FormTitle from '../FormTitle';
import TextField from 'components/TextField';
import ErrorModal from 'components/ErrorModal';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';

const TRANSFER_AMOUNT = 'wrapped-token-input-amount';
const RECIPIENT_ADDRESS = 'collateral-token-address';

type TransferFormData = {
  [TRANSFER_AMOUNT]: string;
  [RECIPIENT_ADDRESS]: string;
}

const TransferForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    parachainStatus,
    address
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TransferFormData>({
    mode: 'onChange'
  });

  const [activeToken, setActiveToken] = React.useState<TokenOption | undefined>(undefined);
  const [accountSet, setAccountSet] = React.useState<boolean | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const onSubmit = async (data: TransferFormData) => {
    if (!activeToken) return;

    try {
      setSubmitStatus(STATUSES.PENDING);

      await window.bridge.interBtcApi.tokens.transfer(
        data[RECIPIENT_ADDRESS],
        newMonetaryAmount(data[TRANSFER_AMOUNT], activeToken.token as Currency<CurrencyUnit>, true)
      );

      setSubmitStatus(STATUSES.RESOLVED);

      toast.success(t('transfer_page.successfully_transferred'));

      reset({
        [TRANSFER_AMOUNT]: '',
        [RECIPIENT_ADDRESS]: ''
      });
    } catch (error: any) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validateForm = React.useCallback((value: number): string | undefined => {
    if (!activeToken) return;

    // TODO: convert to newMonetaryAmount and check that instead of string
    return parseFloat(activeToken.balance) < value ? t('insufficient_funds') : undefined;
  }, [activeToken, t]);

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!accountSet) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  const handleTokenChange = (token: any) => {
    setActiveToken(token);
  };

  React.useEffect(() => {
    setAccountSet(!!address);
  }, [address]);

  React.useEffect(() => {
    reset({
      [TRANSFER_AMOUNT]: ''
    });
  }, [activeToken, reset]);

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>
          {t('transfer_page.transfer_currency')}
        </FormTitle>
        <div>
          <p
            className={clsx(
              'text-right',
              { 'text-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiOchre':
        process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>Balance: {activeToken?.balance}
          </p>
          <div
            className={clsx(
              'flex',
              'gap-2'
            )}>
            {/* TODO: use forwardRef to pull in select value as form data */}
            <Balances
              variant='formField'
              showBalances={false}
              callbackFunction={handleTokenChange} />
            <TokenAmountField
              id={TRANSFER_AMOUNT}
              name={TRANSFER_AMOUNT}
              ref={register({
                required: {
                  value: true,
                  message: t('redeem_page.please_enter_amount')
                },
                validate: value => validateForm(value)
              })}
              error={!!errors[TRANSFER_AMOUNT]}
              helperText={errors[TRANSFER_AMOUNT]?.message} />
          </div>
        </div>
        <div>
          <TextField
            id={RECIPIENT_ADDRESS}
            name={RECIPIENT_ADDRESS}
            type='text'
            label={t('recipient')}
            placeholder={t('recipient_account')}
            ref={register({
              required: {
                value: true,
                message: t('enter_recipient_address')
              }
            })}
            error={!!errors[RECIPIENT_ADDRESS]}
            helperText={errors[RECIPIENT_ADDRESS]?.message} />
        </div>
        <SubmitButton
          disabled={
            parachainStatus !== ParachainStatus.Running
          }
          pending={submitStatus === STATUSES.PENDING}
          onClick={handleConfirmClick}>
          {accountSet ? (
            t('transfer')
          ) : (
            t('connect_wallet')
          )}
        </SubmitButton>
      </form>
      {(submitStatus === STATUSES.REJECTED && submitError) && (
        <ErrorModal
          open={!!submitError}
          onClose={() => {
            setSubmitStatus(STATUSES.IDLE);
            setSubmitError(null);
          }}
          title='Error'
          description={
            typeof submitError === 'string' ?
              submitError :
              submitError.message
          } />
      )}
    </>
  );
};

export default TransferForm;
