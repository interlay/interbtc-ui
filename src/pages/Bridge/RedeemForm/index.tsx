
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import {
  Redeem,
  CollateralUnit,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import {
  Bitcoin,
  BitcoinAmount,
  BitcoinUnit,
  ExchangeRate,
  Currency
} from '@interlay/monetary-js';

import SubmitButton from 'components/SubmitButton';
import FormTitle from 'components/FormTitle';
import SubmittedRedeemRequestModal from './SubmittedRedeemRequestModal';
import WrappedTokenField from 'pages/Bridge/WrappedTokenField';
import PriceInfo from 'pages/Bridge/PriceInfo';
import ParachainStatusInfo from 'pages/Bridge/ParachainStatusInfo';
import Toggle from 'components/Toggle';
import TextField from 'components/TextField';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import Hr2 from 'components/hrs/Hr2';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import {
  BALANCE_MAX_INTEGER_LENGTH,
  BTC_ADDRESS_REGEX
} from '../../../constants';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon
} from 'config/relay-chains';
import { BLOCKS_BEHIND_LIMIT } from 'config/parachain';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import STATUSES from 'utils/constants/statuses';
import {
  displayMonetaryAmount,
  getUsdAmount,
  getRandomVaultIdWithCapacity
} from 'common/utils/utils';
import { togglePremiumRedeemAction } from 'common/actions/redeem.actions';
import {
  updateWrappedTokenBalanceAction,
  showAccountModalAction
} from 'common/actions/general.actions';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

const WRAPPED_TOKEN_AMOUNT = 'wrapped-token-amount';
const BTC_ADDRESS = 'btc-address';

type RedeemFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
  [BTC_ADDRESS]: string;
}

const RedeemForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleError = useErrorHandler();

  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const {
    wrappedTokenBalance,
    bridgeLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);
  const premiumRedeemSelected = useSelector((state: StoreType) => state.redeem.premiumRedeem);

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

  const [dustValue, setDustValue] = React.useState(BitcoinAmount.zero);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [redeemFee, setRedeemFee] = React.useState(BitcoinAmount.zero);
  const [redeemFeeRate, setRedeemFeeRate] = React.useState(new Big(0.005));
  const [btcToDotRate, setBtcToDotRate] = React.useState(
    new ExchangeRate<
      Bitcoin,
      BitcoinUnit,
      Currency<CollateralUnit>,
      CollateralUnit
    >(Bitcoin, COLLATERAL_TOKEN, new Big(0))
  );
  const [premiumRedeemVaults, setPremiumRedeemVaults] = React.useState<Map<AccountId, BitcoinAmount>>(new Map());
  const [premiumRedeemFee, setPremiumRedeemFee] = React.useState(new Big(0));
  const [currentInclusionFee, setCurrentInclusionFee] = React.useState(BitcoinAmount.zero);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Redeem>();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!wrappedTokenAmount) return;
    if (!redeemFeeRate) return;

    const parsedWrappedTokenAmount = BitcoinAmount.from.BTC(wrappedTokenAmount);
    const theRedeemFee = parsedWrappedTokenAmount.mul(redeemFeeRate);
    setRedeemFee(theRedeemFee);
  }, [
    bridgeLoaded,
    wrappedTokenAmount,
    redeemFeeRate
  ]);

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
          currentInclusionFeeResult
        ] = await Promise.allSettled([
          window.bridge.interBtcApi.redeem.getDustValue(),
          window.bridge.interBtcApi.vaults.getPremiumRedeemVaults(),
          window.bridge.interBtcIndex.getPremiumRedeemFee(),
          window.bridge.interBtcApi.oracle.getExchangeRate(COLLATERAL_TOKEN),
          window.bridge.interBtcApi.redeem.getFeeRate(),
          window.bridge.interBtcApi.redeem.getCurrentInclusionFee()
        ]);

        if (dustValueResult.status === 'rejected') {
          throw new Error(dustValueResult.reason);
        }
        if (premiumRedeemFeeResult.status === 'rejected') {
          throw new Error(premiumRedeemFeeResult.reason);
        }
        if (btcToDotRateResult.status === 'rejected') {
          throw new Error(btcToDotRateResult.reason);
        }
        if (redeemFeeRateResult.status === 'rejected') {
          throw new Error(redeemFeeRateResult.reason);
        }
        if (currentInclusionFeeResult.status === 'rejected') {
          throw new Error(currentInclusionFeeResult.reason);
        }
        if (premiumRedeemVaultsResult.status === 'fulfilled') {
          setPremiumRedeemVaults(premiumRedeemVaultsResult.value);
        }

        setDustValue(dustValueResult.value);
        setPremiumRedeemFee(new Big(premiumRedeemFeeResult.value));
        setBtcToDotRate(btcToDotRateResult.value);
        setRedeemFeeRate(redeemFeeRateResult.value);
        setCurrentInclusionFee(currentInclusionFeeResult.value);
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
        const wrappedTokenAmount = BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT]);

        // Differentiate between premium and regular redeem
        let vaultId;
        if (premiumRedeemSelected) {
          // Select a vault from the premium redeem vault list
          for (const [id, redeemableTokens] of premiumRedeemVaults) {
            if (redeemableTokens.gte(wrappedTokenAmount)) {
              vaultId = id;
              break;
            }
          }
          if (vaultId === undefined) {
            let maxAmount = BitcoinAmount.zero;
            for (const redeemableTokens of premiumRedeemVaults.values()) {
              if (maxAmount.lt(redeemableTokens)) {
                maxAmount = redeemableTokens;
              }
            }
            setFormError(WRAPPED_TOKEN_AMOUNT, {
              type: 'manual',
              message:
                t('redeem_page.error_max_premium_redeem', {
                  maxPremiumRedeem: displayMonetaryAmount(maxAmount),
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })
            });

            return;
          }
        } else {
          const vaults = await window.bridge.interBtcApi.vaults.getVaultsWithRedeemableTokens();
          vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), wrappedTokenAmount);
        }

        // FIXME: workaround to make premium redeem still possible
        const relevantVaults = new Map<AccountId, BitcoinAmount>();
        const id = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
        // FIXME: a bit of a dirty workaround with the capacity
        relevantVaults.set(id, wrappedTokenAmount.mul(2));
        const result = await window.bridge.interBtcApi.redeem.request(
          wrappedTokenAmount,
          data[BTC_ADDRESS],
          id
        );

        // TODO: handle redeem aggregator
        const redeemRequest = result[0];
        handleSubmittedRequestModalOpen(redeemRequest);
        setSubmitStatus(STATUSES.RESOLVED);

        dispatch(
          updateWrappedTokenBalanceAction(wrappedTokenBalance.sub(BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT])))
        );
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: string): string | undefined => {
      const parsedValue = BitcoinAmount.from.BTC(value);
      const minValue = dustValue.add(currentInclusionFee).add(redeemFee);
      if (parsedValue.gt(wrappedTokenBalance)) {
        return `${t('redeem_page.current_balance')}${displayMonetaryAmount(wrappedTokenBalance)}`;
      } else if (parsedValue.lte(minValue)) {
        return `${t('redeem_page.amount_greater_dust_inclusion')}${displayMonetaryAmount(minValue)} BTC).`;
      }

      if (!address) {
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

      return undefined;
    };

    const handlePremiumRedeemToggle = () => {
      // TODO: should not use redux
      dispatch(togglePremiumRedeemAction(!premiumRedeemSelected));
    };

    const redeemFeeInBTC = displayMonetaryAmount(redeemFee);
    const redeemFeeInUSD = getUsdAmount(redeemFee, prices.bitcoin.usd);
    const parsedInterBTCAmount = BitcoinAmount.from.BTC(wrappedTokenAmount || 0);
    const totalBTC =
        wrappedTokenAmount ?
          parsedInterBTCAmount.sub(redeemFee).sub(currentInclusionFee) :
          BitcoinAmount.zero;
    const totalBTCInUSD = getUsdAmount(totalBTC, prices.bitcoin.usd);

    const totalDOT =
      wrappedTokenAmount ?
        btcToDotRate.toCounter(parsedInterBTCAmount).mul(premiumRedeemFee) :
        newMonetaryAmount(0, COLLATERAL_TOKEN);
    const totalDOTInUSD = getUsdAmount(totalDOT, prices.collateralToken.usd);

    const bitcoinNetworkFeeInBTC = displayMonetaryAmount(currentInclusionFee);
    const bitcoinNetworkFeeInUSD = getUsdAmount(currentInclusionFee, prices.bitcoin.usd);
    const accountSet = !!address;

    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('redeem_page.you_will_receive', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </FormTitle>
          <WrappedTokenField
            id={WRAPPED_TOKEN_AMOUNT}
            name={WRAPPED_TOKEN_AMOUNT}
            label={WRAPPED_TOKEN_SYMBOL}
            min={0}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.please_enter_amount')
              },
              validate: value => validateForm(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(parsedInterBTCAmount || BitcoinAmount.zero, usdPrice)}`}
            error={!!errors[WRAPPED_TOKEN_AMOUNT]}
            helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message} />
          <ParachainStatusInfo status={parachainStatus} />
          <TextField
            id={BTC_ADDRESS}
            name={BTC_ADDRESS}
            type='text'
            label='BTC Address'
            placeholder={t('enter_btc_address')}
            ref={register({
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
            helperText={errors[BTC_ADDRESS]?.message} />
          {premiumRedeemVaults.size > 0 && (
            <div
              className={clsx(
                'flex',
                'justify-center',
                'items-center',
                'space-x-4'
              )}>
              <div
                className={clsx(
                  'flex',
                  'items-center',
                  'space-x-1'
                )}>
                <span>{t('redeem_page.premium_redeem')}</span>
                <InterlayTooltip label={t('redeem_page.premium_redeem_info')}>
                  <InformationCircleIcon
                    className={clsx(
                      { 'text-interlayTextSecondaryInLightMode':
                        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                      { 'dark:text-kintsugiTextSecondaryInDarkMode':
                        process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                      'w-5',
                      'h-5'
                    )} />
                </InterlayTooltip>
              </div>
              <Toggle
                checked={premiumRedeemSelected}
                onChange={handlePremiumRedeemToggle} />
            </div>
          )}
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('bridge_fee')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={redeemFeeInBTC}
            unitName='BTC'
            approxUSD={redeemFeeInUSD} />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('bitcoin_network_fee')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={bitcoinNetworkFeeInBTC}
            unitName='BTC'
            approxUSD={bitcoinNetworkFeeInUSD} />
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
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={displayMonetaryAmount(totalBTC)}
            unitName='BTC'
            approxUSD={totalBTCInUSD} />
          {premiumRedeemSelected && (
            <PriceInfo
              title={
                <h5 className='text-interlayConifer'>
                  {t('redeem_page.earned_premium')}
                </h5>
              }
              unitIcon={
                <CollateralTokenLogoIcon width={20} />
              }
              value={displayMonetaryAmount(totalDOT)}
              unitName={COLLATERAL_TOKEN_SYMBOL}
              approxUSD={totalDOTInUSD} />
          )}
          <SubmitButton
            disabled={parachainStatus !== ParachainStatus.Running}
            pending={submitStatus === STATUSES.PENDING}
            onClick={handleConfirmClick}>
            {accountSet ? t('confirm') : t('connect_wallet')}
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
        {submittedRequest && (
          <SubmittedRedeemRequestModal
            open={!!submittedRequest}
            onClose={handleSubmittedRequestModalClose}
            request={submittedRequest} />
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
