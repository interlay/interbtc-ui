import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { FormHTMLAttributes, useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatNumber, formatUSD } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenInput } from '@/component-library';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { CollateralActions, CollateralStatus, CollateralStatusRanges } from '../../types';
import { getCollateralStatus } from '../../utils';
import { CollateralScore } from '../CollateralScore';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr, StyledTitle } from './CollateralForm.styles';

const getCollateralStatusLabel = (status: CollateralStatus) => {
  switch (status) {
    case 'error':
      return '(High Risk)';
    case 'warning':
      return '(Medium Risk)';
    case 'success':
      return '(Low Risk)';
  }
};

const getCollateralTokenAmount = (
  vaultCollateral: Big,
  inputCollateral: MonetaryAmount<CollateralCurrencyExt>,
  token: CurrencyExt,
  collateralAction: CollateralActions
) => {
  let amount = newMonetaryAmount(vaultCollateral, token, true) as MonetaryAmount<CollateralCurrencyExt>;

  switch (collateralAction) {
    case 'deposit': {
      amount = amount.add(inputCollateral);
      break;
    }
    case 'withdraw': {
      amount = amount.sub(inputCollateral);
      break;
    }
  }

  return amount;
};

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';
const WITHDRAW_COLLATERAL_AMOUNT = 'withdraw-collateral-amount';

type CollateralFormData = {
  [DEPOSIT_COLLATERAL_AMOUNT]?: string;
  [WITHDRAW_COLLATERAL_AMOUNT]?: string;
};

const collateralInputId: Record<CollateralActions, keyof CollateralFormData> = {
  deposit: DEPOSIT_COLLATERAL_AMOUNT,
  withdraw: WITHDRAW_COLLATERAL_AMOUNT
};

type Props = {
  collateral: VaultData['collateral'];
  collateralToken: CurrencyExt;
  variant?: CollateralActions;
  onSubmit?: () => void;
  ranges: CollateralStatusRanges;
};

type NativeAttrs = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props | 'children'>;

type CollateralFormProps = Props & NativeAttrs;

