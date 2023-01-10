import { CollateralCurrencyExt, CurrencyExt, GovernanceCurrency } from '@interlay/interbtc-api';
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
import {
  convertMonetaryAmountToValueInUSD,
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat
} from '@/common/utils/utils';
import { CTA, Input, Stack, TokenInput } from '@/component-library';
import { ISSUE_BRIDGE_FEE_RATE, ISSUE_GRIEFING_COLLATERAL_RATE } from '@/config/parachain';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  TRANSACTION_FEE_AMOUNT,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { TreasuryAction } from '@/types/general.d';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getExchangeRate } from '@/utils/helpers/oracle';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import useAccountId from '@/utils/hooks/use-account-id';

import { HighlightDescriptionItem } from './HighlightDescriptionItem';
import { IssueDescriptionItem } from './IssueDescriptionItem';
import { StyledDescription, StyledDl, StyledHr, StyledInputLabel, StyledTitle } from './IssueRedeemForm.styles';

const ISSUE_AMOUNT = 'issue-amount';
const REDEEM_AMOUNT = 'withdraw-collateral-amount';

type IssueRedeemFormData = {
  [ISSUE_AMOUNT]?: string;
  [REDEEM_AMOUNT]?: string;
};

const collateralInputId: Record<TreasuryAction, keyof IssueRedeemFormData> = {
  issue: ISSUE_AMOUNT,
  redeem: REDEEM_AMOUNT
};

type Props = {
  variant?: TreasuryAction;
  onSubmit?: () => void;
  collateralToken: CurrencyExt;
  remainingCapacity: MonetaryAmount<CollateralCurrencyExt>;
  lockedAmountBTC: string;
  wrappedId: string;
};

type InheritAttrs = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props | 'children'>;

type IssueRedeemFormProps = Props & InheritAttrs;

const IssueRedeemForm = ({
  variant = 'issue',
  onSubmit,
  collateralToken,
  remainingCapacity,
  lockedAmountBTC,
  wrappedId,
  ...props
}: IssueRedeemFormProps): JSX.Element => {
  const { register, handleSubmit: h, watch, setError, setValue } = useForm<IssueRedeemFormData>({
    mode: 'onChange'
  });
  const tokenInputId = collateralInputId[variant];
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: vaultAddress } = useParams<Record<string, string>>();
  const prices = useGetPrices();

  const inputBTCAmount = watch(tokenInputId) || '0';

  // const [status, setStatus] = useState(STATUSES.IDLE);
  // const [vaultCapacity, setVaultCapacity] = useState(BitcoinAmount.zero());
  const [issueFeeRate, setIssueFeeRate] = useState(new Big(ISSUE_BRIDGE_FEE_RATE)); // Set default to 0.5%
  // ray test touch <<
  const [depositRate, setDepositRate] = useState(new Big(ISSUE_GRIEFING_COLLATERAL_RATE)); // Set default to 0.005%
  // ray test touch >>
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
        // setStatus(STATUSES.RESOLVED);
        if (feeRateResult.status === 'fulfilled') {
          setIssueFeeRate(feeRateResult.value);
        }
        if (depositRateResult.status === 'fulfilled') {
          setDepositRate(depositRateResult.value);
        }
        if (dustValueResult.status === 'fulfilled') {
          // setDustValue(theDustValue.value);
        }
        if (vaultIssuableAmountResult.status === 'fulfilled') {
          // setVaultCapacity(vaultIssuableAmountResult.value);
        }
        if (btcToGovernanceTokenResult.status === 'fulfilled') {
          setBTCToGovernanceTokenRate(btcToGovernanceTokenResult.value);
        } else {
          setError(tokenInputId, {
            type: 'validate',
            message: t('error_oracle_offline', { action: 'issue', wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL })
          });
        }
      } catch (error) {
        // setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [collateralToken, bridgeLoaded, handleError, vaultAccountId, setError, t, tokenInputId]);

  const btcAddressLabelId = useId();
  const amountLabelId = useId();

  const isIssueModal = variant === 'issue';
  const title = isIssueModal ? `Issue ${wrappedId}` : `Redeem ${wrappedId}`;
  const label = isIssueModal ? 'Issue amount' : 'Reddem amount';
  const highlightTerm = isIssueModal ? 'Maximum vault capacity:' : 'Locked:';

  const handleSubmit = (data: IssueRedeemFormData) => {
    onSubmit?.();
    console.log(data);
  };

  const parsedBTCAmount = new BitcoinAmount(inputBTCAmount);
  const bridgeFee = parsedBTCAmount.mul(issueFeeRate);
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
              onClick={() => setValue(tokenInputId, 1 as any)}
              term={highlightTerm}
              detail={`${isIssueModal ? remainingCapacity : lockedAmountBTC} BTC`}
            />
            {/* This needs to be in the Input component */}
            <StyledInputLabel id={amountLabelId}>{label}</StyledInputLabel>
            <TokenInput
              aria-labelledby={amountLabelId}
              ticker='BTC'
              placeholder='0.00'
              id={tokenInputId}
              {...register(tokenInputId, {
                required: {
                  value: true,
                  message: t('issue_page.enter_valid_amount')
                }
                // validate: (value) => validateForm(value)
              })}
              valueUSD={
                convertMonetaryAmountToValueInUSD(
                  parsedBTCAmount || BitcoinAmount.zero(),
                  getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
                ) ?? 0
              }
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
                  detail={`${displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} ${GOVERNANCE_TOKEN_SYMBOL}`}
                  subdetail={`(${displayMonetaryAmountInUSDFormat(
                    TRANSACTION_FEE_AMOUNT,
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
