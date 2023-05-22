import {
  currencyIdToMonetaryCurrency,
  getIssueRequestsFromExtrinsicResult,
  GovernanceCurrency,
  InterbtcPrimitivesVaultId,
  Issue
} from '@interlay/interbtc-api';
import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BitcoinLogoIcon } from '@/assets/img/bitcoin-logo.svg';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { VaultApiType } from '@/common/types/vault.types';
import {
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  getRandomVaultIdWithCapacity
} from '@/common/utils/utils';
import { AuthCTA } from '@/components';
import { INTERLAY_VAULT_DOCS_LINK } from '@/config/links';
import {
  BLOCKS_BEHIND_LIMIT,
  DEFAULT_ISSUE_BRIDGE_FEE_RATE,
  DEFAULT_ISSUE_DUST_AMOUNT,
  DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE
} from '@/config/parachain';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenLogoIcon,
  TRANSACTION_FEE_AMOUNT,
  WRAPPED_TOKEN_SYMBOL,
  WrappedTokenLogoIcon
} from '@/config/relay-chains';
import AvailableBalanceUI from '@/legacy-components/AvailableBalanceUI';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ErrorModal from '@/legacy-components/ErrorModal';
import FormTitle from '@/legacy-components/FormTitle';
import Hr2 from '@/legacy-components/hrs/Hr2';
import PriceInfo from '@/legacy-components/PriceInfo';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import TokenField from '@/legacy-components/TokenField';
import InformationTooltip from '@/legacy-components/tooltips/InformationTooltip';
import InterlayLink from '@/legacy-components/UI/InterlayLink';
import { useSubstrateSecureState } from '@/lib/substrate';
import ParachainStatusInfo from '@/pages/Bridge/ParachainStatusInfo';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getExtrinsicStatus, submitExtrinsic } from '@/utils/helpers/extrinsic';
import { getExchangeRate } from '@/utils/helpers/oracle';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import ManualVaultSelectUI from '../ManualVaultSelectUI';
import SubmittedIssueRequestModal from './SubmittedIssueRequestModal';

const BTC_AMOUNT = 'btc-amount';
const VAULT_SELECTION = 'vault-selection';

const getTokenFieldHelperText = (message?: string) => {
  switch (message) {
    case 'no_issuable_token_available':
      return (
        <Trans i18nKey='no_issuable_token_available'>
          Oh, snap! All iBTC minting capacity has been snatched up. Please come back a bit later, or{' '}
          <InterlayLink className='underline' target='_blank' rel='noreferrer' href={INTERLAY_VAULT_DOCS_LINK}>
            consider running a Vault
          </InterlayLink>
          !
        </Trans>
      );
    default:
      return message;
  }
};

type IssueFormData = {
  [BTC_AMOUNT]: string;
  [VAULT_SELECTION]: string;
};

const IssueForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const handleError = useErrorHandler();

  const { selectedAccount } = useSubstrateSecureState();
  const { bridgeLoaded, bitcoinHeight, btcRelayHeight, parachainStatus } = useSelector(
    (state: StoreType) => state.general
  );
  const { isLoading: isBalancesLoading, data: balances } = useGetBalances();

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
  const [issueFeeRate, setIssueFeeRate] = React.useState(new Big(DEFAULT_ISSUE_BRIDGE_FEE_RATE));
  const [depositRate, setDepositRate] = React.useState(new Big(DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE));
  const [btcToGovernanceTokenRate, setBTCToGovernanceTokenRate] = React.useState(
    new ExchangeRate<Bitcoin, GovernanceCurrency>(Bitcoin, GOVERNANCE_TOKEN, new Big(0))
  );
  const [dustValue, setDustValue] = React.useState(new BitcoinAmount(DEFAULT_ISSUE_DUST_AMOUNT));
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Issue>();
  const [selectVaultManually, setSelectVaultManually] = React.useState<boolean>(false);
  const [selectedVault, setSelectedVault] = React.useState<VaultApiType | undefined>();

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
          feeRateResult,
          depositRateResult,
          dustValueResult,
          btcToGovernanceTokenResult
        ] = await Promise.allSettled([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          window.bridge.fee.getIssueFee(),
          window.bridge.fee.getIssueGriefingCollateralRate(),
          window.bridge.issue.getDustValue(),
          getExchangeRate(GOVERNANCE_TOKEN)
        ]);
        setStatus(STATUSES.RESOLVED);

        if (feeRateResult.status === 'rejected') {
          throw new Error(feeRateResult.reason);
        }

        if (depositRateResult.status === 'rejected') {
          throw new Error(depositRateResult.reason);
        }

        if (dustValueResult.status === 'rejected') {
          throw new Error(dustValueResult.reason);
        }

        if (btcToGovernanceTokenResult.status === 'rejected') {
          setError(BTC_AMOUNT, {
            type: 'validate',
            message: t('error_oracle_offline', { action: 'issue', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
          });
        }

        if (btcToGovernanceTokenResult.status === 'fulfilled') {
          setBTCToGovernanceTokenRate(btcToGovernanceTokenResult.value);
        }

        setIssueFeeRate(feeRateResult.value);
        setDepositRate(depositRateResult.value);
        setDustValue(dustValueResult.value);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, dispatch, handleError, setError, t]);

  React.useEffect(() => {
    // Deselect checkbox when required btcAmount exceeds capacity
    if (requestLimits) {
      const monetaryBtcAmount = new BitcoinAmount(btcAmount);
      if (monetaryBtcAmount.gt(requestLimits.singleVaultMaxIssuable)) {
        setSelectVaultManually(false);
      }
    }
  }, [btcAmount, requestLimits]);

  React.useEffect(() => {
    // Vault selection validation
    const monetaryBtcAmount = new BitcoinAmount(btcAmount);

    if (selectVaultManually && selectedVault === undefined) {
      setError(VAULT_SELECTION, { type: 'validate', message: t('issue_page.vault_must_be_selected') });
    } else if (selectVaultManually && selectedVault?.[1].lt(monetaryBtcAmount)) {
      setError(VAULT_SELECTION, { type: 'validate', message: t('issue_page.selected_vault_has_no_enough_capacity') });
    } else {
      clearErrors(VAULT_SELECTION);
    }
  }, [selectVaultManually, selectedVault, setError, clearErrors, t, btcAmount]);

  const hasIssuableToken = !requestLimits?.singleVaultMaxIssuable.isZero();

  React.useEffect(() => {
    if (!hasIssuableToken) {
      setError(BTC_AMOUNT, {
        type: 'validate',
        message: 'no_issuable_token_available'
      });
    }
  }, [hasIssuableToken, setError]);

  if (
    status === STATUSES.IDLE ||
    status === STATUSES.PENDING ||
    requestLimitsIdle ||
    requestLimitsLoading ||
    isBalancesLoading
  ) {
    return <PrimaryColorEllipsisLoader />;
  }

  if (requestLimits === undefined) {
    throw new Error('Something went wrong!');
  }

  if (status === STATUSES.RESOLVED) {
    const validateForm = (value: string): string | undefined => {
      const governanceTokenBalance = balances?.[GOVERNANCE_TOKEN.ticker];

      if (governanceTokenBalance === undefined) return;

      const numericValue = Number(value || '0');
      const btcAmount = new BitcoinAmount(numericValue);

      const securityDeposit = btcToGovernanceTokenRate.toCounter(btcAmount).mul(depositRate);
      const minRequiredGovernanceTokenAmount = TRANSACTION_FEE_AMOUNT.add(securityDeposit);
      if (governanceTokenBalance.transferable.lte(minRequiredGovernanceTokenAmount)) {
        return t('issue_page.insufficient_funds', {
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

      if (isOracleOffline) {
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

    const handleSelectVaultCheckboxChange = () => {
      if (!isSelectVaultCheckboxDisabled) {
        setSelectVaultManually((prev) => !prev);
      }
    };

    const onSubmit = async (data: IssueFormData) => {
      try {
        setSubmitStatus(STATUSES.PENDING);
        await requestLimitsRefetch();
        await trigger(BTC_AMOUNT);

        const monetaryBtcAmount = new BitcoinAmount(data[BTC_AMOUNT] || '0');
        const vaults = await window.bridge.vaults.getVaultsWithIssuableTokens();

        let vaultId: InterbtcPrimitivesVaultId;
        if (selectVaultManually) {
          if (!selectedVault) {
            throw new Error('Specific vault is not selected!');
          }
          vaultId = selectedVault[0];
        } else {
          vaultId = getRandomVaultIdWithCapacity(Array.from(vaults), monetaryBtcAmount);
        }

        const collateralToken = await currencyIdToMonetaryCurrency(window.bridge.api, vaultId.currencies.collateral);

        const extrinsicData = await window.bridge.issue.request(
          monetaryBtcAmount,
          vaultId.accountId,
          collateralToken,
          false, // default
          vaults
        );
        // When requesting an issue, wait for the finalized event because we cannot revert BTC transactions.
        // For more details see: https://github.com/interlay/interbtc-api/pull/373#issuecomment-1058949000
        const finalizedStatus = getExtrinsicStatus('Finalized');
        const extrinsicResult = await submitExtrinsic(extrinsicData, finalizedStatus);
        const issueRequests = await getIssueRequestsFromExtrinsicResult(window.bridge, extrinsicResult);

        // TODO: handle issue aggregation
        const issueRequest = issueRequests[0];
        handleSubmittedRequestModalOpen(issueRequest);
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const monetaryBtcAmount = new BitcoinAmount(btcAmount);

    const bridgeFee = monetaryBtcAmount.mul(issueFeeRate);
    const bridgeFeeInBTC = bridgeFee.toHuman(8);
    const bridgeFeeInUSD = displayMonetaryAmountInUSDFormat(
      bridgeFee,
      getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
    );

    const securityDeposit = btcToGovernanceTokenRate.toCounter(monetaryBtcAmount).mul(depositRate);
    const securityDepositInGovernanceToken = displayMonetaryAmount(securityDeposit);
    const securityDepositInUSD = displayMonetaryAmountInUSDFormat(
      securityDeposit,
      getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
    );

    const txFeeInGovernanceToken = displayMonetaryAmount(TRANSACTION_FEE_AMOUNT);
    const txFeeInUSD = displayMonetaryAmountInUSDFormat(
      TRANSACTION_FEE_AMOUNT,
      getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
    );

    const total = monetaryBtcAmount.sub(bridgeFee);
    const totalInBTC = total.toHuman(8);
    const totalInUSD = displayMonetaryAmountInUSDFormat(total, getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd);

    const accountSet = !!selectedAccount;

    const isSelectVaultCheckboxDisabled = monetaryBtcAmount.gt(requestLimits.singleVaultMaxIssuable);

    // `btcToGovernanceTokenRate` has 0 value only if oracle call fails
    const isOracleOffline = btcToGovernanceTokenRate.toBig().eq(0);

    // TODO: `parachainStatus` and `address` should be checked at upper levels
    const isSubmitBtnDisabled = accountSet ? parachainStatus !== ParachainStatus.Running || !selectedAccount : false;

    return (
      <>
        <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('issue_page.mint_polka_by_wrapping', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </FormTitle>
          <div>
            <AvailableBalanceUI
              data-testid='single-max-issuable'
              label={t('issue_page.maximum_in_single_request')}
              balance={displayMonetaryAmount(requestLimits.singleVaultMaxIssuable)}
              tokenSymbol={WRAPPED_TOKEN_SYMBOL}
            />
            <AvailableBalanceUI
              data-testid='total-max-issuable'
              label={t('issue_page.maximum_total_request')}
              balance={displayMonetaryAmount(requestLimits.totalMaxIssuable)}
              tokenSymbol={WRAPPED_TOKEN_SYMBOL}
            />
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
              approxUSD={`≈ ${displayMonetaryAmountInUSDFormat(
                monetaryBtcAmount || BitcoinAmount.zero(),
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              )}`}
              error={!!errors[BTC_AMOUNT]}
              helperText={getTokenFieldHelperText(errors[BTC_AMOUNT]?.message)}
              helperTextClassName={clsx({ 'h-12': !hasIssuableToken })}
            />
          </div>
          <ParachainStatusInfo status={parachainStatus} />
          <ManualVaultSelectUI
            disabled={isSelectVaultCheckboxDisabled}
            checked={selectVaultManually}
            treasuryAction='issue'
            requiredCapacity={monetaryBtcAmount}
            error={errors[VAULT_SELECTION]}
            onSelectionCallback={setSelectedVault}
            onCheckboxChange={handleSelectVaultCheckboxChange}
          />
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
            dataTestId='total-receiving-amount'
            value={totalInBTC}
            unitName={WRAPPED_TOKEN_SYMBOL}
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
            dataTestId='issue-bridge-fee'
            value={bridgeFeeInBTC}
            unitName='BTC'
            approxUSD={bridgeFeeInUSD}
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
            dataTestId='security-deposit'
            value={securityDepositInGovernanceToken}
            unitName={GOVERNANCE_TOKEN_SYMBOL}
            approxUSD={securityDepositInUSD}
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
            dataTestId='transaction-fee'
            value={txFeeInGovernanceToken}
            unitName={GOVERNANCE_TOKEN_SYMBOL}
            approxUSD={txFeeInUSD}
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

          <AuthCTA
            fullWidth
            size='large'
            type='submit'
            loading={submitStatus === STATUSES.PENDING}
            disabled={isSubmitBtnDisabled}
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
