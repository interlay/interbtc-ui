import { CollateralCurrencyExt, CurrencyExt, GovernanceCurrency, newMonetaryAmount } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate, MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { FormHTMLAttributes, useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CTA, Input, Stack, TokenField } from '@/component-library';
import { GOVERNANCE_TOKEN, GOVERNANCE_TOKEN_SYMBOL, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import useAccountId from '@/utils/hooks/use-account-id';

import { TreasuryActions } from '../../types';
import { HighlightDescriptionItem } from './HighlightDescriptionItem';
import { IssueDescriptionItem } from './IssueDescriptionItem';
import { StyledDescription, StyledDl, StyledHr, StyledInputLabel, StyledTitle } from './IssueRedeemForm.styles';

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

const ISSUE_AMOUNT = 'issue-amount';
const REDEEM_AMOUNT = 'withdraw-collateral-amount';

type IssueRedeemFormData = {
  [ISSUE_AMOUNT]?: string;
  [REDEEM_AMOUNT]?: string;
};

const collateralInputId: Record<TreasuryActions, keyof IssueRedeemFormData> = {
  issue: ISSUE_AMOUNT,
  redeem: REDEEM_AMOUNT
};

type Props = {
  variant?: TreasuryActions;
  onSubmit?: () => void;
  collateralToken: CurrencyExt;
  remainingCapacity: MonetaryAmount<CollateralCurrencyExt>;
  lockedAmountBTC: string;
};

type InheritAttrs = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props | 'children'>;

type IssueRedeemFormProps = Props & InheritAttrs;

const IssueRedeemForm = ({
  variant = 'issue',
  onSubmit,
  collateralToken,
  remainingCapacity,
  lockedAmountBTC,
  ...props
}: IssueRedeemFormProps): JSX.Element => {
  const { register, handleSubmit: h, watch, setError, setValue } = useForm<IssueRedeemFormData>({
    mode: 'onChange'
  });
  const tokenFieldId = collateralInputId[variant];
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: vaultAddress } = useParams<Record<string, string>>();
  const prices = useGetPrices();

  const inputBTCAmount = watch(tokenFieldId) || '0';

  // const [status, setStatus] = useState(STATUSES.IDLE);
  // const [vaultCapacity, setVaultCapacity] = useState(BitcoinAmount.zero());
  const [feeRate, setFeeRate] = useState(new Big(0.005)); // Set default to 0.5%
  const [depositRate, setDepositRate] = useState(new Big(0.00005)); // Set default to 0.005%
  const [btcToGovernanceTokenRate, setBTCToGovernanceTokenRate] = useState(
    new ExchangeRate<Bitcoin, GovernanceCurrency>(Bitcoin, GOVERNANCE_TOKEN, new Big(0))
  );
  // const [dustValue, setDustValue] = useState(BitcoinAmount.zero());
  // const [submitStatus, setSubmitStatus] = useState(STATUSES.IDLE);
  // const [submitError, setSubmitError] = useState<Error | null>(null);
  // const [submittedRequest, setSubmittedRequest] = useState<Issue>();

  const { t } = useTranslation();
  // const prices = useGetPrices();
  // const focusRef = useRef(null);

  const handleError = useErrorHandler();

  const {
    bridgeLoaded
    // , address, bitcoinHeight, btcRelayHeight, parachainStatus
  } = useSelector((state: StoreType) => state.general);

  // const {
  //   governanceTokenBalanceIdle,
  //   governanceTokenBalanceLoading,
  //   governanceTokenBalance
  // } = useGovernanceTokenBalance();

  const vaultAccountId = useAccountId(vaultAddress);

  useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;
    if (!vaultAccountId) return;
    if (!collateralToken) return;

    (async () => {
      try {
        // setStatus(STATUSES.PENDING);
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
          window.bridge.issue.getVaultIssuableAmount(vaultAccountId, collateralToken)
        ]);
        // setStatus(STATUSES.RESOLVED);
        if (theFeeRate.status === 'fulfilled') {
          setFeeRate(theFeeRate.value);
        }
        if (theDepositRate.status === 'fulfilled') {
          setDepositRate(theDepositRate.value);
        }
        if (theDustValue.status === 'fulfilled') {
          // setDustValue(theDustValue.value);
        }
        if (issuableAmount.status === 'fulfilled') {
          // setVaultCapacity(issuableAmount.value);
        }
        if (theBtcToGovernanceToken.status === 'fulfilled') {
          setBTCToGovernanceTokenRate(theBtcToGovernanceToken.value);
        } else {
          setError(tokenFieldId, {
            type: 'validate',
            message: t('error_oracle_offline', { action: 'issue', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
          });
        }
      } catch (error) {
        // setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [collateralToken, bridgeLoaded, handleError, vaultAccountId, setError, t, tokenFieldId]);

  const btcAddressLabelId = useId();
  const amountLabelId = useId();

  const isIssueModal = variant === 'issue';
  const title = isIssueModal ? 'Issue kBTC' : 'Redeem kBTC';
  const label = isIssueModal ? 'Issue amount' : 'Reddem amount';
  const highlightTerm = isIssueModal ? 'Maximum vault capacity:' : 'Locked:';

  const handleSubmit = (data: IssueRedeemFormData) => {
    onSubmit?.();
    console.log(data);
  };

  const parsedBTCAmount = new BitcoinAmount(inputBTCAmount);
  const bridgeFee = parsedBTCAmount.mul(feeRate);
  const securityDeposit = btcToGovernanceTokenRate.toCounter(parsedBTCAmount).mul(depositRate);
  const wrappedTokenAmount = parsedBTCAmount.sub(bridgeFee);

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='single'>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription color='tertiary'>{`You are requesting to ${variant} with this vault.`}</StyledDescription>
        <StyledDl>
          <Stack>
            <HighlightDescriptionItem
              clickable={!isIssueModal}
              onClick={() => setValue(tokenFieldId, 1 as any)}
              term={highlightTerm}
              detail={`${isIssueModal ? remainingCapacity : lockedAmountBTC} BTC`}
            />
            {/* This needs to be in the Input component */}
            <StyledInputLabel id={amountLabelId}>{label}</StyledInputLabel>
            <TokenField
              aria-labelledby={amountLabelId}
              tokenSymbol='BTC'
              placeholder='0.00'
              id={tokenFieldId}
              {...register(tokenFieldId, {
                required: {
                  value: true,
                  message: t('issue_page.enter_valid_amount')
                }
                // validate: (value) => validateForm(value)
              })}
              valueInUSD={displayMonetaryAmountInUSDFormat(
                parsedBTCAmount || BitcoinAmount.zero(),
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              )}
            />

            {isIssueModal && (
              <Stack spacing='half'>
                <IssueDescriptionItem
                  informative
                  term='Bridge Fee'
                  detail={`${displayMonetaryAmount(bridgeFee)} BTC`}
                  subdetail={`(${displayMonetaryAmountInUSDFormat(
                    bridgeFee,
                    getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
                  )})`}
                />
                <IssueDescriptionItem
                  informative
                  term='Security Deposit'
                  detail={`${displayMonetaryAmount(securityDeposit)} ${GOVERNANCE_TOKEN_SYMBOL}`}
                  subdetail={`(${displayMonetaryAmountInUSDFormat(
                    securityDeposit,
                    getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
                  )})`}
                />
                <IssueDescriptionItem
                  informative
                  term='Transaction Fee'
                  detail={`${displayMonetaryAmount(extraRequiredCollateralTokenAmount)} ${GOVERNANCE_TOKEN_SYMBOL}`}
                  subdetail={`(${displayMonetaryAmountInUSDFormat(
                    extraRequiredCollateralTokenAmount,
                    getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
                  )})`}
                />
                <StyledHr />
                <IssueDescriptionItem
                  term='You will receive'
                  detail={`${displayMonetaryAmount(wrappedTokenAmount)} BTC`}
                  subdetail={`(${displayMonetaryAmountInUSDFormat(
                    wrappedTokenAmount,
                    getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
                  )})`}
                />
              </Stack>
            )}
          </Stack>
        </StyledDl>
        {!isIssueModal && (
          <div>
            {/* This needs to be in the Input component */}
            <StyledInputLabel id={btcAddressLabelId}>BTC address</StyledInputLabel>
            <Input aria-labelledby={btcAddressLabelId} placeholder='Enter your BTC address' />
          </div>
        )}
        <CTA type='submit' fullWidth>
          Confirm
        </CTA>
      </Stack>
    </form>
  );
};

export { IssueRedeemForm };
export type { IssueRedeemFormProps };
