
import * as React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { AccountId } from '@polkadot/types/interfaces';
import {
  Issue,
  newMonetaryAmount,
  GovernanceUnit
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
import SubmittedIssueRequestModal from './SubmittedIssueRequestModal';
import WrappedTokenField from 'pages/Bridge/WrappedTokenField';
import PriceInfo from 'pages/Bridge/PriceInfo';
import ParachainStatusInfo from 'pages/Bridge/ParachainStatusInfo';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorFallback from 'components/ErrorFallback';
import Hr2 from 'components/hrs/Hr2';
import InterlayTooltip from 'components/UI/InterlayTooltip';
import {
  GOVERNANCE_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  GovernanceTokenLogoIcon
} from 'config/relay-chains';
import {
  BLOCK_TIME,
  BLOCKS_BEHIND_LIMIT
} from 'config/parachain';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  displayMonetaryAmount,
  getRandomVaultIdWithCapacity,
  getUsdAmount
} from 'common/utils/utils';
import STATUSES from 'utils/constants/statuses';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import { updateIssuePeriodAction } from 'common/actions/issue.actions';
import { showAccountModalAction } from 'common/actions/general.actions';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

const BTC_AMOUNT = 'btc-amount';

// TODO: should handle correctly later
let EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT: number;
if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT = 0.2;
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT = 0.01;
} else {
  throw new Error('Something went wrong!');
}
const MAXIMUM_ISSUABLE_WRAPPED_TOKEN_AMOUNT = 1;

type IssueFormData = {
  [BTC_AMOUNT]: string;
}

const IssueForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleError = useErrorHandler();

  const {
    bridgeLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus,
    governanceTokenBalance
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IssueFormData>({
    mode: 'onChange' // 'onBlur'
  });
  const btcAmount = watch(BTC_AMOUNT);

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  // Additional info: bridge fee, security deposit, amount BTC
  // Current fee model specification taken from: https://interlay.gitlab.io/polkabtc-spec/spec/fee.html
  const [feeRate, setFeeRate] = React.useState(0.005); // Set default to 0.5%
  const [depositRate, setDepositRate] = React.useState(0.00005); // Set default to 0.005%
  const [btcToGovernanceTokenRate, setBTCToGovernanceTokenRate] = React.useState(
    new ExchangeRate<
      Bitcoin,
      BitcoinUnit,
      Currency<GovernanceUnit>,
      GovernanceUnit
    >(Bitcoin, GOVERNANCE_TOKEN, new Big(0))
  );
  const [vaults, setVaults] = React.useState<Map<AccountId, BitcoinAmount>>();
  const [dustValue, setDustValue] = React.useState(BitcoinAmount.zero);
  const [vaultMaxAmount, setVaultMaxAmount] = React.useState(BitcoinAmount.zero);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<Issue>();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!dispatch) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          theFeeRate,
          theDepositRate,
          issuePeriodInBlocks,
          theDustValue,
          theBtcToGovernanceToken,
          theVaults
        ] = await Promise.all([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          window.bridge.interBtcIndex.getIssueFee(),
          window.bridge.interBtcIndex.getIssueGriefingCollateral(),
          window.bridge.interBtcIndex.getIssuePeriod(),
          window.bridge.interBtcIndex.getDustValue(),
          window.bridge.interBtcApi.oracle.getExchangeRate(GOVERNANCE_TOKEN),
          // This data (the vaults) is strictly required to request issue
          window.bridge.interBtcApi.vaults.getVaultsWithIssuableTokens()
        ]);
        setStatus(STATUSES.RESOLVED);

        setFeeRate(theFeeRate);
        setDepositRate(theDepositRate);
        const issuePeriod = issuePeriodInBlocks * BLOCK_TIME;
        dispatch(updateIssuePeriodAction(issuePeriod));
        setDustValue(theDustValue);
        setBTCToGovernanceTokenRate(theBtcToGovernanceToken);

        let theVaultMaxAmount = BitcoinAmount.zero;
        // The first item is the vault with the largest capacity
        theVaultMaxAmount = theVaults.values().next().value;

        setVaultMaxAmount(theVaultMaxAmount);
        setVaults(theVaults);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    bridgeLoaded,
    dispatch,
    handleError
  ]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }

  if (status === STATUSES.RESOLVED) {
    const validateForm = (value = 0): string | undefined => {
      const btcAmount = BitcoinAmount.from.BTC(value);

      const securityDeposit = btcToGovernanceTokenRate.toCounter(btcAmount).mul(depositRate);
      const minRequiredGovernanceTokenAmount =
        newMonetaryAmount(EXTRA_REQUIRED_COLLATERAL_TOKEN_AMOUNT, GOVERNANCE_TOKEN, true).add(securityDeposit);
      if (governanceTokenBalance.lte(minRequiredGovernanceTokenAmount)) {
        return t('insufficient_funds_governance_token', {
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
        });
      }

      if (value > MAXIMUM_ISSUABLE_WRAPPED_TOKEN_AMOUNT) {
        return t('issue_page.validation_max_value', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        });
      } else if (btcAmount.lt(dustValue)) {
        return `${t('issue_page.validation_min_value')}${displayMonetaryAmount(dustValue)} BTC).`;
      }

      const vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), btcAmount);
      if (!vaultId) {
        return t('issue_page.maximum_in_single_request', {
          maxAmount: displayMonetaryAmount(vaultMaxAmount),
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

    const onSubmit = async (data: IssueFormData) => {
      try {
        const wrappedTokenAmount = BitcoinAmount.from.BTC(data[BTC_AMOUNT]);
        setSubmitStatus(STATUSES.PENDING);
        const result = await window.bridge.interBtcApi.issue.request(wrappedTokenAmount);
        // TODO: handle issue aggregation
        const issueRequest = result[0];
        handleSubmittedRequestModalOpen(issueRequest);
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const parsedBTCAmount = BitcoinAmount.from.BTC(btcAmount || 0);
    const bridgeFee = parsedBTCAmount.mul(feeRate);
    const securityDeposit = btcToGovernanceTokenRate.toCounter(parsedBTCAmount).mul(depositRate);
    const wrappedTokenAmount = parsedBTCAmount.sub(bridgeFee);
    const accountSet = !!address;

    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>
            {t('issue_page.mint_polka_by_wrapping', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </FormTitle>
          <WrappedTokenField
            id={BTC_AMOUNT}
            name={BTC_AMOUNT}
            label='BTC'
            min={0}
            ref={register({
              required: {
                value: true,
                message: t('issue_page.enter_valid_amount')
              },
              validate: value => validateForm(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(parsedBTCAmount || BitcoinAmount.zero, prices.bitcoin.usd)}`}
            error={!!errors[BTC_AMOUNT]}
            helperText={errors[BTC_AMOUNT]?.message} />
          <ParachainStatusInfo status={parachainStatus} />
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
            value={displayMonetaryAmount(bridgeFee)}
            unitName='BTC'
            approxUSD={getUsdAmount(bridgeFee, prices.bitcoin.usd)}
            tooltip={
              <InterlayTooltip label={t('issue_page.tooltip_bridge_fee')}>
                <InformationCircleIcon
                  className={clsx(
                    { 'text-interlayTextSecondaryInLightMode':
                      process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                    'w-5',
                    'h-5'
                  )} />
              </InterlayTooltip>
            } />
          <PriceInfo
            title={
              <h5
                className={clsx(
                  { 'text-interlayTextSecondaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )}>
                {t('issue_page.security_deposit')}
              </h5>
            }
            unitIcon={
              <GovernanceTokenLogoIcon width={20} />
            }
            value={displayMonetaryAmount(securityDeposit)}
            unitName={GOVERNANCE_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(securityDeposit, prices.governanceToken.usd)}
            tooltip={
              <InterlayTooltip label={t('issue_page.tooltip_security_deposit')}>
                <InformationCircleIcon
                  className={clsx(
                    { 'text-interlayTextSecondaryInLightMode':
                      process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                    'w-5',
                    'h-5'
                  )} />
              </InterlayTooltip>
            } />
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
              <WrappedTokenLogoIcon width={20} />
            }
            value={displayMonetaryAmount(wrappedTokenAmount)}
            unitName={WRAPPED_TOKEN_SYMBOL}
            approxUSD={getUsdAmount(wrappedTokenAmount, prices.bitcoin.usd)} />
          <SubmitButton
            disabled={
              // TODO: `parachainStatus` and `address` should be checked at upper levels
              parachainStatus !== ParachainStatus.Running ||
              !address
            }
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
          <SubmittedIssueRequestModal
            open={!!submittedRequest}
            onClose={handleSubmittedRequestModalClose}
            request={submittedRequest} />
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
