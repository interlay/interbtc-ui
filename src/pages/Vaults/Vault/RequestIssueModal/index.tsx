import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { Bitcoin, BitcoinAmount, BitcoinUnit, ExchangeRate, Currency } from '@interlay/monetary-js';
import { newMonetaryAmount, GovernanceUnit, newAccountId, Issue, CurrencyIdLiteral } from '@interlay/interbtc-api';

import {
  GovernanceTokenLogoIcon,
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  WrappedTokenLogoIcon,
  WRAPPED_TOKEN_SYMBOL
} from 'config/relay-chains';
import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, { InterlayModalInnerWrapper, InterlayModalTitle } from 'components/UI/InterlayModal';
import { displayMonetaryAmount, getUsdAmount } from 'common/utils/utils';
import { ParachainStatus, StoreType } from 'common/types/util.types';
import TokenField from 'components/TokenField';
import { BLOCKS_BEHIND_LIMIT } from 'config/parachain';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import SubmittedIssueRequestModal from 'pages/Bridge/IssueForm/SubmittedIssueRequestModal';
import ErrorModal from 'components/ErrorModal';
import Hr2 from 'components/hrs/Hr2';
import SubmitButton from 'components/SubmitButton';
import InformationTooltip from 'components/tooltips/InformationTooltip';
import PriceInfo from 'components/PriceInfo';

const WRAPPED_TOKEN_AMOUNT = 'amount';
const BTC_ADDRESS = 'btc-address';

type RequestIssueFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
  [BTC_ADDRESS]: string;
};

interface Props {
  onClose: () => void;
  open: boolean;
  collateralIdLiteral: CurrencyIdLiteral | undefined;
  vaultAddress: string;
}

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

