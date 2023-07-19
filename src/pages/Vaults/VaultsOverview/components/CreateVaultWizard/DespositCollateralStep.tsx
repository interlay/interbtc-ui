import { CollateralCurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps, useId } from '@react-aria/utils';
import { RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { ModalBody, ModalDivider, ModalFooter, ModalHeader, TokenInput } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import {
  depositCollateralVaultsSchema,
  useForm,
  VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD,
  VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD,
  VaultsDepositCollateralFormData,
  VaultsDepositCollateralValidationParams
} from '@/lib/form';
import { getTokenInputProps } from '@/utils/helpers/input';
import { StepComponentProps, withStep } from '@/utils/hocs/step';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { useDepositCollateral } from '../../utils/use-deposit-collateral';

type Props = {
  collateralCurrency: CollateralCurrencyExt;
  minCollateralAmount: MonetaryAmount<CollateralCurrencyExt>;
  onSuccessfulDeposit?: () => void;
  overlappingModalRef: RefObject<HTMLDivElement>;
};

type DespositCollateralStepProps = Props & StepComponentProps;

const DepositCollateralStep = ({
  onSuccessfulDeposit,
  collateralCurrency,
  minCollateralAmount,
  overlappingModalRef
}: DespositCollateralStepProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();

  const { collateral } = useDepositCollateral(collateralCurrency, minCollateralAmount);

  const transaction = useTransaction(Transaction.VAULTS_REGISTER_NEW_COLLATERAL, {
    onSuccess: onSuccessfulDeposit,
    showSuccessModal: false
  });

  const getTransactionArgs = useCallback(
    (values: VaultsDepositCollateralFormData) => {
      const amount = values[VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD];
      const monetaryAmount = newMonetaryAmount(amount || 0, collateralCurrency, true);

      return { monetaryAmount };
    },
    [collateralCurrency]
  );

  const handleSubmit = (data: VaultsDepositCollateralFormData) => {
    let { monetaryAmount } = getTransactionArgs(data);

    if (transaction.fee.isEqualFeeCurrency(monetaryAmount.currency)) {
      monetaryAmount = transaction.calculateAmountWithFeeDeducted(monetaryAmount);
    }

    transaction.execute(monetaryAmount);
  };

  const validationParams: VaultsDepositCollateralValidationParams = {
    minAmount: collateral.min.raw,
    maxAmount: collateral.balance.raw
  };

  const form = useForm<VaultsDepositCollateralFormData>({
    initialValues: {
      [VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD]: '',
      [VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: depositCollateralVaultsSchema(validationParams),
    onSubmit: handleSubmit,
    onComplete: (values) => {
      const transactionData = getTransactionArgs(values);

      transaction.fee.estimate(transactionData.monetaryAmount);
    }
  });

  const amount = form.values[VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD];
  const monetaryAmount = newSafeMonetaryAmount(amount || 0, collateral.currency, true);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <>
      <ModalHeader color='secondary'>{t('vault.deposit_collateral')}</ModalHeader>
      <ModalDivider size='medium' color='secondary' />
      <form onSubmit={form.handleSubmit}>
        <ModalBody>
          <TokenInput
            aria-labelledby={titleId}
            placeholder='0.00'
            ticker={collateral.currency.ticker}
            valueUSD={convertMonetaryAmountToValueInUSD(monetaryAmount, collateral.price.usd) ?? 0}
            {...mergeProps(
              form.getFieldProps(VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD, false, true),
              getTokenInputProps(collateral.balance.raw)
            )}
          />
        </ModalBody>
        <ModalFooter>
          <TransactionDetails>
            <TransactionDetailsGroup>
              <TransactionDetailsDt>{t('vault.minimum_required_collateral')}</TransactionDetailsDt>
              <TransactionDetailsDd>
                {collateral.min.amount} {collateral.currency.ticker} ({collateral.min.usd})
              </TransactionDetailsDd>
            </TransactionDetailsGroup>
          </TransactionDetails>
          <TransactionFeeDetails
            fee={transaction.fee}
            selectProps={{
              ...form.getSelectFieldProps(VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD),
              modalRef: overlappingModalRef
            }}
          />
          <AuthCTA type='submit' disabled={isBtnDisabled} fullWidth loading={transaction.isLoading}>
            {t('vault.deposit_collateral')}
          </AuthCTA>
        </ModalFooter>
      </form>
    </>
  );
};

const componentStep = 2 as const;

export default withStep(DepositCollateralStep, componentStep);
