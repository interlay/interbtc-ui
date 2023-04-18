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
import { togglePremiumRedeemAction } from '@/common/actions/redeem.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { VaultApiType } from '@/common/types/vault.types';
import {
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  getRandomVaultIdWithCapacity
} from '@/common/utils/utils';
import { AuthCTA } from '@/components';
import { BLOCKS_BEHIND_LIMIT, DEFAULT_REDEEM_BRIDGE_FEE_RATE, DEFAULT_REDEEM_DUST_AMOUNT } from '@/config/parachain';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeTokenLogoIcon,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import { BALANCE_MAX_INTEGER_LENGTH, BTC_ADDRESS_REGEX } from '@/constants';
import AvailableBalanceUI from '@/legacy-components/AvailableBalanceUI';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ErrorModal from '@/legacy-components/ErrorModal';
import FormTitle from '@/legacy-components/FormTitle';
import Hr2 from '@/legacy-components/hrs/Hr2';
import PriceInfo from '@/legacy-components/PriceInfo';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import TextField from '@/legacy-components/TextField';
import Toggle from '@/legacy-components/Toggle';
import TokenField from '@/legacy-components/TokenField';
import InformationTooltip from '@/legacy-components/tooltips/InformationTooltip';
import ParachainStatusInfo from '@/pages/Bridge/ParachainStatusInfo';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getColorShade } from '@/utils/helpers/colors';
import { getExchangeRate } from '@/utils/helpers/oracle';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import ManualVaultSelectUI from '../ManualVaultSelectUI';
import SubmittedRedeemRequestModal from './SubmittedRedeemRequestModal';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';
const BTC_ADDRESS = 'btc-address';
const VAULT_SELECTION = 'vault-selection';

const BTC_ADDRESS_LABEL = 'BTC Address';

type RedeemFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
  [BTC_ADDRESS]: string;
  [VAULT_SELECTION]: string;
};

const RedeemForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const handleError = useErrorHandler();

  const usdPrice = getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd;
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
    setError,
    clearErrors
  } = useForm<RedeemFormData>({
    mode: 'onChange'
  });

  const wrappedTokenAmount = watch(WRAPPED_TOKEN_AMOUNT) || '0';

  const monetaryWrappedTokenAmount = React.useMemo(() => {
    return new BitcoinAmount(wrappedTokenAmount);
  }, [wrappedTokenAmount]);

  const [dustValue, setDustValue] = React.useState(new BitcoinAmount(DEFAULT_REDEEM_DUST_AMOUNT));
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [redeemFeeRate, setRedeemFeeRate] = React.useState(new Big(DEFAULT_REDEEM_BRIDGE_FEE_RATE));
  const [btcToRelayChainNativeTokenRate, setBtcToRelayChainNativeTokenRate] = React.useState(
    new ExchangeRate<Bitcoin, CollateralCurrencyExt>(Bitcoin, RELAY_CHAIN_NATIVE_TOKEN, new Big(0))
  );
  const [hasPremiumRedeemVaults, setHasPremiumRedeemVaults] = React.useState<boolean>(false);
  const [maxRedeemableCapacity, setMaxRedeemableCapacity] = React.useState(BitcoinAmount.zero());
  const [premiumRedeemFee, setPremiumRedeemFee] = React.useState(new Big(0));
  const [currentInclusionFee, setCurrentInclusionFee] = React.useState(BitcoinAmount.zero());
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Redeem>();

  const [selectVaultManually, setSelectVaultManually] = React.useState<boolean>(false);

  const [selectedVault, setSelectedVault] = React.useState<VaultApiType | undefined>();

  React.useEffect(() => {
    if (!monetaryWrappedTokenAmount) return;
    if (!maxRedeemableCapacity) return;

    if (monetaryWrappedTokenAmount.gt(maxRedeemableCapacity)) {
      setSelectVaultManually(false);
    }
  }, [monetaryWrappedTokenAmount, maxRedeemableCapacity]);

  React.useEffect(() => {
    if (!monetaryWrappedTokenAmount) return;
    if (!setError) return;
    if (!clearErrors) return;

    if (selectVaultManually && selectedVault === undefined) {
      setError(VAULT_SELECTION, { type: 'validate', message: t('issue_page.vault_must_be_selected') });
    } else if (selectVaultManually && selectedVault?.[1].lt(monetaryWrappedTokenAmount)) {
      setError(VAULT_SELECTION, { type: 'validate', message: t('issue_page.selected_vault_has_no_enough_capacity') });
    } else {
      clearErrors(VAULT_SELECTION);
    }
  }, [selectVaultManually, selectedVault, setError, clearErrors, t, monetaryWrappedTokenAmount]);

  const bridgeFee = monetaryWrappedTokenAmount.mul(redeemFeeRate);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          dustValueResult,
          premiumRedeemVaultsResult,
          premiumRedeemFeeRateResult,
          btcToRelayChainNativeTokenRateResult,
          feeRateResult,
          currentInclusionFeeResult,
          vaultsWithRedeemableTokensResult
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
        if (premiumRedeemFeeRateResult.status === 'rejected') {
          throw new Error(premiumRedeemFeeRateResult.reason);
        }
        if (feeRateResult.status === 'rejected') {
          throw new Error(feeRateResult.reason);
        }
        if (currentInclusionFeeResult.status === 'rejected') {
          throw new Error(currentInclusionFeeResult.reason);
        }
        if (btcToRelayChainNativeTokenRateResult.status === 'rejected') {
          setError(WRAPPED_TOKEN_AMOUNT, {
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
        if (
          vaultsWithRedeemableTokensResult.status === 'fulfilled' &&
          vaultsWithRedeemableTokensResult.value.size > 0
        ) {
          // Find the vault with the largest capacity
          const theMaxRedeemableCapacity = vaultsWithRedeemableTokensResult.value.values().next().value;
          setMaxRedeemableCapacity(theMaxRedeemableCapacity);
        }
        if (btcToRelayChainNativeTokenRateResult.status === 'fulfilled') {
          setBtcToRelayChainNativeTokenRate(btcToRelayChainNativeTokenRateResult.value);
        }

        setDustValue(dustValueResult.value);
        setPremiumRedeemFee(new Big(premiumRedeemFeeRateResult.value));
        setRedeemFeeRate(feeRateResult.value);
        setCurrentInclusionFee(currentInclusionFeeResult.value);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, handleError, setError, t]);

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

    const handleSelectVaultCheckboxChange = () => {
      if (!isSelectVaultCheckboxDisabled) {
        setSelectVaultManually((prev) => !prev);
      }
    };

    const onSubmit = async (data: RedeemFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        const monetaryWrappedTokenAmount = new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT]);

        // Differentiate between premium and regular redeem
        let vaultId: InterbtcPrimitivesVaultId;
        if (premiumRedeemSelected) {
          const premiumRedeemVaults = await window.bridge.vaults.getPremiumRedeemVaults();
          // Select a vault from the premium redeem vault list
          for (const [id, redeemableTokenAmount] of premiumRedeemVaults) {
            if (redeemableTokenAmount.gte(monetaryWrappedTokenAmount)) {
              vaultId = id;
              break;
            }
          }
          if (vaultId === undefined) {
            let maxAmount = BitcoinAmount.zero();
            for (const redeemableTokenAmount of premiumRedeemVaults.values()) {
              if (maxAmount.lt(redeemableTokenAmount)) {
                maxAmount = redeemableTokenAmount;
              }
            }
            setError(WRAPPED_TOKEN_AMOUNT, {
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

          if (monetaryWrappedTokenAmount.gte(updatedMaxCapacity)) {
            setError(WRAPPED_TOKEN_AMOUNT, {
              type: 'manual',
              message: t('redeem_page.request_exceeds_capacity', {
                maxRedeemableAmount: `${displayMonetaryAmount(maxRedeemableCapacity)} BTC`
              })
            });

            setSubmitStatus(STATUSES.RESOLVED);

            return;
          }

          if (selectVaultManually) {
            if (!selectedVault) {
              throw new Error('Specific vault is not selected!');
            }
            vaultId = selectedVault[0];
          } else {
            vaultId = getRandomVaultIdWithCapacity(Array.from(updatedVaults || new Map()), monetaryWrappedTokenAmount);
          }
        }

        // FIXME: workaround to make premium redeem still possible
        const relevantVaults = new Map<InterbtcPrimitivesVaultId, BitcoinAmount>();
        // FIXME: a bit of a dirty workaround with the capacity
        relevantVaults.set(vaultId, monetaryWrappedTokenAmount.mul(2));
        const result = await window.bridge.redeem.request(monetaryWrappedTokenAmount, data[BTC_ADDRESS], vaultId);

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
      const monetaryValue = new BitcoinAmount(value);

      const wrappedTokenBalance = balances?.[WRAPPED_TOKEN.ticker].free || newMonetaryAmount(0, WRAPPED_TOKEN);
      if (monetaryValue.gt(wrappedTokenBalance)) {
        return `${t('redeem_page.current_balance')}${displayMonetaryAmount(wrappedTokenBalance)}`;
      }

      if (monetaryValue.gt(maxRedeemableCapacity)) {
        return `${t('redeem_page.request_exceeds_capacity', {
          maxRedeemableAmount: `${maxRedeemableCapacity.toHuman(8)} ${ForeignAssetIdLiteral.BTC}`,
          btcIdLiteral: `${ForeignAssetIdLiteral.BTC}`
        })}`;
      }

      const bridgeFee = monetaryValue.mul(redeemFeeRate);
      const minValue = dustValue.add(currentInclusionFee).add(bridgeFee);
      if (monetaryValue.lte(minValue)) {
        return `${t('redeem_page.amount_greater_dust_inclusion')}${displayMonetaryAmount(minValue)} BTC).`;
      }

      if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
        return t('redeem_page.error_more_than_6_blocks_behind', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        });
      }

      const wrappedTokenAmountInteger = value.toString().split('.')[0];
      if (wrappedTokenAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
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

    const bridgeFeeInBTC = bridgeFee.toHuman(8);
    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(
      bridgeFee,
      getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
    );

    const total = monetaryWrappedTokenAmount.gt(bridgeFee.add(currentInclusionFee))
      ? monetaryWrappedTokenAmount.sub(bridgeFee).sub(currentInclusionFee)
      : BitcoinAmount.zero();
    const totalInBTC = total.toHuman(8);
    const totalInUSD = displayMonetaryAmountInUSDFormat(total, getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd);

    const totalRelayChainNativeToken = monetaryWrappedTokenAmount.gt(BitcoinAmount.zero())
      ? btcToRelayChainNativeTokenRate.toCounter(monetaryWrappedTokenAmount).mul(premiumRedeemFee)
      : newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN);
    const totalRelayChainNativeTokenInUSD = displayMonetaryAmountInUSDFormat(
      totalRelayChainNativeToken,
      getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
    );

    const bitcoinNetworkFeeInBTC = currentInclusionFee.toHuman(8);
    const bitcoinNetworkFeeInUSD = displayMonetaryAmountInUSDFormat(
      currentInclusionFee,
      getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
    );

    // `btcToDotRate` has 0 value only if oracle call fails
    const isOracleOffline = btcToRelayChainNativeTokenRate.toBig().eq(0);

    const isSelectVaultCheckboxDisabled = monetaryWrappedTokenAmount.gt(maxRedeemableCapacity);

    return (
      <>
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('redeem_page.you_will_receive', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </FormTitle>
          <div>
            <AvailableBalanceUI
              data-testid='single-max-redeemable'
              label={t('redeem_page.maximum_in_single_request')}
              balance={displayMonetaryAmount(maxRedeemableCapacity)}
              tokenSymbol={WRAPPED_TOKEN_SYMBOL}
            />
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
              approxUSD={`≈ ${displayMonetaryAmountInUSDFormat(monetaryWrappedTokenAmount, usdPrice)}`}
              error={!!errors[WRAPPED_TOKEN_AMOUNT]}
              helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message}
            />
          </div>
          <ParachainStatusInfo status={parachainStatus} />
          {!premiumRedeemSelected && (
            <ManualVaultSelectUI
              disabled={isSelectVaultCheckboxDisabled}
              checked={selectVaultManually}
              treasuryAction='redeem'
              requiredCapacity={monetaryWrappedTokenAmount}
              error={errors[VAULT_SELECTION]}
              onSelectionCallback={setSelectedVault}
              onCheckboxChange={handleSelectVaultCheckboxChange}
            />
          )}
          <TextField
            id={BTC_ADDRESS}
            type='text'
            label={BTC_ADDRESS_LABEL}
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
            dataTestId='total-receiving-amount'
            value={totalInBTC}
            unitName='BTC'
            approxUSD={totalInUSD}
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
            dataTestId='redeem-bridge-fee'
            value={bridgeFeeInBTC}
            unitName='BTC'
            approxUSD={bridgeFeeInUSD}
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
            dataTestId='redeem-bitcoin-network-fee'
            value={bitcoinNetworkFeeInBTC}
            unitName='BTC'
            approxUSD={bitcoinNetworkFeeInUSD}
          />
          {premiumRedeemSelected && (
            <PriceInfo
              title={<h5 className={getColorShade('green')}>{t('redeem_page.earned_premium')}</h5>}
              unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
              value={displayMonetaryAmount(totalRelayChainNativeToken)}
              unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
              approxUSD={totalRelayChainNativeTokenInUSD}
            />
          )}
          <AuthCTA
            fullWidth
            size='large'
            type='submit'
            disabled={parachainStatus !== ParachainStatus.Running}
            loading={submitStatus === STATUSES.PENDING}
          >
            {t('confirm')}
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

export { BTC_ADDRESS_LABEL };

export default withErrorBoundary(RedeemForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
