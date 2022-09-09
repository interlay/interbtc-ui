import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, CollateralIdLiteral, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as z from 'zod';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenField } from '@/component-library';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
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
  onDeposit?: () => void;
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
  onDeposit,
  collateralToken,
  ...props
}: Omit<DespositCollateralStepProps, keyof StepComponentProps>): JSX.Element | null => {
  const titleId = useId();
  const { bridgeLoaded, collateralTokenBalance } = useSelector((state: StoreType) => state.general);
  // const { [URL_PARAMETERS.VAULT.ACCOUNT]: vaultAddress } = useParams<Record<string, string>>();
  const prices = useGetPrices();

  const collateralCurrency = getCurrency(collateralToken);
  const {
    isIdle: requiredCollateralTokenAmountIdle,
    isLoading: requiredCollateralTokenAmountLoading,
    data: requiredCollateralTokenAmount,
    error: requiredCollateralTokenAmountError
  } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getMinimumCollateral', collateralCurrency],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(requiredCollateralTokenAmountError);

  // const registerNewVaultMutation = useMutation<void, Error, void>(
  //   () =>
  //      window.bridge.vaults.registerNewCollateralVault()
  //   {
  //     onSuccess: () => {
  //       console.log("success")
  //     }
  //   }
  // );

  const isMinCollateralLoading = requiredCollateralTokenAmountIdle || requiredCollateralTokenAmountLoading;

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors }
  } = useForm<CollateralFormData>({
    mode: 'onChange',
    resolver: zodResolver(getCollateralSchema({ minAmount: requiredCollateralTokenAmount }))
  });

  const inputCollateral = watch(DEPOSIT_COLLATERAL_AMOUNT) || '0';
  const inputCollateralAmount = newMonetaryAmount(
    inputCollateral,
    collateralCurrency,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;

  const handleSubmit = async (data: CollateralFormData) => {
    console.log(data, errors);
    onDeposit?.();
  };

  // const collateralUSDAmount = getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd;
  console.log(requiredCollateralTokenAmount?.toString());
  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledDepositTitle id={titleId}>Deposit Collateral</StyledDepositTitle>
        <TokenField
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={collateralCurrency.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(
            inputCollateralAmount,
            getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd
          )}
          balance={{
            value: collateralTokenBalance.toString(),
            valueInUSD: displayMonetaryAmountInUSDFormat(
              collateralTokenBalance,
              getTokenPrice(prices, collateralCurrency.ticker as CollateralIdLiteral)?.usd
            )
          }}
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
                  {displayMonetaryAmount(
                    newMonetaryAmount(requiredCollateralTokenAmount || new Big(0), collateralCurrency)
                  )}{' '}
                  {collateralCurrency.ticker} (
                  {/* {displayMonetaryAmountInUSDFormat(requiredCollateralTokenAmount as any, collateralUSDAmount)}) */}
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
export { DespositCollateralStep };