const CollateralForm = ({
  variant = 'deposit',
  onSubmit,
  collateral,
  collateralToken,
  ranges,
  ...props
}: CollateralFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: vaultAddress } = useParams<Record<string, string>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prices = useGetPrices();
  const { register, handleSubmit: h, watch } = useForm<CollateralFormData>({
    mode: 'onChange'
  });
  const [score, setScore] = useState(0);

  const tokenInputId = collateralInputId[variant];
  const inputCollateral = watch(tokenInputId) || '0';
  const inputCollateralAmount = newMonetaryAmount(
    inputCollateral,
    collateralToken,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;

  const {
    isIdle: requiredCollateralTokenAmountIdle,
    isLoading: requiredCollateralTokenAmountLoading,
    data: requiredCollateralTokenAmount,
    error: requiredCollateralTokenAmountError
  } = useQuery<MonetaryAmount<CollateralCurrencyExt>, Error>(
    [GENERIC_FETCHER, 'vaults', 'getRequiredCollateralForVault', vaultAddress, collateralToken],
    genericFetcher<MonetaryAmount<CollateralCurrencyExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(requiredCollateralTokenAmountError);

  const collateralTokenAmount = getCollateralTokenAmount(
    collateral.amount,
    inputCollateralAmount,
    collateralToken,
    variant
  );

  const { isLoading: isGetCollateralizationLoading, data: unparsedScore, error } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getVaultCollateralization', vaultAddress, collateralToken, collateralTokenAmount],
    genericFetcher<Big>(),
    {
      enabled: bridgeLoaded
      // TODO: add hasLockedBTC
      //    && hasLockedBTC
    }
  );
  useErrorHandler(error);

  useEffect(() => {
    if (!isGetCollateralizationLoading) {
      setScore(unparsedScore?.toNumber() ?? 0);
    }
  }, [isGetCollateralizationLoading, unparsedScore]);

  const handleSubmit = async (data: CollateralFormData) => {
    if (!bridgeLoaded) return;
    onSubmit?.();
    setIsSubmitting(true);

    try {
      const collateralTokenAmount = newMonetaryAmount(
        data[tokenInputId] || '0',
        collateralToken,
        true
      ) as MonetaryAmount<CollateralCurrencyExt>;

      switch (variant) {
        case 'deposit': {
          await window.bridge.vaults.depositCollateral(collateralTokenAmount);
          break;
        }
        case 'withdraw': {
          await window.bridge.vaults.withdrawCollateral(collateralTokenAmount);
          break;
        }
      }

      // TODO: state changes

      // const balanceLockedCollateral = (await window.bridge.tokens.balance(collateralToken, vaultAddress)).reserved;
      //   dispatch(updateCollateralAction(balanceLockedCollateral as MonetaryAmount<CollateralCurrencyExt>));

      //   if (vaultCollateralization === undefined) {
      //     dispatch(updateCollateralizationAction('∞'));
      //   } else {
      //     // The vault API returns collateralization as a regular number rather than a percentage
      //     const strVaultCollateralizationPercentage = vaultCollateralization.mul(100).toString();
      //     dispatch(updateCollateralizationAction(strVaultCollateralizationPercentage));
      //   }

      //   toast.success(t('vault.successfully_updated_collateral'));
      //   setSubmitStatus(STATUSES.RESOLVED);
      //   onClose();
    } catch (error) {
      // toast.error(error.message);
      // handleError(error);
      setIsSubmitting(false);
    }
  };

  const validateCollateralTokenAmount = (value?: string): string | undefined => {
    const collateralTokenAmount = newMonetaryAmount(value || '0', collateralToken, true);

    // Collateral update only allowed if above required collateral
    if (variant === 'withdraw' && requiredCollateralTokenAmount) {
      const maxWithdrawableCollateralTokenAmount = collateralTokenAmount.sub(requiredCollateralTokenAmount);

      return collateralTokenAmount.gt(maxWithdrawableCollateralTokenAmount)
        ? t('vault.collateral_below_threshold')
        : undefined;
    }

    if (collateralTokenAmount.lte(newMonetaryAmount(0, collateralToken, true))) {
      return t('vault.collateral_higher_than_0');
    }

    // Represents being less than 1 Planck
    if (collateralTokenAmount.toBig(0).lte(1)) {
      return 'Please enter an amount greater than 1 Planck';
    }

    // if (collateralBalance && collateralTokenAmount.gt(collateralBalance.transferable)) {
    //   return t(`Must be less than ${collateralToken.ticker} balance!`);
    // }

    if (!bridgeLoaded) {
      return 'Bridge must be loaded!';
    }

    return undefined;
  };

  const collateralUSDAmount = getTokenPrice(prices, collateralToken.ticker)?.usd;
  const isMinCollateralLoading = requiredCollateralTokenAmountIdle || requiredCollateralTokenAmountLoading;

  const titleId = useId();
  const title = variant === 'deposit' ? 'Deposit Collateral' : 'Withdraw Collateral';

  // TODO: handle infinity collateralization in form
  const collateralStatus = getCollateralStatus(score, ranges, false);

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledTitle id={titleId}>{title}</StyledTitle>
        <TokenInput
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={collateralToken.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(
            inputCollateralAmount,
            getTokenPrice(prices, collateralToken.ticker)?.usd
          )}
          id={tokenInputId}
          {...register(tokenInputId, {
            required: {
              value: true,
              message: t('vault.collateral_is_required')
            },
            validate: validateCollateralTokenAmount
          })}
        />
        <StyledDl>
          <StyledDItem color='tertiary'>
            <StyledDt>Current Total Collateral</StyledDt>
            <StyledDd>
              {formatNumber(collateral.amount.toNumber())} {collateralToken.ticker} ({formatUSD(collateral.usd)})
            </StyledDd>
          </StyledDItem>
          <StyledDItem>
            <StyledDt>Minimum Required Collateral</StyledDt>
            <StyledDd>
              {isMinCollateralLoading ? (
                '-'
              ) : (
                <>
                  {displayMonetaryAmount(requiredCollateralTokenAmount)} {collateralToken.ticker} (
                  {displayMonetaryAmountInUSDFormat(requiredCollateralTokenAmount as any, collateralUSDAmount)})
                </>
              )}
            </StyledDd>
          </StyledDItem>
          <CollateralScore
            score={score}
            label={<StyledDt>New Collateralization</StyledDt>}
            sublabel={<StyledDd>{getCollateralStatusLabel(collateralStatus)}</StyledDd>}
            ranges={ranges}
          />
          <StyledDItem>
            <StyledDt>New liquidation Price</StyledDt>
            <StyledDd>
              {formatUSD(12.32)} {collateralToken.ticker} / {formatUSD(42324.32)} BTC
            </StyledDd>
          </StyledDItem>
          <StyledHr />
          <StyledDItem>
            <StyledDt>Fees</StyledDt>
            <StyledDd>
              <Span color='secondary'>0.01 KINT</Span> ({formatUSD(0.24)})
            </StyledDd>
          </StyledDItem>
        </StyledDl>
        <CTA type='submit' fullWidth disabled={isSubmitting}>
          {title}
        </CTA>
      </Stack>
    </form>
  );
};

export { CollateralForm };
export type { CollateralFormProps };
