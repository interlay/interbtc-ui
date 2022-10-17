import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import FormTitle from '@/components/FormTitle';
import Hr2 from '@/components/hrs/Hr2';
import PriceInfo from '@/components/PriceInfo';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import SubmitButton from '@/components/SubmitButton';
import TokenField from '@/components/TokenField';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeTokenLogoIcon,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon
} from '@/config/relay-chains';
import { BALANCE_MAX_INTEGER_LENGTH } from '@/constants';
import { useSubstrateSecureState } from '@/lib/substrate';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';

type BurnFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
};

const BurnForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();

  const { selectedAccount } = useSubstrateSecureState();
  const { bridgeLoaded, parachainStatus } = useSelector((state: StoreType) => state.general);
  const { data: balances } = useGetBalances();

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
    new ExchangeRate<Bitcoin, CollateralCurrencyExt>(Bitcoin, RELAY_CHAIN_NATIVE_TOKEN, new Big(0))
  );
  const [burnableTokens, setBurnableTokens] = React.useState(BitcoinAmount.zero());

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
          window.bridge.redeem.getMaxBurnableTokens(RELAY_CHAIN_NATIVE_TOKEN)
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
        await window.bridge.redeem.burn(new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT]), RELAY_CHAIN_NATIVE_TOKEN);
        reset({
          [WRAPPED_TOKEN_AMOUNT]: ''
        });
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: string): string | undefined => {
      // TODO: should use wrapped token amount type (e.g. InterBtcAmount or KBtcAmount)
      const bitcoinAmountValue = new BitcoinAmount(value);

      if (bitcoinAmountValue.gt(burnableTokens)) {
        return `Only ${displayMonetaryAmount(burnableTokens)} ${WRAPPED_TOKEN_SYMBOL} available to burn.
        Please enter a smaller amount.`;
      }

      const wrappedTokenBalance = balances?.[WRAPPED_TOKEN.ticker].free || newMonetaryAmount(0, WRAPPED_TOKEN);

      if (bitcoinAmountValue.gt(wrappedTokenBalance)) {
        return `${t('redeem_page.current_balance')}${displayMonetaryAmount(wrappedTokenBalance)}`;
      }

      if (!bridgeLoaded) {
        return 'Bridge must be loaded!';
      }

      // Represents being less than 1 Satoshi
      if (bitcoinAmountValue._rawAmount.lt(1)) {
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

    const parsedInterBTCAmount = new BitcoinAmount(wrappedTokenAmount || 0);
    const earnedCollateralTokenAmount = burnRate.rate.eq(0)
      ? newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
      : burnRate.toCounter(parsedInterBTCAmount || BitcoinAmount.zero());
    const accountSet = !!selectedAccount;

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
            approxUSD={displayMonetaryAmountInUSDFormat(
              burnableTokens,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}
          />
          <TokenField
            id={WRAPPED_TOKEN_AMOUNT}
            label={WRAPPED_TOKEN_SYMBOL}
            {...register(WRAPPED_TOKEN_AMOUNT, {
              required: {
                value: true,
                message: t('burn_page.please_enter_the_amount')
              },
              validate: (value) => validateForm(value)
            })}
            approxUSD={`≈ ${displayMonetaryAmountInUSDFormat(
              parsedInterBTCAmount || BitcoinAmount.zero(),
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}`}
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
            approxUSD={displayMonetaryAmountInUSDFormat(
              earnedCollateralTokenAmount,
              getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
            )}
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
