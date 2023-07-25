import {
  CollateralCurrencyExt,
  getIssueRequestsFromExtrinsicResult,
  GovernanceCurrency,
  Issue
} from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ReactComponent as BitcoinLogoIcon } from '@/assets/img/bitcoin-logo.svg';
import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Modal, ModalBody, ModalHeader } from '@/component-library';
import { AuthCTA } from '@/components';
import {
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
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import useAccountId from '@/hooks/use-account-id';
import Hr2 from '@/legacy-components/hrs/Hr2';
import PriceInfo from '@/legacy-components/PriceInfo';
import TokenField from '@/legacy-components/TokenField';
import InformationTooltip from '@/legacy-components/tooltips/InformationTooltip';
import InterlayButtonBase from '@/legacy-components/UI/InterlayButtonBase';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import STATUSES from '@/utils/constants/statuses';
import { getExchangeRate } from '@/utils/helpers/oracle';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBtcBlockHeight } from '@/utils/hooks/api/use-get-btc-block-height';

import SubmittedIssueRequestModal from '../SubmittedIssueRequestModal';

const WRAPPED_TOKEN_AMOUNT = 'amount';
const BTC_ADDRESS = 'btc-address';

type RequestIssueFormData = {
  [WRAPPED_TOKEN_AMOUNT]: string;
  [BTC_ADDRESS]: string;
};

interface Props {
  onClose: () => void;
  open: boolean;
  collateralToken: CollateralCurrencyExt;
  vaultAddress: string;
}

