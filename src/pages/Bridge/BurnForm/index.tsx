import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { ExchangeRate, Bitcoin, BitcoinUnit, Currency, BitcoinAmount } from '@interlay/monetary-js';
import { CollateralCurrency, CollateralUnit, newMonetaryAmount } from '@interlay/interbtc-api';

import PriceInfo from 'pages/Bridge/PriceInfo';
import TokenField from 'components/TokenField';
import SubmitButton from 'components/SubmitButton';
import FormTitle from 'components/FormTitle';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import Hr2 from 'components/hrs/Hr2';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeTokenLogoIcon,
  WrappedTokenLogoIcon
} from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import STATUSES from 'utils/constants/statuses';
import { BALANCE_MAX_INTEGER_LENGTH } from '../../../constants';
import { getUsdAmount, displayMonetaryAmount } from 'common/utils/utils';
import { StoreType, ParachainStatus } from 'common/types/util.types';
import {
  updateWrappedTokenBalanceAction,
  updateCollateralTokenBalanceAction,
  showAccountModalAction
} from 'common/actions/general.actions';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';

type BurnFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
};

const BurnForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();

  const { prices, bridgeLoaded, wrappedTokenBalance, collateralTokenBalance, parachainStatus, address } = useSelector(
    (state: StoreType) => state.general
  );

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
    new ExchangeRate<Bitcoin, BitcoinUnit, Currency<CollateralUnit>, CollateralUnit>(
      Bitcoin,
      RELAY_CHAIN_NATIVE_TOKEN,
      new Big(0)
    )
  );
  const [burnableTokens, setBurnableTokens] = React.useState(BitcoinAmount.zero);

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [theBurnRate, theBurnableTokens] = await Promise.all([
          window.bridge.redeem.getBurnExchangeRate(RELAY_CHAIN_NATIVE_TOKEN),
          window.bridge.redeem.getMaxBurnableTokens(RELAY_CHAIN_NATIVE_TOKEN as CollateralCurrency)
        ]);
        setBurnRate(theBurnRate);
        setBurnableTokens(theBurnableTokens);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, handleError]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return <PrimaryColorEllipsisLoader />;
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
        await window.bridge.redeem.burn(
          BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT]),
          RELAY_CHAIN_NATIVE_TOKEN as CollateralCurrency
        );
        // TODO: should not manually update the balances everywhere
        // - Should be able to watch the balances in one place and update the context accordingly.
        dispatch(
          updateWrappedTokenBalanceAction(wrappedTokenBalance.sub(BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT])))
        );
        const earnedCollateralTokenAmount = burnRate.toCounter(
          BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT]) || BitcoinAmount.zero
        );
        dispatch(updateCollateralTokenBalanceAction(collateralTokenBalance.add(earnedCollateralTokenAmount)));
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

      if (bitcoinAmountValue.gt(burnableTokens)) {
        return `Only ${displayMonetaryAmount(burnableTokens)} ${WRAPPED_TOKEN_SYMBOL} available to burn.
        Please enter a smaller amount.`;
      }

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

    const parsedInterBTCAmount = BitcoinAmount.from.BTC(wrappedTokenAmount || 0);
    const earnedCollateralTokenAmount = burnRate.rate.eq(0)
      ? newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
      : burnRate.toCounter(parsedInterBTCAmount || BitcoinAmount.zero);
    const accountSet = !!address;

    return (
      <>
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('burn_page.burn_interbtc', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL,
              collateralTokenSymbol: RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
            })}
          </FormTitle>
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('burn_page.available', {
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })}
              </h5>
            }
            unitIcon={<WrappedTokenLogoIcon width={20} />}
            value={displayMonetaryAmount(burnableTokens)}
            unitName={WRAPPED_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(burnableTokens, prices.bitcoin?.usd).toString()}
          />
          <TokenField
            id={WRAPPED_TOKEN_AMOUNT}
            name={WRAPPED_TOKEN_AMOUNT}
            label={WRAPPED_TOKEN_SYMBOL}
            ref={register({
              required: {
                value: true,
                message: t('burn_page.please_enter_the_amount')
              },
              validate: (value) => validateForm(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(parsedInterBTCAmount || BitcoinAmount.zero, prices.bitcoin?.usd)}`}
            error={!!errors[WRAPPED_TOKEN_AMOUNT]}
            helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message}
          />
          <Hr2 className={clsx('border-t-2', 'my-2.5')} />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
            value={displayMonetaryAmount(earnedCollateralTokenAmount)}
            unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(earnedCollateralTokenAmount, prices.relayChainNativeToken?.usd)}
          />
          <SubmitButton
            // TODO: should not check everywhere like this
            disabled={parachainStatus === ParachainStatus.Loading || parachainStatus === ParachainStatus.Shutdown}
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}
          >
            {accountSet ? t('burn') : t('connect_wallet')}
          </SubmitButton>
        </form>
        {submitStatus === STATUSES.REJECTED && submitError && (
          <ErrorModal
            open={!!submitError}
            onClose={() => {
              setSubmitStatus(STATUSES.IDLE);
              setSubmitError(null);
            }}
            title='Error'
            description={typeof submitError === 'string' ? submitError : submitError.message}
          />
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
