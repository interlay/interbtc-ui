import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, CollateralIdLiteral, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { FormHTMLAttributes } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import * as z from 'zod';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenField } from '@/component-library';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getCurrency } from '@/utils/helpers/currencies';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr, StyledTitle } from './CollateralForm.styles';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';

type CollateralFormData = { [DEPOSIT_COLLATERAL_AMOUNT]: string };

const validateDepositCollateral = ({ minAmount = new Big(0) }: { minAmount?: Big }) =>
  z
    .string()
    .min(1, { message: 'Required' })
    .transform((str) => new Big(str))
    .refine((val) => val.gte(minAmount), {
      message: 'Deposit should be equal or greater than minimum required collateral'
    });

type Props = {
  collateralToken: CollateralIdLiteral;
  onSubmit?: () => void;
};

type NativeAttrs = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props | 'children'>;

type CollateralFormProps = Props & NativeAttrs;

const CollateralForm = ({ onSubmit, collateralToken, ...props }: CollateralFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: vaultAddress } = useParams<Record<string, string>>();
  const prices = useGetPrices();

  const collateralCurrency = getCurrency(collateralToken);
  const {
    isIdle: requiredCollateralTokenAmountIdle,
    isLoading: requiredCollateralTokenAmountLoading,
    data: requiredCollateralTokenAmount,
    error: requiredCollateralTokenAmountError
  } = useQuery<MonetaryAmount<CollateralCurrencyExt>, Error>(
    [GENERIC_FETCHER, 'vaults', 'getRequiredCollateralForVault', vaultAddress, collateralCurrency],
    genericFetcher<MonetaryAmount<CollateralCurrencyExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(requiredCollateralTokenAmountError);

  const isMinCollateralLoading = requiredCollateralTokenAmountIdle || requiredCollateralTokenAmountLoading;

  const schema = z.object({
    [DEPOSIT_COLLATERAL_AMOUNT]: validateDepositCollateral({ minAmount: requiredCollateralTokenAmount?.toBig() })
  });

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors }
  } = useForm<CollateralFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const inputCollateral = watch(DEPOSIT_COLLATERAL_AMOUNT) || '0';
  const inputCollateralAmount = newMonetaryAmount(
    inputCollateral,
    collateralCurrency,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;

  const handleSubmit = async (data: CollateralFormData) => {
    onSubmit?.();
    console.log(data, errors);
  };

  const collateralUSDAmount = getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd;

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledTitle id={titleId}>Deposit Collateral</StyledTitle>
        {/* TODO: Balance */}
        <TokenField
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={collateralCurrency.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(
            inputCollateralAmount,
            getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd
          )}
          {...register(DEPOSIT_COLLATERAL_AMOUNT, {
            required: {
              value: true,
              message: t('vault.collateral_is_required')
            }
          })}
        />
        <StyledDl>
          <StyledDItem>
            <StyledDt>Minimum Required Collateral</StyledDt>
            <StyledDd>
              {isMinCollateralLoading ? (
                '-'
              ) : (
                <>
                  {displayMonetaryAmount(requiredCollateralTokenAmount)} {collateralCurrency.ticker} (
                  {displayMonetaryAmountInUSDFormat(requiredCollateralTokenAmount as any, collateralUSDAmount)})
                </>
              )}
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
          Deposit Collateral
        </CTA>
      </Stack>
    </form>
  );
};

export { CollateralForm };
export type { CollateralFormProps };
