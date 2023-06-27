import i18n from 'i18next';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD = 'vaults-deposit-collateral_amount';
const VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD = 'vaults-deposit-collateral-fee-token';

type VaultsDepositCollateralFormData = {
  [VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD]?: string;
  [VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD]?: string;
};

type VaultsDepositCollateralValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const depositCollateralVaultsSchema = (params: VaultsDepositCollateralValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount(i18n.t('deposit').toLowerCase())
      .maxAmount(params)
      .minAmount(params, i18n.t('deposit').toLowerCase()),
    [VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD]: yup.string().required()
  });

export {
  depositCollateralVaultsSchema,
  VAULTS_DEPOSIT_COLLATERAL_AMOUNT_FIELD,
  VAULTS_DEPOSIT_COLLATERAL_FEE_TOKEN_FIELD
};
export type { VaultsDepositCollateralFormData, VaultsDepositCollateralValidationParams };
