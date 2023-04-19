import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, Currency, ExchangeRate, MonetaryAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CoinIcon } from '@/component-library';
import { AuthCTA } from '@/components';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL, WrappedTokenLogoIcon } from '@/config/relay-chains';
import { BALANCE_MAX_INTEGER_LENGTH } from '@/constants';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ErrorModal from '@/legacy-components/ErrorModal';
import FormTitle from '@/legacy-components/FormTitle';
import Hr2 from '@/legacy-components/hrs/Hr2';
import PriceInfo from '@/legacy-components/PriceInfo';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import TokenField from '@/legacy-components/TokenField';
import Tokens, { TokenOption } from '@/legacy-components/Tokens';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCollateralCurrencies } from '@/utils/hooks/api/use-get-collateral-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';

type BurnFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
};

type BurnableCollateral = {
  currency: Currency;
  burnableTokens: MonetaryAmount<CurrencyExt>;
  burnRate: ExchangeRate<Currency, CollateralCurrencyExt>;
};

const BurnForm = (): JSX.Element | null => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();

  const { bridgeLoaded, parachainStatus } = useSelector((state: StoreType) => state.general);
  const { data: balances } = useGetBalances();
  const { data: collateralCurrencies } = useGetCollateralCurrencies(bridgeLoaded);

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

  const [totalBurnableTokens, setTotalBurnableTokens] = React.useState(BitcoinAmount.zero());

  const [burnableCollateral, setBurnableCollateral] = React.useState<BurnableCollateral[]>();
  const [selectedCollateral, setSelectedCollateral] = React.useState<BurnableCollateral>();

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const handleUpdateCollateral = (collateral: TokenOption) => {
    const selectedCollateral = burnableCollateral?.find(
      (token: BurnableCollateral) => token.currency.ticker === collateral.token.ticker
    );

    setSelectedCollateral(selectedCollateral);
  };

  React.useEffect(() => {
    if (!burnableCollateral) return;

    const totalBurnable = burnableCollateral.reduce(
      (total: MonetaryAmount<Bitcoin>, collateral: BurnableCollateral) => total.add(collateral.burnableTokens),
      new MonetaryAmount(Bitcoin, 0)
    );

    setTotalBurnableTokens(totalBurnable);
  }, [burnableCollateral]);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;
    if (!collateralCurrencies) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);

        const collateralData: BurnableCollateral[] = await Promise.all(
          collateralCurrencies.map(async (currency: CollateralCurrencyExt) => {
            const burnableTokens = await window.bridge.redeem.getMaxBurnableTokens(currency);

            const burnRate = burnableTokens.gt(BitcoinAmount.zero())
              ? await window.bridge.redeem.getBurnExchangeRate(currency)
              : undefined;

            return { currency, burnableTokens, burnRate } as BurnableCollateral;
          })
        );

        const filteredCollateral = collateralData.filter((item) => item.burnRate);

        setBurnableCollateral(filteredCollateral);
        setSelectedCollateral(filteredCollateral[0]);

        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, collateralCurrencies, handleError]);

  // This ensures that triggering the notification and clearing
  // the form happen at the same time.
  React.useEffect(() => {
    if (submitStatus !== STATUSES.RESOLVED) return;

    toast.success(t('burn_page.successfully_burned'));

    reset({
      [WRAPPED_TOKEN_AMOUNT]: ''
    });
  }, [submitStatus, reset, t]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return <PrimaryColorEllipsisLoader />;
  }

  if (status === STATUSES.RESOLVED && selectedCollateral) {
    if (!selectedCollateral.burnRate) {
      throw new Error('Something went wrong!');
    }

    const onSubmit = async (data: BurnFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        await window.bridge.redeem.burn(new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT]), selectedCollateral.currency);

        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: string): string | undefined => {
      // TODO: should use wrapped token amount type (e.g. InterBtcAmount or KBtcAmount)
      const bitcoinAmountValue = new BitcoinAmount(value);

      if (bitcoinAmountValue.gt(selectedCollateral.burnableTokens)) {
        return `Only ${selectedCollateral.burnableTokens.toString()} ${WRAPPED_TOKEN_SYMBOL} available to burn.
        Please enter a smaller amount.`;
      }

      const wrappedTokenBalance = balances?.[WRAPPED_TOKEN.ticker].transferable || newMonetaryAmount(0, WRAPPED_TOKEN);

      if (bitcoinAmountValue.gt(wrappedTokenBalance)) {
        return `${t('redeem_page.current_balance')}${wrappedTokenBalance.toString()}`;
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

    const earnedCollateralTokenAmount = selectedCollateral.burnRate.rate.eq(0)
      ? newMonetaryAmount(0, selectedCollateral.currency)
      : selectedCollateral.burnRate.toCounter(parsedInterBTCAmount || BitcoinAmount.zero());

    return (
      <>
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('burn_page.burn_interbtc', {
              collateralTokenSymbol: selectedCollateral.currency.ticker
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
                {t('burn_page.available_total', {
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })}
              </h5>
            }
            unitIcon={<WrappedTokenLogoIcon width={20} />}
            value={totalBurnableTokens.toString()}
            unitName={WRAPPED_TOKEN_SYMBOL}
            approxUSD={displayMonetaryAmountInUSDFormat(
              totalBurnableTokens,
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
          <Tokens
            label={t('burn_page.collateral_selector_label')}
            tickers={burnableCollateral?.map((collateral: BurnableCollateral) => collateral.currency.ticker)}
            variant='formField'
            showBalances={false}
            callbackFunction={handleUpdateCollateral}
            fullWidth={true}
          />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('burn_page.available_from_collateral', {
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL,
                  collateralTokenSymbol: selectedCollateral.currency.ticker
                })}
              </h5>
            }
            unitIcon={<WrappedTokenLogoIcon width={20} />}
            value={selectedCollateral.burnableTokens.toString()}
            unitName={WRAPPED_TOKEN_SYMBOL}
            approxUSD={displayMonetaryAmountInUSDFormat(
              selectedCollateral.burnableTokens,
              getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
            )}
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
            unitIcon={<CoinIcon ticker={selectedCollateral.currency.ticker} width={20} />}
            value={earnedCollateralTokenAmount.toString()}
            unitName={selectedCollateral.currency.ticker}
            approxUSD={displayMonetaryAmountInUSDFormat(
              earnedCollateralTokenAmount,
              getTokenPrice(prices, selectedCollateral.currency.ticker)?.usd
            )}
          />

          <AuthCTA
            fullWidth
            size='large'
            type='submit'
            loading={submitStatus === STATUSES.PENDING}
            disabled={parachainStatus === ParachainStatus.Loading || parachainStatus === ParachainStatus.Shutdown}
          >
            {t('burn')}
          </AuthCTA>
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
