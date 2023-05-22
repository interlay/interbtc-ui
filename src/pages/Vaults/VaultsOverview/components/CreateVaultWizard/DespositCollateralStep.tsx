import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ISubmittableResult } from '@polkadot/types/types';
import { useId } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { CTA, ModalBody, ModalDivider, ModalFooter, ModalHeader, Span, Stack, TokenInput } from '@/component-library';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import ErrorModal from '@/legacy-components/ErrorModal';
import {
  CREATE_VAULT_DEPOSIT_FIELD,
  CreateVaultFormData,
  createVaultSchema,
  isFormDisabled,
  useForm
} from '@/lib/form';
import { submitExtrinsic } from '@/utils/helpers/extrinsic';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { useDepositCollateral } from '../../utils/use-deposit-collateral';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';

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
    maxAmount: collateral.balance.raw,
    governanceBalance: governance.raw,
    transactionFee: fee.raw
  };

  const handleSubmit = (data: CreateVaultFormData) => {
    if (!data.deposit) return;

    const amount = newMonetaryAmount(data.deposit || 0, collateral.currency, true);
    registerNewVaultMutation.mutate(amount);
  };

  const form = useForm<CreateVaultFormData>({
    initialValues: { deposit: undefined },
    validationSchema: createVaultSchema(validationParams),
    onSubmit: handleSubmit
  });

  const registerNewVaultMutation = useMutation<ISubmittableResult, Error, MonetaryAmount<CollateralCurrencyExt>>(
    (collateralAmount) => submitExtrinsic(window.bridge.vaults.registerNewCollateralVault(collateralAmount)),
    {
      onSuccess: onSuccessfulDeposit
    }
  );

  const inputCollateralAmount = newSafeMonetaryAmount(form.values.deposit || 0, collateral.currency, true);

  const isBtnDisabled = isFormDisabled(form);

  return (
    <>
      <ModalHeader color='secondary'>{t('vault.deposit_collateral')}</ModalHeader>
      <ModalDivider size='medium' color='secondary' />
      <form onSubmit={form.handleSubmit}>
        <ModalBody>
          <Stack spacing='double'>
            <TokenInput
              aria-labelledby={titleId}
              placeholder='0.00'
              ticker={collateral.currency.ticker}
              valueUSD={convertMonetaryAmountToValueInUSD(inputCollateralAmount, collateral.price.usd) ?? 0}
              balance={collateral.balance.raw.toString()}
              humanBalance={collateral.balance.raw.toHuman()}
              errorMessage={form.errors.deposit}
              {...form.getFieldProps(CREATE_VAULT_DEPOSIT_FIELD)}
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
