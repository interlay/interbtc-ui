import {
  CurrencyIdLiteral,
  GovernanceUnit,
  InterbtcPrimitivesVaultId,
  Issue,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { Bitcoin, BitcoinAmount, BitcoinUnit, Currency, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BitcoinLogoIcon } from '@/assets/img/bitcoin-logo.svg';
import { showAccountModalAction } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { VaultApiType } from '@/common/types/vault.types';
import { displayMonetaryAmount, getRandomVaultIdWithCapacity, getUsdAmount } from '@/common/utils/utils';
import AvailableBalanceUI from '@/components/AvailableBalanceUI';
import Checkbox, { CheckboxLabelSide } from '@/components/Checkbox';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import FormTitle from '@/components/FormTitle';
import Hr2 from '@/components/hrs/Hr2';
import PriceInfo from '@/components/PriceInfo';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import SubmitButton from '@/components/SubmitButton';
import TokenField from '@/components/TokenField';
import InformationTooltip from '@/components/tooltips/InformationTooltip';
import Vaults from '@/components/Vaults';
import { BLOCKS_BEHIND_LIMIT } from '@/config/parachain';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon
} from '@/config/relay-chains';
import ParachainStatusInfo from '@/pages/Bridge/ParachainStatusInfo';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { useGovernanceTokenBalance } from '@/services/hooks/use-token-balance';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { COLLATERAL_TOKEN_ID_LITERAL } from '@/utils/constants/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import SubmittedIssueRequestModal from './SubmittedIssueRequestModal';

const BTC_AMOUNT = 'btc-amount';
const VAULT_SELECTION = 'vault-selection';

// TODO: should handle correctly later
let EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT: number;
if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT = 0.2;
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT = 0.01;
} else {
  throw new Error('Something went wrong!');
}
const extraRequiredCollateralTokenAmount = newMonetaryAmount(
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT,
  GOVERNANCE_TOKEN,
  true
);

type IssueFormData = {
  [BTC_AMOUNT]: string;
  [VAULT_SELECTION]: string;
};

const IssueForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const handleError = useErrorHandler();

  const { bridgeLoaded, address, bitcoinHeight, btcRelayHeight, parachainStatus } = useSelector(
    (state: StoreType) => state.general
  );

  const {
    governanceTokenBalanceIdle,
    governanceTokenBalanceLoading,
    governanceTokenBalance
  } = useGovernanceTokenBalance();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setError,
    clearErrors
  } = useForm<IssueFormData>({
    mode: 'onChange' // 'onBlur'
  });
  const btcAmount = watch(BTC_AMOUNT) || '0';

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  // Additional info: bridge fee, security deposit, amount BTC
  // Current fee model specification taken from: https://interlay.gitlab.io/polkabtc-spec/spec/fee.html
  const [feeRate, setFeeRate] = React.useState(new Big(0.005)); // Set default to 0.5%
  const [depositRate, setDepositRate] = React.useState(new Big(0.00005)); // Set default to 0.005%
  const [btcToGovernanceTokenRate, setBTCToGovernanceTokenRate] = React.useState(
    new ExchangeRate<Bitcoin, BitcoinUnit, Currency<GovernanceUnit>, GovernanceUnit>(
      Bitcoin,
      GOVERNANCE_TOKEN,
      new Big(0)
    )
  );
  const [dustValue, setDustValue] = React.useState(BitcoinAmount.zero);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Issue>();
  const [selectVaultManually, setSelectVaultManually] = React.useState<boolean>(false);
  const [vault, setVault] = React.useState<VaultApiType | undefined>();

  const {
    isIdle: requestLimitsIdle,
    isLoading: requestLimitsLoading,
    data: requestLimits,
    error: requestLimitsError,
    refetch: requestLimitsRefetch
  } = useQuery<IssueLimits, Error>([GENERIC_FETCHER, 'issue', 'getRequestLimits'], genericFetcher<IssueLimits>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(requestLimitsError);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!dispatch) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          theFeeRateResult,
          theDepositRateResult,
          theDustValueResult,
          theBtcToGovernanceTokenResult
        ] = await Promise.allSettled([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          window.bridge.fee.getIssueFee(),
          window.bridge.fee.getIssueGriefingCollateralRate(),
          window.bridge.issue.getDustValue(),
          window.bridge.oracle.getExchangeRate(GOVERNANCE_TOKEN)
        ]);
        setStatus(STATUSES.RESOLVED);

        if (theFeeRateResult.status === 'rejected') {
          throw new Error(theFeeRateResult.reason);
        }

        if (theDepositRateResult.status === 'rejected') {
          throw new Error(theDepositRateResult.reason);
        }

        if (theDustValueResult.status === 'rejected') {
          throw new Error(theDustValueResult.reason);
        }

        if (theBtcToGovernanceTokenResult.status === 'rejected') {
          setError(BTC_AMOUNT, {
            type: 'validate',
            message: t('error_oracle_offline', { action: 'issue', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
          });
        }

        if (theBtcToGovernanceTokenResult.status === 'fulfilled') {
          setBTCToGovernanceTokenRate(theBtcToGovernanceTokenResult.value);
        }

        setFeeRate(theFeeRateResult.value);
        setDepositRate(theDepositRateResult.value);
        setDustValue(theDustValueResult.value);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, dispatch, handleError, setError, t]);

  React.useEffect(() => {
    // deselect checkbox when required btcAmount exceeds capacity
    if (requestLimits) {
      const parsedBTCAmount = BitcoinAmount.from.BTC(btcAmount);
      const requiredTokenAmount = parsedBTCAmount.sub(parsedBTCAmount.mul(feeRate));
      if (requiredTokenAmount.gt(requestLimits.singleVaultMaxIssuable)) {
        setSelectVaultManually(false);
      }
    }
  }, [btcAmount, feeRate, requestLimits]);

  React.useEffect(() => {
    // vault selection validation
    const parsedBTCAmount = BitcoinAmount.from.BTC(btcAmount);
    const wrappedTokenAmount = parsedBTCAmount.sub(parsedBTCAmount.mul(feeRate));

    if (selectVaultManually && vault === undefined) {
      setError(VAULT_SELECTION, { type: 'validate', message: t('issue_page.vault_must_be_selected') });
    } else if (selectVaultManually && vault?.[1].lt(wrappedTokenAmount)) {
      setError(VAULT_SELECTION, { type: 'validate', message: t('issue_page.selected_vault_has_no_enough_capacity') });
    } else {
      clearErrors(VAULT_SELECTION);
    }
  }, [selectVaultManually, vault, setError, clearErrors, t, btcAmount, feeRate]);

  if (
    status === STATUSES.IDLE ||
    status === STATUSES.PENDING ||
    requestLimitsIdle ||
    requestLimitsLoading ||
    governanceTokenBalanceIdle ||
    governanceTokenBalanceLoading
  ) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (requestLimits === undefined || governanceTokenBalance === undefined) {
    throw new Error('Something went wrong!');
  }

  if (status === STATUSES.RESOLVED) {
    const validateForm = (value: string): string | undefined => {
      const numericValue = Number(value || '0');
      const btcAmount = BitcoinAmount.from.BTC(numericValue);

      const securityDeposit = btcToGovernanceTokenRate.toCounter(btcAmount).mul(depositRate);
      const minRequiredGovernanceTokenAmount = extraRequiredCollateralTokenAmount.add(securityDeposit);
      if (governanceTokenBalance.free.lte(minRequiredGovernanceTokenAmount)) {
        return t('insufficient_funds_governance_token', {
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
        });
      }

      if (btcAmount.lt(dustValue)) {
        return `${t('issue_page.validation_min_value')}${displayMonetaryAmount(dustValue)} BTC).`;
      }

      if (btcAmount.gt(requestLimits.singleVaultMaxIssuable)) {
        return t('issue_page.maximum_in_single_request_error', {
          maxAmount: displayMonetaryAmount(requestLimits.singleVaultMaxIssuable),
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        });
      }

      if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
        return t('issue_page.error_more_than_6_blocks_behind', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        });
      }

      if (!bridgeLoaded) {
        return 'Bridge must be loaded!';
      }

      if (btcAmount === undefined) {
        return 'Invalid BTC amount input!';
      }

      if (btcToGovernanceTokenRate.toBig().eq(0)) {
        return t('error_oracle_offline', { action: 'issue', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL });
      }

      return undefined;
    };

    const handleSubmittedRequestModalOpen = (newSubmittedRequest: Issue) => {
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

    const handleSelectVaultCheckboxChange = () => {
      if (!isSelectVaultCheckboxDisabled) {
        setSelectVaultManually((currentState) => !currentState);
      }
    };

    const onSubmit = async (data: IssueFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        await requestLimitsRefetch();
        await trigger(BTC_AMOUNT);

        const wrappedTokenAmount = BitcoinAmount.from.BTC(data[BTC_AMOUNT] || '0');
        const vaults = await window.bridge.vaults.getVaultsWithIssuableTokens();

        let vaultId: InterbtcPrimitivesVaultId;
        let collateralTokenIdLiteral: CurrencyIdLiteral;

        if (selectVaultManually) {
          if (!vault) {
            throw new Error('Specific vault is not selected!');
          }
          vaultId = vault[0];
          collateralTokenIdLiteral = vault[0].currencies.collateral.asToken.toString();
        } else {
          vaultId = getRandomVaultIdWithCapacity(Array.from(vaults), wrappedTokenAmount);
          collateralTokenIdLiteral = COLLATERAL_TOKEN_ID_LITERAL;
        }

        const result = await window.bridge.issue.request(
          wrappedTokenAmount,
          vaultId.accountId,
          collateralTokenIdLiteral,
          false, // default
          0, // default
          vaults
        );

        // TODO: handle issue aggregation
        const issueRequest = result[0];
        handleSubmittedRequestModalOpen(issueRequest);
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const parsedBTCAmount = BitcoinAmount.from.BTC(btcAmount);
    const bridgeFee = parsedBTCAmount.mul(feeRate);
    const securityDeposit = btcToGovernanceTokenRate.toCounter(parsedBTCAmount).mul(depositRate);
    const wrappedTokenAmount = parsedBTCAmount.sub(bridgeFee);
    const accountSet = !!address;
    const isSelectVaultCheckboxDisabled = wrappedTokenAmount.gt(requestLimits.singleVaultMaxIssuable);

    return (
      <>
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('issue_page.mint_polka_by_wrapping', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </FormTitle>
          <div>
            <TokenField
              id={BTC_AMOUNT}
              label='BTC'
              min={0}
              {...register(BTC_AMOUNT, {
                required: {
                  value: true,
                  message: t('issue_page.enter_valid_amount')
                },
                validate: (value) => validateForm(value)
              })}
              approxUSD={`≈ $ ${getUsdAmount(
                parsedBTCAmount || BitcoinAmount.zero,
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              )}`}
              error={!!errors[BTC_AMOUNT]}
              helperText={errors[BTC_AMOUNT]?.message}
            />
            <AvailableBalanceUI
              label={t('issue_page.maximum_in_single_request')}
              balance={displayMonetaryAmount(requestLimits.singleVaultMaxIssuable)}
              tokenSymbol={WRAPPED_TOKEN_SYMBOL}
            />
            <AvailableBalanceUI
              label={t('issue_page.maximum_total_request')}
              balance={displayMonetaryAmount(requestLimits.totalMaxIssuable)}
              tokenSymbol={WRAPPED_TOKEN_SYMBOL}
            />
          </div>
          <ParachainStatusInfo status={parachainStatus} />
          <div className={clsx('flex', 'flex-col', 'items-end', 'gap-2')}>
            <Checkbox
              label={t('issue_page.manually_select_vault')}
              labelSide={CheckboxLabelSide.LEFT}
              disabled={isSelectVaultCheckboxDisabled}
              type='checkbox'
              checked={selectVaultManually}
              onChange={handleSelectVaultCheckboxChange}
            />
            <Vaults
              label={t('select_vault')}
              requiredCapacity={wrappedTokenAmount.toString()}
              isShown={selectVaultManually}
              onSelectionCallback={setVault}
              error={errors[VAULT_SELECTION]}
            />
          </div>
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
            value={displayMonetaryAmount(bridgeFee)}
            unitName='BTC'
            approxUSD={getUsdAmount(bridgeFee, getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd)}
            tooltip={
              <InformationTooltip
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
                label={t('issue_page.tooltip_bridge_fee')}
              />
            }
          />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('issue_page.security_deposit')}
              </h5>
            }
            unitIcon={<GovernanceTokenLogoIcon width={20} />}
            value={displayMonetaryAmount(securityDeposit)}
            unitName={GOVERNANCE_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(securityDeposit, getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd)}
            tooltip={
              <InformationTooltip
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
                label={t('issue_page.tooltip_security_deposit')}
              />
            }
          />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
              >
                {t('issue_page.transaction_fee')}
              </h5>
            }
            unitIcon={<GovernanceTokenLogoIcon width={20} />}
            value={displayMonetaryAmount(extraRequiredCollateralTokenAmount)}
            unitName={GOVERNANCE_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(
              extraRequiredCollateralTokenAmount,
              getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
            )}
            tooltip={
              <InformationTooltip
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}
                label={t('issue_page.tooltip_transaction_fee')}
              />
            }
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
            unitIcon={<WrappedTokenLogoIcon width={20} />}
            value={displayMonetaryAmount(wrappedTokenAmount)}
            unitName={WRAPPED_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(wrappedTokenAmount, getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd)}
          />
          <SubmitButton
            disabled={
              // TODO: `parachainStatus` and `address` should be checked at upper levels
              parachainStatus !== ParachainStatus.Running || !address
            }
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
          <SubmittedIssueRequestModal
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

export default withErrorBoundary(IssueForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
