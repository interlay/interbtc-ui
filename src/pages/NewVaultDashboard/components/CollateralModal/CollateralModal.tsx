import { CollateralCurrencyExt, CollateralIdLiteral, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { FormHTMLAttributes, useEffect, useMemo } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatNumber, formatUSD } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenField } from '@/component-library';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { useGetColateralization } from '../../hooks/use-get-colateralization';
import { CollateralActions } from '../../types';
import { CollateralScore, CollateralScoreProps } from '../CollateralScore';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr, StyledTitle } from './CollateralModal.styles';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';
const WITHDRAW_COLLATERAL_AMOUNT = 'withdraw-collateral-amount';

type CollateralModalData = {
  [DEPOSIT_COLLATERAL_AMOUNT]?: string;
  [WITHDRAW_COLLATERAL_AMOUNT]?: string;
};

const collateralInputId: Record<CollateralActions, keyof CollateralModalData> = {
  deposit: DEPOSIT_COLLATERAL_AMOUNT,
  withdraw: WITHDRAW_COLLATERAL_AMOUNT
};

type Props = {
  collateral: VaultData['collateral'];
  score: number;
  token: CurrencyExt;
  variant?: CollateralActions;
  onSubmit?: () => void;
  ranges: CollateralScoreProps['ranges'];
};

type NativeAttrs = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props | 'children'>;

type CollateralModalProps = Props & NativeAttrs;

const CollateralModal = ({
  variant = 'deposit',
  onSubmit,
  collateral,
  token,
  ranges,
  ...props
}: CollateralModalProps): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: vaultAddress } = useParams<Record<string, string>>();

  const prices = useGetPrices();
  const { register, handleSubmit: h, watch } = useForm<CollateralModalData>({
    mode: 'onChange'
  });

  const tokenFieldId = collateralInputId[variant];
  const inputCollateral = watch(tokenFieldId) || '0';
  const inputCollateralAmount = newMonetaryAmount(
    inputCollateral,
    token,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;

  const {
    isIdle: requiredCollateralTokenAmountIdle,
    isLoading: requiredCollateralTokenAmountLoading,
    data: requiredCollateralTokenAmount,
    error: requiredCollateralTokenAmountError
  } = useQuery<MonetaryAmount<CollateralCurrencyExt>, Error>(
    [GENERIC_FETCHER, 'vaults', 'getRequiredCollateralForVault', vaultAddress, token],
    genericFetcher<MonetaryAmount<CollateralCurrencyExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(requiredCollateralTokenAmountError);

  const collateralTokenAmount = useMemo(
    () => newMonetaryAmount(collateral.amount, token, true) as MonetaryAmount<CollateralCurrencyExt>,
    [collateral.amount, token]
  )[variant === 'deposit' ? 'add' : 'sub'](inputCollateralAmount);

  const { data: score, get: getCollateralization } = useGetColateralization(
    vaultAddress,
    token,
    collateralTokenAmount,
    variant
  );

  useEffect(() => {
    getCollateralization(inputCollateralAmount);
  }, [getCollateralization, inputCollateralAmount]);

  const handleSubmit = (data: CollateralModalData) => {
    onSubmit?.();
    console.log(data);
  };

  const collateralUSDAmount = getTokenPrice(prices, token.ticker as CollateralIdLiteral)?.usd;
  const isMinCollateralLoading = requiredCollateralTokenAmountIdle || requiredCollateralTokenAmountLoading;

  const titleId = useId();
  const title = variant === 'deposit' ? 'Deposit Collateral' : 'Withdraw Collateral';

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledTitle id={titleId}>{title}</StyledTitle>
        <TokenField
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={token.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(
            inputCollateralAmount,
            getTokenPrice(prices, token.ticker as CollateralIdLiteral)?.usd
          )}
          id={tokenFieldId}
          {...register(tokenFieldId, {
            required: {
              value: true,
              message: 'TODO'
            }
          })}
        />
        <StyledDl>
          <StyledDItem color='tertiary'>
            <StyledDt>Current Total Collateral</StyledDt>
            <StyledDd>
              {formatNumber(collateral.amount.toNumber())} {token.ticker} ({formatUSD(collateral.usd)})
            </StyledDd>
          </StyledDItem>
          <StyledDItem>
            <StyledDt>Minimum Required Collateral</StyledDt>
            <StyledDd>
              {isMinCollateralLoading ? (
                '-'
              ) : (
                <>
                  {displayMonetaryAmount(requiredCollateralTokenAmount)} {token.ticker} (
                  {displayMonetaryAmountInUSDFormat(requiredCollateralTokenAmount as any, collateralUSDAmount)})
                </>
              )}
            </StyledDd>
          </StyledDItem>
          <CollateralScore
            score={score?.toNumber() ?? 0}
            label={<StyledDt>New Collateralization</StyledDt>}
            sublabel={<StyledDd>(high risk)</StyledDd>}
            ranges={ranges}
          />
          <StyledDItem>
            <StyledDt>New liquidation Price</StyledDt>
            <StyledDd>
              {formatUSD(12.32)} {token.ticker} / {formatUSD(42324.32)} BTC
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
        <CTA type='submit' fullWidth>
          {title}
        </CTA>
      </Stack>
    </form>
  );
};

export { CollateralModal };
export type { CollateralModalProps };
