import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, CollateralIdLiteral, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenField } from '@/component-library';
import ErrorModal from '@/components/ErrorModal';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getErrorMessage } from '@/utils/helpers/forms';

import { StyledDd, StyledDepositTitle, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';
import { validateDepositCollateral } from './deposit-validation';
import { withStep } from './Step';
import { StepComponentProps } from './types';
import { useDepositCollateral } from './use-deposit-collateral';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';

type CollateralFormData = { [DEPOSIT_COLLATERAL_AMOUNT]: string };

const getCollateralSchema = (t: TFunction) => ({
  minAmount,
  balance,
  governanceBalance,
  transactionFee
}: {
  minAmount: MonetaryAmount<CurrencyExt>;
  balance: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
}) =>
  z.object({
    [DEPOSIT_COLLATERAL_AMOUNT]: validateDepositCollateral(t)({ minAmount, balance, governanceBalance, transactionFee })
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
  const { t } = useTranslation();
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
    mode: 'onChange',
    resolver: zodResolver(
      getCollateralSchema(t)({
        minAmount: collateral.min.raw,
        balance: collateral.balance.raw,
        governanceBalance: governance.raw,
        transactionFee: fee.raw
      })
    )
  });

  const inputCollateral = watch(DEPOSIT_COLLATERAL_AMOUNT) || '0';
  const inputCollateralAmount = newMonetaryAmount(inputCollateral, collateral.currency, true);

  const handleSubmit = async (data: CollateralFormData) => {
    const amount = newMonetaryAmount(data[DEPOSIT_COLLATERAL_AMOUNT], collateral.currency, true);

    registerNewVaultMutation.mutate(amount);
    console.log(errors, data);
  };

  return (
    <form onSubmit={h(handleSubmit)} {...props}>
      <Stack spacing='double'>
        <StyledDepositTitle id={titleId}>{t('vault.deposit_collateral')}</StyledDepositTitle>
        <TokenField
          aria-labelledby={titleId}
          placeholder='0.00'
          tokenSymbol={collateral.currency.ticker}
          valueInUSD={displayMonetaryAmountInUSDFormat(inputCollateralAmount, collateral.price.usd)}
          balance={collateral.balance.amount}
          balanceInUSD={collateral.balance.usd}
          errorMessage={getErrorMessage(errors[DEPOSIT_COLLATERAL_AMOUNT])}
          {...register(DEPOSIT_COLLATERAL_AMOUNT)}
        />
        <StyledDl>
          <StyledDItem>
            <StyledDt>{t('vault.minimum_required_collateral')}</StyledDt>
            <StyledDd>
              {collateral.min.isLoading
                ? '-'
                : `${collateral.min.amount} ${collateral.currency.ticker} (${collateral.min.usd})`}
            </StyledDd>
          </StyledDItem>
          <StyledHr />
          <StyledDItem>
            <StyledDt>{t('fees')}</StyledDt>
            <StyledDd>
              <Span color='secondary'>
                {fee.amount} {GOVERNANCE_TOKEN.ticker}
              </Span>{' '}
              ({fee.usd})
            </StyledDd>
          </StyledDItem>
        </StyledDl>
        <CTA type='submit' disabled={!isValid} fullWidth loading={registerNewVaultMutation.isLoading}>
          {t('vault.deposit_collateral')}
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