// TODO: share form with bridge page
const RequestIssueModal = ({ onClose, open, collateralIdLiteral, vaultAddress }: Props): JSX.Element => {
  const { register, handleSubmit, errors, watch, trigger } = useForm<RequestIssueFormData>({ mode: 'onChange' });
  const btcAmount = watch(WRAPPED_TOKEN_AMOUNT) || '0';

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [vaultCapacity, setVaultCapacity] = React.useState(BitcoinAmount.zero);
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

  const { t } = useTranslation();
  const focusRef = React.useRef(null);

  const handleError = useErrorHandler();

  const {
    bridgeLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    governanceTokenBalance,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);

  const vaultAccountId = React.useMemo(() => {
    if (!bridgeLoaded) return;
    return newAccountId(window.bridge.api, vaultAddress);
  }, [bridgeLoaded, vaultAddress]);

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;
    if (!vaultAccountId) return;
    if (!collateralIdLiteral) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          theFeeRate,
          theDepositRate,
          theDustValue,
          theBtcToGovernanceToken,
          issuableAmount
        ] = await Promise.allSettled([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          window.bridge.fee.getIssueFee(),
          window.bridge.fee.getIssueGriefingCollateralRate(),
          window.bridge.issue.getDustValue(),
          window.bridge.oracle.getExchangeRate(GOVERNANCE_TOKEN),
          // MEMO: this always uses KSM as collateral token
          window.bridge.issue.getVaultIssuableAmount(vaultAccountId, collateralIdLiteral)
        ]);
        setStatus(STATUSES.RESOLVED);
        if (theFeeRate.status === 'fulfilled') {
          setFeeRate(theFeeRate.value);
        }
        if (theDepositRate.status === 'fulfilled') {
          setDepositRate(theDepositRate.value);
        }
        if (theDustValue.status === 'fulfilled') {
          setDustValue(theDustValue.value);
        }
        if (theBtcToGovernanceToken.status === 'fulfilled') {
          setBTCToGovernanceTokenRate(theBtcToGovernanceToken.value);
        }
        if (issuableAmount.status === 'fulfilled') {
          setVaultCapacity(issuableAmount.value);
        }
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [collateralIdLiteral, bridgeLoaded, handleError, vaultAccountId]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING || vaultAccountId === undefined) {
    return <PrimaryColorEllipsisLoader />;
  }
  const onSubmit = async (data: RequestIssueFormData) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      await trigger(WRAPPED_TOKEN_AMOUNT);

      const wrappedTokenAmount = BitcoinAmount.from.BTC(data[WRAPPED_TOKEN_AMOUNT] || '0');

      const vaults = await window.bridge.vaults.getVaultsWithIssuableTokens();

      const result = await window.bridge.issue.request(
        wrappedTokenAmount,
        vaultAccountId,
        collateralIdLiteral,
        false, // default
        0, // default
        vaults
      );

      const issueRequest = result[0];
      handleSubmittedRequestModalOpen(issueRequest);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
    }
    setSubmitStatus(STATUSES.RESOLVED);
  };

  const validateForm = (value: string): string | undefined => {
    const numericValue = Number(value || '0');
    const btcAmount = BitcoinAmount.from.BTC(numericValue);

    const securityDeposit = btcToGovernanceTokenRate.toCounter(btcAmount).mul(depositRate);
    const minRequiredGovernanceTokenAmount = extraRequiredCollateralTokenAmount.add(securityDeposit);
    if (governanceTokenBalance.lte(minRequiredGovernanceTokenAmount)) {
      return t('insufficient_funds_governance_token', {
        governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
      });
    }

    if (btcAmount.lt(dustValue)) {
      return `${t('issue_page.validation_min_value')}${displayMonetaryAmount(dustValue)} BTC).`;
    }

    if (btcAmount.gt(vaultCapacity)) {
      return t('issue_page.maximum_in_single_request_error', {
        maxAmount: displayMonetaryAmount(vaultCapacity),
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

  const parsedBTCAmount = BitcoinAmount.from.BTC(btcAmount);
  const bridgeFee = parsedBTCAmount.mul(feeRate);
  const securityDeposit = btcToGovernanceTokenRate.toCounter(parsedBTCAmount).mul(depositRate);
  const wrappedTokenAmount = parsedBTCAmount.sub(bridgeFee);

  return (
    <>
      <InterlayModal initialFocus={focusRef} open={open} onClose={onClose}>
        <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
          <InterlayModalTitle as='h3' className={clsx('text-lg', 'font-medium', 'mb-6')}>
            {t('vault.request_issue')}
          </InterlayModalTitle>
          <CloseIconButton ref={focusRef} onClick={onClose} />
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <p>{t('vault.issue_description')}</p>
            <p>
              {t('vault.max_capacity')} <strong>{displayMonetaryAmount(vaultCapacity)} BTC</strong>
            </p>
            <p>{t('vault.issue_amount')}</p>
            <div>
              <TokenField
                id={WRAPPED_TOKEN_AMOUNT}
                name={WRAPPED_TOKEN_AMOUNT}
                label='BTC'
                min={0}
                ref={register({
                  required: {
                    value: true,
                    message: t('issue_page.enter_valid_amount')
                  },
                  validate: (value) => validateForm(value)
                })}
                approxUSD={`≈ $ ${getUsdAmount(parsedBTCAmount || BitcoinAmount.zero, prices.bitcoin?.usd)}`}
                error={!!errors[WRAPPED_TOKEN_AMOUNT]}
                helperText={errors[WRAPPED_TOKEN_AMOUNT]?.message}
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
              approxUSD={getUsdAmount(bridgeFee, prices.bitcoin?.usd)}
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
              approxUSD={getUsdAmount(securityDeposit, prices.governanceToken?.usd)}
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
              approxUSD={getUsdAmount(extraRequiredCollateralTokenAmount, prices.governanceToken?.usd)}
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
              approxUSD={getUsdAmount(wrappedTokenAmount, prices.bitcoin?.usd)}
            />
            <SubmitButton
              disabled={
                // TODO: `parachainStatus` and `address` should be checked at upper levels
                parachainStatus !== ParachainStatus.Running || !address
              }
              pending={submitStatus === STATUSES.PENDING}
            >
              {t('confirm')}
            </SubmitButton>
          </form>
        </InterlayModalInnerWrapper>
      </InterlayModal>
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
};

export default RequestIssueModal;