// TODO: share form with bridge page
const RequestIssueModal = ({ onClose, open, collateralToken, vaultAddress }: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
    setError
  } = useForm<RequestIssueFormData>({
    mode: 'onChange'
  });
  const btcAmount = watch(WRAPPED_TOKEN_AMOUNT) || '0';

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [vaultCapacity, setVaultCapacity] = React.useState(BitcoinAmount.zero());
  const [issueFeeRate, setIssueFeeRate] = React.useState(new Big(DEFAULT_ISSUE_BRIDGE_FEE_RATE));
  const [depositRate, setDepositRate] = React.useState(new Big(DEFAULT_ISSUE_GRIEFING_COLLATERAL_RATE));
  const [btcToGovernanceTokenRate, setBTCToGovernanceTokenRate] = React.useState(
    new ExchangeRate<Bitcoin, GovernanceCurrency>(Bitcoin, GOVERNANCE_TOKEN, new Big(0))
  );
  const [dustValue, setDustValue] = React.useState(new BitcoinAmount(DEFAULT_ISSUE_DUST_AMOUNT));
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submittedRequest, setSubmittedRequest] = React.useState<Issue>();

  const { t } = useTranslation();
  const prices = useGetPrices();

  const { data: blockHeight } = useGetBtcBlockHeight();

  const handleError = useErrorHandler();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { data: balances, isLoading: isBalancesLoading } = useGetBalances();

  const vaultAccountId = useAccountId(vaultAddress);

  const transaction = useTransaction(Transaction.ISSUE_REQUEST, { showSuccessModal: false });

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;
    if (!vaultAccountId) return;
    if (!collateralToken) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          feeRateResult,
          depositRateResult,
          dustValueResult,
          btcToGovernanceTokenResult,
          vaultIssuableAmountResult
        ] = await Promise.allSettled([
          // Loading this data is not strictly required as long as the constantly set values did
          // not change. However, you will not see the correct value for the security deposit.
          window.bridge.fee.getIssueFee(),
          window.bridge.fee.getIssueGriefingCollateralRate(),
          window.bridge.issue.getDustValue(),
          getExchangeRate(GOVERNANCE_TOKEN),
          // MEMO: this always uses KSM as collateral token
          window.bridge.issue.getVaultIssuableAmount(vaultAccountId, collateralToken)
        ]);
        setStatus(STATUSES.RESOLVED);
        if (feeRateResult.status === 'fulfilled') {
          setIssueFeeRate(feeRateResult.value);
        }
        if (depositRateResult.status === 'fulfilled') {
          setDepositRate(depositRateResult.value);
        }
        if (dustValueResult.status === 'fulfilled') {
          setDustValue(dustValueResult.value);
        }
        if (vaultIssuableAmountResult.status === 'fulfilled') {
          setVaultCapacity(vaultIssuableAmountResult.value);
        }
        if (btcToGovernanceTokenResult.status === 'fulfilled') {
          setBTCToGovernanceTokenRate(btcToGovernanceTokenResult.value);
        } else {
          setError(WRAPPED_TOKEN_AMOUNT, {
            type: 'validate',
            message: t('error_oracle_offline', { action: 'issue', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
          });
        }
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [collateralToken, bridgeLoaded, handleError, vaultAccountId, setError, t]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING || vaultAccountId === undefined || isBalancesLoading) {
    return <></>;
  }

  const governanceTokenBalance = balances?.[GOVERNANCE_TOKEN.ticker];

  if (governanceTokenBalance === undefined) {
    throw new Error('Something went wrong!');
  }

  const onSubmit = async (data: RequestIssueFormData) => {
    setSubmitStatus(STATUSES.PENDING);

    await trigger(WRAPPED_TOKEN_AMOUNT);

    const wrappedTokenAmount = new BitcoinAmount(data[WRAPPED_TOKEN_AMOUNT] || '0');

    const vaults = await window.bridge.vaults.getVaultsWithIssuableTokens();

    try {
      const result = await transaction.executeAsync(
        wrappedTokenAmount,
        vaultAccountId,
        collateralToken,
        false, // default
        vaults
      );

      const issueRequests = await getIssueRequestsFromExtrinsicResult(window.bridge, result.data);

      // TODO: handle issue aggregation
      const issueRequest = issueRequests[0];
      handleSubmittedRequestModalOpen(issueRequest);
      setSubmitStatus(STATUSES.RESOLVED);
      onClose();
    } catch (e) {
      setSubmitStatus(STATUSES.IDLE);
    }
  };

  const validateForm = (value: string): string | undefined => {
    const numericValue = Number(value || '0');
    const btcAmount = new BitcoinAmount(numericValue);

    const securityDeposit = btcToGovernanceTokenRate.toCounter(btcAmount).mul(depositRate);
    const minRequiredGovernanceTokenAmount = TRANSACTION_FEE_AMOUNT.add(securityDeposit);
    if (governanceTokenBalance.free.lte(minRequiredGovernanceTokenAmount)) {
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

    if (blockHeight?.isOutdated) {
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

  const handleClickVaultBalance = async () => {
    setValue(WRAPPED_TOKEN_AMOUNT, vaultCapacity.toString());
    await trigger(WRAPPED_TOKEN_AMOUNT);
  };

  const parsedBTCAmount = new BitcoinAmount(btcAmount);
  const bridgeFee = parsedBTCAmount.mul(issueFeeRate);
  const securityDeposit = btcToGovernanceTokenRate.toCounter(parsedBTCAmount).mul(depositRate);
  const wrappedTokenAmount = parsedBTCAmount.sub(bridgeFee);

  // `btcToGovernanceTokenRate` has 0 value only if oracle call is unsuccessful
  const isOracleOffline = btcToGovernanceTokenRate.toBig().eq(0);

  return (
    <>
      <Modal isOpen={open} onClose={onClose}>
        <ModalHeader>{t('vault.request_issue')}</ModalHeader>
        <ModalBody>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <p>{t('vault.issue_description')}</p>
            <p>
              {t('vault.max_capacity')}{' '}
              <InterlayButtonBase type='button' onClick={handleClickVaultBalance}>
                <strong>{vaultCapacity.toHuman(8)} BTC</strong>
              </InterlayButtonBase>
            </p>
            <p>{t('vault.issue_amount')}</p>
            <div>
              <TokenField
                id={WRAPPED_TOKEN_AMOUNT}
                label='BTC'
                min={0}
                {...register(WRAPPED_TOKEN_AMOUNT, {
                  required: {
                    value: true,
                    message: t('issue_page.enter_valid_amount')
                  },
                  validate: (value) => validateForm(value)
                })}
                approxUSD={`≈ ${displayMonetaryAmountInUSDFormat(
                  parsedBTCAmount || BitcoinAmount.zero(),
                  getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
                )}`}
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
              approxUSD={displayMonetaryAmountInUSDFormat(
                bridgeFee,
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              )}
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
              approxUSD={displayMonetaryAmountInUSDFormat(
                securityDeposit,
                getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
              )}
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
              value={displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)}
              unitName={GOVERNANCE_TOKEN_SYMBOL}
              approxUSD={displayMonetaryAmountInUSDFormat(
                TRANSACTION_FEE_AMOUNT,
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
              approxUSD={displayMonetaryAmountInUSDFormat(
                wrappedTokenAmount,
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              )}
            />
            <AuthCTA fullWidth type='submit' loading={submitStatus === STATUSES.PENDING}>
              {t('confirm')}
            </AuthCTA>
          </form>
        </ModalBody>
      </Modal>
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
