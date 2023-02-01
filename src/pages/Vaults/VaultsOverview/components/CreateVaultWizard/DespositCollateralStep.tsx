import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { CTA, ModalBody, ModalDivider, ModalFooter, ModalHeader, Span, Stack, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import ErrorModal from '@/legacy-components/ErrorModal';
import { forms, useForm } from '@/lib/form';

import { useDepositCollateral } from '../../utils/use-deposit-collateral';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';
import { StepComponentProps, withStep } from './Step';

type CollateralFormData = { [forms.createVault.fields.deposit]?: number };

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

  const validationParams = {
    minAmount: collateral.min.raw,
    availableBalance: newMonetaryAmount(0, governance.raw.currency),
    governanceBalance: governance.raw,
    transactionFee: fee.raw
  };

  const handleSubmit = (data: CollateralFormData) => {
    if (!data[DEPOSIT_COLLATERAL_AMOUNT]) return;

    const amount = newMonetaryAmount(data[DEPOSIT_COLLATERAL_AMOUNT] || 0, collateral.currency, true);
    registerNewVaultMutation.mutate(amount);
  };

  const formik = useForm<CollateralFormData>({
    initialValues: { [DEPOSIT_COLLATERAL_AMOUNT]: undefined },
    onSubmit: handleSubmit,
    params: validationParams,
    validationSchema: forms.createVault.schema
  });

  const registerNewVaultMutation = useMutation<void, Error, MonetaryAmount<CollateralCurrencyExt>>(
    (collateralAmount) => window.bridge.vaults.registerNewCollateralVault(collateralAmount),
    {
      onSuccess: onSuccessfulDeposit
    }
  );

  const inputCollateralAmount = newMonetaryAmount(
    formik.values[DEPOSIT_COLLATERAL_AMOUNT] || 0,
    collateral.currency,
    true
  );

  const isBtnDisabled = !formik.isValid || !formik.dirty;

  return (
    <>
      <ModalHeader color='secondary'>{t('vault.deposit_collateral')}</ModalHeader>
      <ModalDivider color='secondary' />
      <form onSubmit={formik.handleSubmit}>
        <ModalBody>
          <Stack spacing='double'>
            <TokenInput
              aria-labelledby={titleId}
              placeholder='0.00'
              ticker={collateral.currency.ticker}
              valueUSD={convertMonetaryAmountToValueInUSD(inputCollateralAmount, collateral.price.usd) ?? 0}
              balance={collateral.balance.raw.toString()}
              humanBalance={collateral.balance.raw.toHuman()}
              errorMessage={formik.errors[DEPOSIT_COLLATERAL_AMOUNT]}
              name={DEPOSIT_COLLATERAL_AMOUNT}
              onChange={formik.handleChange}
              value={formik.values[DEPOSIT_COLLATERAL_AMOUNT]}
              onBlur={formik.handleBlur}
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
