
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
import {
  ExchangeRate,
  Bitcoin,
  BitcoinUnit,
  Currency,
  BitcoinAmount
} from '@interlay/monetary-js';
import {
  CollateralUnit,
  newMonetaryAmount
} from '@interlay/interbtc-api';

import PriceInfo from 'pages/Bridge/PriceInfo';
import InterBTCField from '../InterBTCField';
import SubmitButton from '../SubmitButton';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  updateWrappedTokenBalanceAction,
  updateCollateralTokenBalanceAction,
  showAccountModalAction
} from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { BALANCE_MAX_INTEGER_LENGTH } from '../../../constants';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';

type BurnFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
}

const BurnForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();

  const {
    prices,
    bridgeLoaded,
    wrappedTokenBalance,
    collateralTokenBalance,
    parachainStatus,
    address
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<BurnFormData>({
    mode: 'onChange'
  });
  const wrappedTokenAmount = watch(WRAPPED_TOKEN_AMOUNT);

  const [burnRate, setBurnRate] = React.useState(
    new ExchangeRate<
      Currency<CollateralUnit>,
      CollateralUnit,
      Bitcoin,
      BitcoinUnit
    >(COLLATERAL_TOKEN, Bitcoin, new Big(0))
  );

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const theBurnRate = await window.bridge.interBtcApi.redeem.getBurnExchangeRate(COLLATERAL_TOKEN);
        setBurnRate(theBurnRate);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    bridgeLoaded,
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

    const onSubmit = async (data: BurnFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        await window.bridge.interBtcApi.redeem.burn(
          BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT]),
          COLLATERAL_TOKEN
        );
        // TODO: should not manually update the balances everywhere
        // - Should be able to watch the balances in one place and update the context accordingly.
        dispatch(
          updateWrappedTokenBalanceAction(wrappedTokenBalance.sub(BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT])))
        );
        const earnedCollateralTokenAmount =
          burnRate.toBase(BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT]) || BitcoinAmount.zero);
        dispatch(updateCollateralTokenBalanceAction(collateralTokenBalance.add(earnedCollateralTokenAmount)));
        toast.success(t('burn_page.successfully_burned'));
        reset({
          [WRAPPED_TOKEN_AMOUNT]: ''
        });
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: number): string | undefined => {
      // TODO: should use wrapped token amount type (e.g. InterBtcAmount or KBtcAmount)
      const bitcoinAmountValue = BitcoinAmount.from.BTC(value);

      if (bitcoinAmountValue.gt(wrappedTokenBalance)) {
        return `${t('redeem_page.current_balance')}${displayMonetaryAmount(wrappedTokenBalance)}`;
      }

      if (!bridgeLoaded) {
        return 'interBTC must be loaded!';
      }

      if (bitcoinAmountValue.to.Satoshi() === undefined) {
        return 'Invalid interBTC amount input!'; // TODO: should translate
      }

      const wrappedTokenAmountInteger = value.toString().split('.')[0];
      if (wrappedTokenAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
        return 'Input value is too high!'; // TODO: should translate
      }

      return undefined;
    };

    const parsedInterBTCAmount = BitcoinAmount.from.BTC(wrappedTokenAmount || 0);
    const earnedCollateralTokenAmount = burnRate.rate.eq(0) ?
      newMonetaryAmount(0, COLLATERAL_TOKEN) :
      burnRate.toBase(parsedInterBTCAmount || BitcoinAmount.zero);
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
            id='wrapped-token-amount'
            name={WRAPPED_TOKEN_AMOUNT}
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
            approxUSD={`≈ $ ${getUsdAmount(parsedInterBTCAmount || BitcoinAmount.zero, prices.bitcoin.usd)}`}
            error={!!errors[WRAPPED_TOKEN_AMOUNT]}
            helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message} />
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
            value={displayMonetaryAmount(earnedCollateralTokenAmount)}
            unitName='DOT'
            approxUSD={getUsdAmount(earnedCollateralTokenAmount, prices.collateralToken.usd)} />
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
            value={displayMonetaryAmount(earnedCollateralTokenAmount)}
            unitName='DOT'
            approxUSD={getUsdAmount(earnedCollateralTokenAmount, prices.collateralToken.usd)} />
          <SubmitButton
            // TODO: should not check everywhere like this
            disabled={
              parachainStatus === ParachainStatus.Loading ||
              parachainStatus === ParachainStatus.Shutdown
            }
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}>
            {accountSet ? t('burn') : t('connect_wallet')}
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
  }

  return null;
};

export default withErrorBoundary(BurnForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
