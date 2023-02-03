import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const CREATE_VAULT_DEPOSIT_FIELD = 'deposit';

type CreateVaultFormData = {
  [CREATE_VAULT_DEPOSIT_FIELD]?: number;
};

type CreateVaultValidationParams = FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;

const createVaultSchema = (params: CreateVaultValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [CREATE_VAULT_DEPOSIT_FIELD]: yup
      .number()
      .requiredAmount(CREATE_VAULT_DEPOSIT_FIELD)
      .maxAmount(params)
      .minAmount(params, CREATE_VAULT_DEPOSIT_FIELD)
      .fees(params)
  });

export { CREATE_VAULT_DEPOSIT_FIELD, createVaultSchema };
export type { CreateVaultFormData };
