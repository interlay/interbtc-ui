import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, CollateralIdLiteral, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenField } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getErrorMessage } from '@/utils/helpers/forms';

import { StyledDd, StyledDepositTitle, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';
import { withStep } from './Step';
import { StepComponentProps } from './types';
import { useDepositCollateral } from './use-deposit-collateral';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';

type CollateralFormData = { [DEPOSIT_COLLATERAL_AMOUNT]: string };

const validateDepositCollateral = ({
  minAmount,
  balance,
  governanceBalance,
  transactionFee
}: {
  minAmount: Big;
  balance: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
}) =>
  z.string().superRefine((val, ctx) => {
    if (governanceBalance.lte(transactionFee)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'insufficient_funds_governance_token'
      });
    }

    if (!val) {
      return ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        message: 'Field is required',
        inclusive: true,
        type: 'string'
      });
    }

    const inputAmount = new Big(val);

    if (!inputAmount.gte(minAmount)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Deposit should be equal or greater than minimum required collateral'
      });
    }

    if (!inputAmount.lte(balance.toBig())) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Insufficient funds'
      });
    }
  });

// .min(1, { message: 'Required' })
// .transform((val) => new Big(val || 0))
// .refine((val) => {
//   console.log(val);
//   return val.lte(balance);
// })
// .refine((val) => val.gte(minAmount), {
//   message: 'Deposit should be equal or greater than minimum required collateral'
// });

const getCollateralSchema = ({
  minAmount = new Big(0),
  balance,
  governanceBalance,
  transactionFee
}: {
  minAmount: Big;
  balance: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
}) =>
  z.object({
    [DEPOSIT_COLLATERAL_AMOUNT]: validateDepositCollateral({ minAmount, balance, governanceBalance, transactionFee })
  });

type Props = {
  collateralToken: CollateralIdLiteral;
  onSuccessfulDeposit?: () => void;
};

type DespositCollateralStepProps = Props & StepComponentProps;

const DepositCollateralStep = ({
  onSuccessfulDeposit,
  collateralToken,
  ...props
}: DespositCollateralStepProps): JSX.Element | null => {
  const titleId = useId();
  const { collateral, fee, governance } = useDepositCollateral(collateralToken);

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
    formState: { errors, isValid }
  } = useForm<CollateralFormData>({
    mode: 'all',
    resolver: zodResolver(
      getCollateralSchema({
        minAmount: collateral.min.raw.toBig(),
        balance: collateral.balance.raw,
        governanceBalance: governance.raw,
        transactionFee: fee.raw
      })
    )
  });

  const inputCollateral = watch(DEPOSIT_COLLATERAL_AMOUNT) || '0';
  const inputCollateralAmount = newMonetaryAmount(
    inputCollateral,
    collateral.currency,
    true
  ) as MonetaryAmount<CollateralCurrencyExt>;

  const handleSubmit = async (data: CollateralFormData) => {
    const amount = newMonetaryAmount(
      data[DEPOSIT_COLLATERAL_AMOUNT],
      collateral.currency,
      true
    ) as MonetaryAmount<CollateralCurrencyExt>;

    registerNewVaultMutation.mutate(amount);
    console.log(errors, data);
  };

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledDepositTitle id={titleId}>Deposit Collateral</StyledDepositTitle>
        <TokenField
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={collateral.currency.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(inputCollateralAmount, collateral.price.usd)}
          balance={{ value: collateral.balance.amount, valueInUSD: collateral.balance.usd }}
          errorMessage={getErrorMessage(errors[DEPOSIT_COLLATERAL_AMOUNT])}
          {...register(DEPOSIT_COLLATERAL_AMOUNT)}
        />
        <StyledDl>
          <StyledDItem>
            <StyledDt>Minimum Required Collateral</StyledDt>
            <StyledDd>
              {collateral.min.isLoading
                ? '-'
                : `${collateral.min.amount} ${collateral.currency.ticker} (${collateral.min.usd})`}
            </StyledDd>
          </StyledDItem>
          <StyledHr />
          <StyledDItem>
            <StyledDt>Fees</StyledDt>
            <StyledDd>
              <Span color='secondary'>
                {fee.amount} {GOVERNANCE_TOKEN.ticker}
              </Span>{' '}
              ({fee.usd})
            </StyledDd>
          </StyledDItem>
        </StyledDl>
        <CTA type='submit' disabled={!isValid} fullWidth loading={registerNewVaultMutation.isLoading}>
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

const componentStep = 2 as const;

export default withStep(DepositCollateralStep, componentStep);
