import yup, { BalanceValidationParams, FeesValidationParams, MinBalanceValidationParams } from './yup.custom';

const CREATE_VAULT_DEPOSIT_FIELD = 'deposit';

type CreateVaultFormData = {
  [CREATE_VAULT_DEPOSIT_FIELD]?: number;
};

type CreateVaultValidationParams = FeesValidationParams & BalanceValidationParams & MinBalanceValidationParams;

const createVaultSchema = (params: CreateVaultValidationParams) =>
  yup.object().shape({
    [CREATE_VAULT_DEPOSIT_FIELD]: yup.number().requiredAmount().balance(params).minAmount(params).fees(params)
  });

// type DepositLiquidityFormData = Record<string, number | undefined>;

// const depositLiquidityPoolFields = (fields: string[]): Record<keyof DepositLiquidityFormData, string> =>
//   fields.reduce((acc, field) => ({ ...acc, [field]: field }), {} as Record<keyof DepositLiquidityFormData, string>);

// const depositLiquidityPoolSchema = (fields: string[]) =>
//   yup.object().shape(
//     fields.reduce(
//       (acc, field) => ({
//         ...acc,
//         [field]: yup.number().requiredAmount().balance().minBalance().fees()
//       }),
//       {}
//     )
//   );

export { CREATE_VAULT_DEPOSIT_FIELD, createVaultSchema };
export type { CreateVaultFormData };
