import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { CTA, ModalBody, ModalDivider, ModalFooter, ModalHeader, Span, Stack, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import ErrorModal from '@/legacy-components/ErrorModal';
import validate, { VaultDepositSchemaParams } from '@/lib/form-validation';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';

import { useDepositCollateral } from '../../utils/use-deposit-collateral';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';
import { StepComponentProps, withStep } from './Step';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';

type CollateralFormData = { [DEPOSIT_COLLATERAL_AMOUNT]: string };

type Props = {
  collateralCurrency: CollateralCurrencyExt;
  minCollateralAmount: MonetaryAmount<CollateralCurrencyExt>;
  onSuccessfulDeposit?: () => void;
};

type DespositCollateralStepProps = Props & StepComponentProps;

const DepositCollateralStep = ({
  onSuccessfulDeposit,
  collateralCurrency,
  minCollateralAmount
}: DespositCollateralStepProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const { collateral, fee, governance } = useDepositCollateral(collateralCurrency, minCollateralAmount);

  const validationParams: VaultDepositSchemaParams = {
    minAmount: collateral.min.raw,
    availableBalance: collateral.balance.raw,
    governanceBalance: governance.raw,
    transactionFee: fee.raw
  };
  const schema = z.object({
    [DEPOSIT_COLLATERAL_AMOUNT]: validate.vaults.deposit(t, validationParams)
  });

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty }
  } = useForm<CollateralFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const registerNewVaultMutation = useMutation<void, Error, MonetaryAmount<CollateralCurrencyExt>>(
    (collateralAmount) => window.bridge.vaults.registerNewCollateralVault(collateralAmount),
    {
      onSuccess: onSuccessfulDeposit
    }
  );

  const inputCollateral = watch(DEPOSIT_COLLATERAL_AMOUNT) || '0';
  const inputCollateralAmount = newMonetaryAmount(inputCollateral, collateral.currency, true);

  const handleSubmit = async (data: CollateralFormData) => {
    const amount = newMonetaryAmount(data[DEPOSIT_COLLATERAL_AMOUNT], collateral.currency, true);
    registerNewVaultMutation.mutate(amount);
  };

  const isBtnDisabled = !isValidForm(errors) || !isDirty;

  return (
    <>
      <ModalHeader color='secondary'>{t('vault.deposit_collateral')}</ModalHeader>
      <ModalDivider color='secondary' />
      <form onSubmit={h(handleSubmit)}>
        <ModalBody>
          <Stack spacing='double'>
            <TokenInput
              aria-labelledby={titleId}
              placeholder='0.00'
              ticker={collateral.currency.ticker}
              valueUSD={convertMonetaryAmountToValueInUSD(inputCollateralAmount, collateral.price.usd) ?? 0}
              balance={collateral.balance.raw.toBig().toNumber()}
              errorMessage={getErrorMessage(errors[DEPOSIT_COLLATERAL_AMOUNT])}
              balanceDecimals={collateral.currency.humanDecimals}
              {...register(DEPOSIT_COLLATERAL_AMOUNT)}
            />
            <StyledDl>
              <StyledDItem>
                <StyledDt>{t('vault.minimum_required_collateral')}</StyledDt>
                <StyledDd>
                  {collateral.min.amount} {collateral.currency.ticker} ({collateral.min.usd})
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
          </Stack>
        </ModalBody>
        <ModalFooter>
          <CTA type='submit' disabled={isBtnDisabled} fullWidth loading={registerNewVaultMutation.isLoading}>
            {t('vault.deposit_collateral')}
          </CTA>
        </ModalFooter>
      </form>
      {registerNewVaultMutation.isError && (
        <ErrorModal
          open={registerNewVaultMutation.isError}
          onClose={() => registerNewVaultMutation.reset()}
          title='Error'
          description={registerNewVaultMutation.error?.message || ''}
        />
      )}
    </>
  );
};

const componentStep = 2 as const;

export default withStep(DepositCollateralStep, componentStep);
