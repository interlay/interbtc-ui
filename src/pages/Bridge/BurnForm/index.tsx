
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
import WrappedTokenField from '../WrappedTokenField';
import SubmitButton from '../SubmitButton';
import FormTitle from '../FormTitle';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import Hr2 from 'components/hrs/Hr2';
import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import STATUSES from 'utils/constants/statuses';
import { BALANCE_MAX_INTEGER_LENGTH } from '../../../constants';
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
  const wrappedTokenAmount = watch(WRAPPED_TOKEN_AMOUNT) || '0';

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
      <PrimaryColorEllipsisLoader />
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
        return 'Bridge must be loaded!';
      }

      if (bitcoinAmountValue.to.Satoshi() === undefined) {
        return t('burn_page.invalid_input_amount', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        });
      }

      // TODO: double-check if we need
      // - (https://discord.com/channels/745259537707040778/894390868964933692/894863394149109771)
      const wrappedTokenAmountInteger = value.toString().split('.')[0];
      if (wrappedTokenAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
        return 'Input value is too high!'; // TODO: should translate
      }

      return undefined;
    };

    // ray test touch <<
    const parsedWrappedTokenAmount = BitcoinAmount.from.BTC(wrappedTokenAmount);
    console.log('ray : ***** burnRate.rate.toString() => ', burnRate.rate.toString());
    console.log('ray : ***** parsedWrappedTokenAmount.toString() => ', parsedWrappedTokenAmount.toString());
    console.log('ray : ***** parsedWrappedTokenAmount.str.BTC() => ', parsedWrappedTokenAmount.str.BTC());
    console.log('ray : ***** burnRate.toString() => ', burnRate.toString());
    const earnedCollateralTokenAmount =
      burnRate.rate.eq(0) ?
        newMonetaryAmount(0, COLLATERAL_TOKEN) :
        burnRate.toBase(parsedWrappedTokenAmount);
    console.log('ray : ***** earnedCollateralTokenAmount.toString() => ', earnedCollateralTokenAmount.toString());
    // ray test touch >>
    const accountSet = !!address;

    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('burn_page.burn_interbtc', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL,
              collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
            })}
          </FormTitle>
          <WrappedTokenField
            id={WRAPPED_TOKEN_AMOUNT}
            name={WRAPPED_TOKEN_AMOUNT}
            label={WRAPPED_TOKEN_SYMBOL}
            ref={register({
              required: {
                value: true,
                message: t('burn_page.please_enter_the_amount')
              },
              validate: value => validateForm(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(parsedWrappedTokenAmount || BitcoinAmount.zero, prices.bitcoin.usd)}`}
            error={!!errors[WRAPPED_TOKEN_AMOUNT]}
            helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message} />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('burn_page.dot_earned', {
                  collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
                })}
              </h5>
            }
            unitIcon={
              <CollateralTokenLogoIcon width={20} />
            }
            value={displayMonetaryAmount(earnedCollateralTokenAmount)}
            unitName={COLLATERAL_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(earnedCollateralTokenAmount, prices.collateralToken.usd)} />
          <Hr2
            className={clsx(
              'border-t-2',
              'my-2.5'
            )} />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextPrimaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
                  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={
              <CollateralTokenLogoIcon width={20} />
            }
            value={displayMonetaryAmount(earnedCollateralTokenAmount)}
            unitName={COLLATERAL_TOKEN_SYMBOL}
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
