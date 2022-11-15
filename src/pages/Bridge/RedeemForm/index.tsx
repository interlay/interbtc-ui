import { CollateralCurrencyExt, InterbtcPrimitivesVaultId, newMonetaryAmount, Redeem } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BitcoinLogoIcon } from '@/assets/img/bitcoin-logo.svg';
import { showAccountModalAction } from '@/common/actions/general.actions';
import { togglePremiumRedeemAction } from '@/common/actions/redeem.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import {
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  getRandomVaultIdWithCapacity
} from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import FormTitle from '@/components/FormTitle';
import Hr2 from '@/components/hrs/Hr2';
import PriceInfo from '@/components/PriceInfo';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import SubmitButton from '@/components/SubmitButton';
import TextField from '@/components/TextField';
import Toggle from '@/components/Toggle';
import TokenField from '@/components/TokenField';
import InformationTooltip from '@/components/tooltips/InformationTooltip';
import { BLOCKS_BEHIND_LIMIT } from '@/config/parachain';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeTokenLogoIcon,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import { BALANCE_MAX_INTEGER_LENGTH, BTC_ADDRESS_REGEX } from '@/constants';
import { useSubstrateSecureState } from '@/lib/substrate';
import ParachainStatusInfo from '@/pages/Bridge/ParachainStatusInfo';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getColorShade } from '@/utils/helpers/colors';
import { getExchangeRate } from '@/utils/helpers/oracle';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import SubmittedRedeemRequestModal from './SubmittedRedeemRequestModal';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';
const BTC_ADDRESS = 'btc-address';

type RedeemFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
  [BTC_ADDRESS]: string;
};

const RedeemForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const handleError = useErrorHandler();

  const usdPrice = getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd;
  const { selectedAccount } = useSubstrateSecureState();
  const { bridgeLoaded, bitcoinHeight, btcRelayHeight, parachainStatus } = useSelector(
    (state: StoreType) => state.general
  );
  const premiumRedeemSelected = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const { data: balances } = useGetBalances();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError
  } = useForm<RedeemFormData>({
    mode: 'onChange'
  });
  const wrappedTokenAmount = watch(WRAPPED_TOKEN_AMOUNT);

  const [dustValue, setDustValue] = React.useState(BitcoinAmount.zero());
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [redeemFee, setRedeemFee] = React.useState(BitcoinAmount.zero());
  const [redeemFeeRate, setRedeemFeeRate] = React.useState(new Big(0.005));
  const [btcToDotRate, setBtcToDotRate] = React.useState(
    new ExchangeRate<Bitcoin, CollateralCurrencyExt>(Bitcoin, RELAY_CHAIN_NATIVE_TOKEN, new Big(0))
  );
  const [hasPremiumRedeemVaults, setHasPremiumRedeemVaults] = React.useState<boolean>(false);
  const [maxRedeemableCapacity, setMaxRedeemableCapacity] = React.useState(BitcoinAmount.zero());
  const [premiumRedeemFee, setPremiumRedeemFee] = React.useState(new Big(0));
  const [currentInclusionFee, setCurrentInclusionFee] = React.useState(BitcoinAmount.zero());
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Redeem>();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!wrappedTokenAmount) return;
    if (!redeemFeeRate) return;

    const parsedWrappedTokenAmount = new BitcoinAmount(wrappedTokenAmount);
    const theRedeemFee = parsedWrappedTokenAmount.mul(redeemFeeRate);
    setRedeemFee(theRedeemFee);
  }, [bridgeLoaded, wrappedTokenAmount, redeemFeeRate]);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          dustValueResult,
          premiumRedeemVaultsResult,
          premiumRedeemFeeResult,
          btcToDotRateResult,
          redeemFeeRateResult,
          currentInclusionFeeResult,
          vaultsWithRedeemableTokens
        ] = await Promise.allSettled([
          window.bridge.redeem.getDustValue(),
          window.bridge.vaults.getPremiumRedeemVaults(),
          window.bridge.redeem.getPremiumRedeemFeeRate(),
          getExchangeRate(RELAY_CHAIN_NATIVE_TOKEN),
          window.bridge.redeem.getFeeRate(),
          window.bridge.redeem.getCurrentInclusionFee(),
          window.bridge.vaults.getVaultsWithRedeemableTokens()
        ]);

        if (dustValueResult.status === 'rejected') {
          throw new Error(dustValueResult.reason);
        }
        if (premiumRedeemFeeResult.status === 'rejected') {
          throw new Error(premiumRedeemFeeResult.reason);
        }
        if (redeemFeeRateResult.status === 'rejected') {
          throw new Error(redeemFeeRateResult.reason);
        }
        if (currentInclusionFeeResult.status === 'rejected') {
          throw new Error(currentInclusionFeeResult.reason);
        }
        if (btcToDotRateResult.status === 'rejected') {
          setFormError(WRAPPED_TOKEN_AMOUNT, {
            type: 'validate',
            message: t('error_oracle_offline', { action: 'redeem', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
          });
        }

        if (premiumRedeemVaultsResult.status === 'fulfilled' && premiumRedeemVaultsResult.value.size > 0) {
          // Premium redeem vaults are refetched on submission so we only need to set
          // true/false rather than keep them in state. No need to set false as this is
          // set as a default on render.
          setHasPremiumRedeemVaults(true);
        }
        if (vaultsWithRedeemableTokens.status === 'fulfilled') {
          // Find the vault with the largest capacity
          const initialMaxCapacity = vaultsWithRedeemableTokens.value.values().next().value;
          setMaxRedeemableCapacity(initialMaxCapacity);
        }
        if (btcToDotRateResult.status === 'fulfilled') {
          setBtcToDotRate(btcToDotRateResult.value);
        }

        setDustValue(dustValueResult.value);
        setPremiumRedeemFee(new Big(premiumRedeemFeeResult.value));
        setRedeemFeeRate(redeemFeeRateResult.value);
        setCurrentInclusionFee(currentInclusionFeeResult.value);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, handleError, setFormError, t]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return <PrimaryColorEllipsisLoader />;
  }

  if (status === STATUSES.RESOLVED) {
    const handleSubmittedRequestModalOpen = (newSubmittedRequest: Redeem) => {
      setSubmittedRequest(newSubmittedRequest);
    };
    const handleSubmittedRequestModalClose = () => {
      setSubmittedRequest(undefined);
    };

    const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!accountSet) {
        dispatch(showAccountModalAction(true));
        event.preventDefault();
      }
    };

    const onSubmit = async (data: RedeemFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        const wrappedTokenAmount = new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT]);

        // Differentiate between premium and regular redeem
        let vaultId: InterbtcPrimitivesVaultId;
        if (premiumRedeemSelected) {
          const premiumRedeemVaults = await window.bridge.vaults.getPremiumRedeemVaults();
          // Select a vault from the premium redeem vault list
          for (const [id, redeemableTokens] of premiumRedeemVaults) {
            if (redeemableTokens.gte(wrappedTokenAmount)) {
              vaultId = id;
              break;
            }
          }
          if (vaultId === undefined) {
            let maxAmount = BitcoinAmount.zero();
            for (const redeemableTokens of premiumRedeemVaults.values()) {
              if (maxAmount.lt(redeemableTokens)) {
                maxAmount = redeemableTokens;
              }
            }
            setFormError(WRAPPED_TOKEN_AMOUNT, {
              type: 'manual',
              message: t('redeem_page.error_max_premium_redeem', {
                maxPremiumRedeem: displayMonetaryAmount(maxAmount),
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })
            });

            return;
          }
        } else {
          const updatedVaults = await window.bridge.vaults.getVaultsWithRedeemableTokens();
          const updatedMaxCapacity = updatedVaults.values().next().value;

          if (wrappedTokenAmount.gte(updatedMaxCapacity)) {
            setFormError(WRAPPED_TOKEN_AMOUNT, {
              type: 'manual',
              message: t('redeem_page.request_exceeds_capacity', {
                maxRedeemableAmount: `${displayMonetaryAmount(maxRedeemableCapacity)} BTC`
              })
            });

            setSubmitStatus(STATUSES.RESOLVED);

            return;
          }

          vaultId = getRandomVaultIdWithCapacity(Array.from(updatedVaults || new Map()), wrappedTokenAmount);
        }

        // FIXME: workaround to make premium redeem still possible
        const relevantVaults = new Map<InterbtcPrimitivesVaultId, BitcoinAmount>();
        // FIXME: a bit of a dirty workaround with the capacity
        relevantVaults.set(vaultId, wrappedTokenAmount.mul(2));
        const result = await window.bridge.redeem.request(wrappedTokenAmount, data[BTC_ADDRESS], vaultId);

        // TODO: handle redeem aggregator
        const redeemRequest = result[0];
        handleSubmittedRequestModalOpen(redeemRequest);
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: string): string | undefined => {
      const parsedValue = new BitcoinAmount(value);

      const wrappedTokenBalance = balances?.[WRAPPED_TOKEN.ticker].free || newMonetaryAmount(0, WRAPPED_TOKEN);

      if (parsedValue.gt(wrappedTokenBalance)) {
        return `${t('redeem_page.current_balance')}${displayMonetaryAmount(wrappedTokenBalance)}`;
      }

      if (parsedValue.gte(maxRedeemableCapacity)) {
        return `${t('redeem_page.request_exceeds_capacity', {
          maxRedeemableAmount: `${maxRedeemableCapacity.toHuman(8)} ${ForeignAssetIdLiteral.BTC}`,
          redeemRequestAmount: `${parsedValue.toHuman()} ${ForeignAssetIdLiteral.BTC}`,
          btcIdLiteral: `${ForeignAssetIdLiteral.BTC}`
        })}`;
      }

      const parsedWrappedTokenAmount = new BitcoinAmount(value);
      const theRedeemFee = parsedWrappedTokenAmount.mul(redeemFeeRate);
      const minValue = dustValue.add(currentInclusionFee).add(theRedeemFee);

      if (parsedValue.lte(minValue)) {
        return `${t('redeem_page.amount_greater_dust_inclusion')}${displayMonetaryAmount(minValue)} BTC).`;
      }

      if (!selectedAccount) {
        return t('redeem_page.must_select_account_warning');
      }

      if (!bridgeLoaded) {
        return 'Bridge must be loaded!';
      }

      if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
        return t('redeem_page.error_more_than_6_blocks_behind', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        });
      }

      const polkaBTCAmountInteger = value.toString().split('.')[0];
      if (polkaBTCAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
        return 'Input value is too high!';
      }

      if (isOracleOffline) {
        return t('error_oracle_offline', { action: 'redeem', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL });
      }

      return undefined;
    };

    const handlePremiumRedeemToggle = () => {
      // TODO: should not use redux
      dispatch(togglePremiumRedeemAction(!premiumRedeemSelected));
    };

    const redeemFeeInBTC = redeemFee.toHuman(8);
    const redeemFeeInUSD = displayMonetaryAmountInUSDFormat(
      redeemFee,
      getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
    );
    const parsedInterBTCAmount = new BitcoinAmount(wrappedTokenAmount || 0);
    const totalBTC = wrappedTokenAmount
      ? parsedInterBTCAmount.sub(redeemFee).sub(currentInclusionFee)
      : BitcoinAmount.zero();
    const totalBTCInUSD = displayMonetaryAmountInUSDFormat(
      totalBTC,
      getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
    );

    const totalDOT = wrappedTokenAmount
      ? btcToDotRate.toCounter(parsedInterBTCAmount).mul(premiumRedeemFee)
      : newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN);
    const totalDOTInUSD = displayMonetaryAmountInUSDFormat(
      totalDOT,
      getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
    );

    const bitcoinNetworkFeeInBTC = currentInclusionFee.toHuman(8);
    const bitcoinNetworkFeeInUSD = displayMonetaryAmountInUSDFormat(
      currentInclusionFee,
      getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
    );
    const accountSet = !!selectedAccount;

    // `btcToDotRate` has 0 value only if oracle call fails
    const isOracleOffline = btcToDotRate.toBig().eq(0);

    return (
      <>
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('redeem_page.you_will_receive', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </FormTitle>
          <TokenField
            id={WRAPPED_TOKEN_AMOUNT}
            label={WRAPPED_TOKEN_SYMBOL}
            min={0}
            {...register(WRAPPED_TOKEN_AMOUNT, {
              required: {
                value: true,
                message: t('redeem_page.please_enter_amount')
              },
              validate: (value) => validateForm(value)
            })}
            approxUSD={`≈ ${displayMonetaryAmountInUSDFormat(parsedInterBTCAmount || BitcoinAmount.zero(), usdPrice)}`}
            error={!!errors[WRAPPED_TOKEN_AMOUNT]}
            helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message}
          />
          <ParachainStatusInfo status={parachainStatus} />
          <TextField
            id={BTC_ADDRESS}
            type='text'
            label='BTC Address'
            placeholder={t('enter_btc_address')}
            {...register(BTC_ADDRESS, {
              required: {
                value: true,
                message: t('redeem_page.enter_btc')
              },
              pattern: {
                value: BTC_ADDRESS_REGEX, // TODO: regex need to depend on global mainnet | testnet parameter
                message: t('redeem_page.valid_btc_address')
              }
            })}
            error={!!errors[BTC_ADDRESS]}
            helperText={errors[BTC_ADDRESS]?.message}
          />
          {hasPremiumRedeemVaults && (
            <div className={clsx('flex', 'justify-center', 'items-center', 'space-x-4')}>
              <div className={clsx('flex', 'items-center', 'space-x-1')}>
                <span>{t('redeem_page.premium_redeem')}</span>
                <InformationTooltip label={t('redeem_page.premium_redeem_info')} />
              </div>
              <Toggle checked={premiumRedeemSelected} onChange={handlePremiumRedeemToggle} />
            </div>
          )}
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
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={totalBTC.toHuman(8)}
            unitName='BTC'
            approxUSD={totalBTCInUSD}
          />
          <Hr2 className={clsx('border-t-2', 'my-2.5')} />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('bridge_fee')}
              </h5>
            }
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={redeemFeeInBTC}
            unitName='BTC'
            approxUSD={redeemFeeInUSD}
          />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('bitcoin_network_fee')}
              </h5>
            }
            unitIcon={<BitcoinLogoIcon width={23} height={23} />}
            value={bitcoinNetworkFeeInBTC}
            unitName='BTC'
            approxUSD={bitcoinNetworkFeeInUSD}
          />
          {premiumRedeemSelected && (
            <PriceInfo
              title={<h5 className={getColorShade('green')}>{t('redeem_page.earned_premium')}</h5>}
              unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
              value={displayMonetaryAmount(totalDOT)}
              unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
              approxUSD={totalDOTInUSD}
            />
          )}
          <SubmitButton
            disabled={parachainStatus !== ParachainStatus.Running}
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}
          >
            {accountSet ? t('confirm') : t('connect_wallet')}
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
        {submittedRequest && (
          <SubmittedRedeemRequestModal
            open={!!submittedRequest}
            onClose={handleSubmittedRequestModalClose}
            request={submittedRequest}
          />
        )}
      </>
    );
  }

  return null;
};

export default withErrorBoundary(RedeemForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
