import { zodResolver } from '@hookform/resolvers/zod';
import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { CTA, Span, Stack, TokenInput } from '@/component-library';
import { ModalBody, ModalFooter, ModalTitle } from '@/component-library/Modal';
import ErrorModal from '@/components/ErrorModal';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getErrorMessage } from '@/utils/helpers/forms';
import { validateDepositCollateral } from '@/utils/validation/vault/create';

import { useDepositCollateral } from '../../utils/use-deposit-collateral';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr } from './CreateVaultWizard.styles';
import { StepComponentProps, withStep } from './Step';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';

type CollateralFormData = { [DEPOSIT_COLLATERAL_AMOUNT]: string };

type Props = {
  collateralCurrency: CollateralCurrencyExt;
  minCollateralAmount: Big;
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
    balance: collateral.balance.raw,
    governanceBalance: governance.raw,
    transactionFee: fee.raw
  };
  const schema = z.object({
    [DEPOSIT_COLLATERAL_AMOUNT]: validateDepositCollateral(t, validationParams)
  });
  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isValid }
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

  return (
    <>
      <ModalTitle variant='secondary'>{t('vault.deposit_collateral')}</ModalTitle>
      <ModalBody>
        <form onSubmit={h(handleSubmit)}>
          <Stack spacing='double'>
            <TokenInput
              aria-labelledby={titleId}
              placeholder='0.00'
              tokenSymbol={collateral.currency.ticker}
              valueInUSD={displayMonetaryAmountInUSDFormat(inputCollateralAmount, collateral.price.usd)}
              balance={collateral.balance.raw.toBig().toNumber()}
              balanceInUSD={collateral.balance.usd}
              errorMessage={getErrorMessage(errors[DEPOSIT_COLLATERAL_AMOUNT])}
              renderBalance={(value) => formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 5 })}
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
          {registerNewVaultMutation.isError && (
            <ErrorModal
              open={registerNewVaultMutation.isError}
              onClose={() => registerNewVaultMutation.reset()}
              title='Error'
              description={registerNewVaultMutation.error?.message || ''}
            />
          )}
        </form>
      </ModalBody>
      <ModalFooter>
        <CTA type='submit' disabled={!isValid} fullWidth loading={registerNewVaultMutation.isLoading}>
          {t('vault.deposit_collateral')}
        </CTA>
      </ModalFooter>
    </>
  );
};

const componentStep = 2 as const;

export default withStep(DepositCollateralStep, componentStep);
