
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
import { btcToSat } from '@interlay/polkabtc';

import PriceInfo from '../PriceInfo';
import PolkaBTCField from '../PolkaBTCField';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorHandler from 'components/ErrorHandler';
import InterlayButton from 'components/UI/InterlayButton';
import { getUsdAmount } from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  updateBalancePolkaBTCAction,
  updateBalanceDOTAction
} from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { BALANCE_MAX_INTEGER_LENGTH } from '../../../constants';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

const POLKA_BTC_AMOUNT = 'polka-btc-amount';

type BurnForm = {
  [POLKA_BTC_AMOUNT]: string;
}

const Burn = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [error, setError] = React.useState<Error | null>(null);

  const {
    prices,
    polkaBtcLoaded,
    balancePolkaBTC,
    balanceDOT,
    parachainStatus
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
  const polkaBTCAmount = watch(POLKA_BTC_AMOUNT);

  const [burnRate, setBurnRate] = React.useState<Big>();

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const theBurnRate = await window.polkaBTC.redeem.getBurnExchangeRate();
        setBurnRate(theBurnRate);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [polkaBtcLoaded]);

  if (status === STATUSES.REJECTED && error) {
    return (
      <ErrorHandler error={error} />
    );
  }

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayPomegranate-400' />
      </div>
    );
  }

  if (!burnRate) {
    throw new Error('Something went wrong!');
  }

  const onSubmit = async (data: BurnForm) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      await window.polkaBTC.redeem.burn(new Big(data[POLKA_BTC_AMOUNT]));
      // TODO: should not manually update the balances everywhere
      // - Should be able to watch the balances in one place and update the context accordingly.
      dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(data[POLKA_BTC_AMOUNT])).toString()));
      const earnedDOT = burnRate.times(data[POLKA_BTC_AMOUNT] || '0').toString();
      dispatch(updateBalanceDOTAction(new Big(balanceDOT).add(new Big(earnedDOT)).toString()));
      toast.success(t('burn_page.successfully_burned'));
      reset({
        [POLKA_BTC_AMOUNT]: ''
      });
      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validatePolkaBTCAmount = (value: number): string | undefined => {
    // TODO: should be `big` type other than `Number`
    if (value > Number(balancePolkaBTC)) {
      return `${t('redeem_page.current_balance')}${balancePolkaBTC}`;
    }

    if (!polkaBtcLoaded) {
      return 'PolkaBTC must be loaded!';
    }

    if (btcToSat(value.toString()) === undefined) {
      return 'Invalid PolkaBTC amount input!'; // TODO: should translate
    }

    const polkaBTCAmountInteger = value.toString().split('.')[0];
    if (polkaBTCAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
      return 'Input value is too high!'; // TODO: should translate
    }

    return undefined;
  };

  const earnedDOT = burnRate.times(polkaBTCAmount || '0').toString();

  if (status === STATUSES.RESOLVED) {
    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <h4
            className={clsx(
              'font-medium',
              'text-center',
              'text-interlayPomegranate'
            )}>
            {t('burn_page.burn_polkabtc')}
          </h4>
          <PolkaBTCField
            id='polka-btc-amount'
            name={POLKA_BTC_AMOUNT}
            type='number'
            label='PolkaBTC'
            step='any'
            placeholder='0.00'
            ref={register({
              required: {
                value: true,
                message: t('burn_page.please_enter_the_amount')
              },
              validate: value => validatePolkaBTCAmount(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(polkaBTCAmount || '0', prices.bitcoin.usd)}`}
            error={!!errors[POLKA_BTC_AMOUNT]}
            helperText={errors[POLKA_BTC_AMOUNT]?.message} />
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
            value={earnedDOT}
            unitName='DOT'
            approxUSD={getUsdAmount(earnedDOT, prices.polkadot.usd)} />
          {/* TODO: could be a reusable component */}
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
            value={earnedDOT}
            unitName='DOT'
            approxUSD={getUsdAmount(earnedDOT, prices.polkadot.usd)} />
          <InterlayButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            variant='contained'
            color='primary'
            // TODO: should not check everywhere like this
            disabled={
              parachainStatus === ParachainStatus.Loading ||
              parachainStatus === ParachainStatus.Shutdown
            }
            pending={submitStatus === STATUSES.PENDING}>
            {t('burn')}
          </InterlayButton>
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

export default Burn;
