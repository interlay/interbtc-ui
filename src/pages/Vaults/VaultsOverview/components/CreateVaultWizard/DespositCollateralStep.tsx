import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, CollateralIdLiteral, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as z from 'zod';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenField } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { useGovernanceTokenBalance } from '@/services/hooks/use-token-balance';
import { getCurrency } from '@/utils/helpers/currencies';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDd, StyledDepositTitle, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';
import { StepComponentProps } from './types';
const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';

type CollateralFormData = { [DEPOSIT_COLLATERAL_AMOUNT]: string };

const validateDepositCollateral = ({ minAmount }: { minAmount: Big }) =>
  z
    .string()
    .min(1, { message: 'Required' })
    .refine(
      (val) => val && new Big(val).gte(minAmount),

      {
        message: 'Deposit should be equal or greater than minimum required collateral'
      }
    );

const getCollateralSchema = ({ minAmount = new Big(0) }: { minAmount?: Big }) =>
  z.object({
    [DEPOSIT_COLLATERAL_AMOUNT]: validateDepositCollateral({ minAmount })
  });

type Props = {
  collateralToken: CollateralIdLiteral;
  onSuccessfulDeposit?: () => void;
};

type DespositCollateralStepProps = Props & StepComponentProps;

const componentStep = 2 as const;

const DespositCollateralStep = ({ step, ...props }: DespositCollateralStepProps): JSX.Element | null => {
  if (step !== componentStep) {
    return null;
  }

  return <Component {...props} />;
};

const Component = ({
  onSuccessfulDeposit,
  collateralToken,
  ...props
}: Omit<DespositCollateralStepProps, keyof StepComponentProps>): JSX.Element | null => {
  const titleId = useId();
  const { bridgeLoaded, collateralTokenBalance } = useSelector((state: StoreType) => state.general);
  const { governanceTokenBalance } = useGovernanceTokenBalance();
  const prices = useGetPrices();

  const collateralCurrency = getCurrency(collateralToken);
  const {
    isIdle: minCollateralIdle,
    isLoading: minCollateralLoading,
    data: minCollateral,
    error: minCollateralError
  } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getMinimumCollateral', collateralCurrency],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(minCollateralError);

  const registerNewVaultMutation = useMutation<void, Error, MonetaryAmount<CollateralCurrencyExt>>(
    (collateralAmount) => window.bridge.vaults.registerNewCollateralVault(collateralAmount),
    {
      onSuccess: onSuccessfulDeposit
    }
  );

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors }
  } = useForm<CollateralFormData>({
    mode: 'onChange',
    resolver: zodResolver(getCollateralSchema({ minAmount: minCollateral }))
  });

  const inputCollateral = watch(DEPOSIT_COLLATERAL_AMOUNT) || '0';
  const inputCollateralAmount = newMonetaryAmount(
    inputCollateral,
    collateralCurrency,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;

  const handleSubmit = async (data: CollateralFormData) => {
    const amount = newMonetaryAmount(
      data[DEPOSIT_COLLATERAL_AMOUNT],
      collateralCurrency,
      true
    ) as MonetaryAmount<CollateralCurrencyExt>;
    registerNewVaultMutation.mutate(amount);
    console.log(errors, data);
  };

  const minCollateralValue = minCollateral || new Big(0);
  const collateralUSDAmount = getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd;
  const minCollateralAmount = newMonetaryAmount(minCollateralValue, collateralCurrency);

  const isMinCollateralLoading = minCollateralIdle || minCollateralLoading;

  const balance =
    getCurrency(collateralToken) === GOVERNANCE_TOKEN
      ? {
          value: displayMonetaryAmount(governanceTokenBalance?.free),
          valueInUSD: displayMonetaryAmountInUSDFormat(
            governanceTokenBalance?.free as MonetaryAmount<CurrencyExt>,
            collateralUSDAmount
          )
        }
      : {
          value: displayMonetaryAmount(collateralTokenBalance),
          valueInUSD: displayMonetaryAmountInUSDFormat(collateralTokenBalance, collateralUSDAmount)
        };

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledDepositTitle id={titleId}>Deposit Collateral</StyledDepositTitle>
        <TokenField
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={collateralCurrency.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(inputCollateralAmount, collateralUSDAmount)}
          balance={balance}
          {...register(DEPOSIT_COLLATERAL_AMOUNT)}
        />
        <StyledDl>
          <StyledDItem>
            <StyledDt>Minimum Required Collateral</StyledDt>
            <StyledDd>
              {isMinCollateralLoading ? (
                '-'
              ) : (
                <>
                  {displayMonetaryAmount(minCollateralAmount)} {collateralCurrency.ticker} (
                  {displayMonetaryAmountInUSDFormat(minCollateralAmount, collateralUSDAmount)})
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
        <CTA type='submit' fullWidth loading={registerNewVaultMutation.isLoading}>
          Deposit Collateral
        </CTA>
      </Stack>
      {registerNewVaultMutation.isError && (
        <ErrorModal
          open={registerNewVaultMutation.isError}
          onClose={() => registerNewVaultMutation.reset()}
          title='Error'
          description={registerNewVaultMutation.error?.message || ''}
        />
      )}
    </form>
  );
};
export { DespositCollateralStep };
