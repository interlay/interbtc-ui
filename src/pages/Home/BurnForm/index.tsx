
import * as React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { btcToSat } from '@interlay/interbtc';
import {
  ExchangeRate,
  Bitcoin,
  BTCUnit,
  Polkadot,
  PolkadotUnit,
  BTCAmount,
  PolkadotAmount
} from '@interlay/monetary-js';

import PriceInfo from 'pages/Home/PriceInfo';
import InterBTCField from '../InterBTCField';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import InterlayDenimContainedButton from 'components/buttons/InterlayDenimContainedButton';
import { getUsdAmount } from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  updateBalancePolkaBTCAction,
  updateBalanceDOTAction,
  showAccountModalAction
} from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { BALANCE_MAX_INTEGER_LENGTH } from '../../../constants';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

const INTER_BTC_AMOUNT = 'inter-btc-amount';

type BurnForm = {
  [INTER_BTC_AMOUNT]: string;
}

const Burn = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();

  const {
    prices,
    polkaBtcLoaded,
    balanceInterBTC,
    balanceDOT,
    parachainStatus,
    address
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<BurnForm>({
    mode: 'onChange'
  });
  const interBTCAmount = watch(INTER_BTC_AMOUNT);

  const [burnRate, setBurnRate] = React.useState(
    new ExchangeRate<Polkadot, PolkadotUnit, Bitcoin, BTCUnit>(Polkadot, Bitcoin, new Big(0))
  );

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const theBurnRate = await window.polkaBTC.redeem.getBurnExchangeRate();
        setBurnRate(theBurnRate);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    polkaBtcLoaded,
    handleError
  ]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayDenim-400' />
      </div>
    );
  }

  if (status === STATUSES.RESOLVED) {
    if (!burnRate) {
      throw new Error('Something went wrong!');
    }

    const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!accountSet) {
        dispatch(showAccountModalAction(true));
        event.preventDefault();
      }
    };

    const onSubmit = async (data: BurnForm) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        await window.polkaBTC.redeem.burn(BTCAmount.from.BTC(data[INTER_BTC_AMOUNT]));
        // TODO: should not manually update the balances everywhere
        // - Should be able to watch the balances in one place and update the context accordingly.
        dispatch(updateBalancePolkaBTCAction(balanceInterBTC.sub(BTCAmount.from.BTC(data[INTER_BTC_AMOUNT]))));
        const earnedDOT = burnRate.toBase(BTCAmount.from.BTC(data[INTER_BTC_AMOUNT]) || BTCAmount.zero);
        dispatch(updateBalanceDOTAction(balanceDOT.add(earnedDOT)));
        toast.success(t('burn_page.successfully_burned'));
        reset({
          [INTER_BTC_AMOUNT]: ''
        });
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: number): string | undefined => {
      // TODO: should be `big` type other than `Number`
      if (value > Number(balanceInterBTC)) {
        return `${t('redeem_page.current_balance')}${balanceInterBTC}`;
      }

      if (!polkaBtcLoaded) {
        return 'interBTC must be loaded!';
      }

      if (btcToSat(new Big(value)) === undefined) {
        return 'Invalid interBTC amount input!'; // TODO: should translate
      }

      const polkaBTCAmountInteger = value.toString().split('.')[0];
      if (polkaBTCAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
        return 'Input value is too high!'; // TODO: should translate
      }

      return undefined;
    };

    const parsedInterBTCAmount = BTCAmount.from.BTC(interBTCAmount || 0);
    const earnedDOT = burnRate.rate.eq(0) ?
      PolkadotAmount.zero :
      burnRate.toBase(parsedInterBTCAmount || BTCAmount.zero);
    const accountSet = !!address;

    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <h4
            className={clsx(
              'font-medium',
              'text-center',
              'text-interlayDenim'
            )}>
            {t('burn_page.burn_interbtc')}
          </h4>
          <InterBTCField
            id='polka-btc-amount'
            name={INTER_BTC_AMOUNT}
            type='number'
            label='interBTC'
            step='any'
            placeholder='0.00'
            ref={register({
              required: {
                value: true,
                message: t('burn_page.please_enter_the_amount')
              },
              validate: value => validateForm(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(parsedInterBTCAmount || BTCAmount.zero, prices.bitcoin.usd)}`}
            error={!!errors[INTER_BTC_AMOUNT]}
            helperText={errors[INTER_BTC_AMOUNT]?.message} />
          <PriceInfo
            title={
              <h5 className='text-textSecondary'>
                {t('burn_page.dot_earned')}
              </h5>
            }
            unitIcon={
              <PolkadotLogoIcon
                width={20}
                height={20} />
            }
            value={earnedDOT.toHuman()}
            unitName='DOT'
            approxUSD={getUsdAmount(earnedDOT, prices.polkadot.usd)} />
          {/* TODO: could componentize */}
          <hr
            className={clsx(
              'border-t-2',
              'my-2.5',
              'border-textSecondary'
            )} />
          <PriceInfo
            title={
              <h5 className='text-textPrimary'>
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={
              <PolkadotLogoIcon
                width={20}
                height={20} />
            }
            value={earnedDOT.toHuman()}
            unitName='DOT'
            approxUSD={getUsdAmount(earnedDOT, prices.polkadot.usd)} />
          <InterlayDenimContainedButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            // TODO: should not check everywhere like this
            disabled={
              parachainStatus === ParachainStatus.Loading ||
              parachainStatus === ParachainStatus.Shutdown
            }
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}>
            {accountSet ? t('burn') : t('connect_wallet')}
          </InterlayDenimContainedButton>
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
  }

  return null;
};

export default withErrorBoundary(Burn, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
