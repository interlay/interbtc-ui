import yup from './yup.custom';

type CreateVaultFormData = {
  deposit?: number;
};

const createVaultFields: Record<keyof CreateVaultFormData, string> = {
  deposit: 'deposit'
};

const createVaultSchema = yup.object().shape({
  [createVaultFields.deposit]: yup.number().requiredAmount().balance().minBalance().fees()
});

type DepositLiquidityFormData = Record<string, number | undefined>;

const depositLiquidityPoolFields = (fields: string[]): Record<keyof DepositLiquidityFormData, string> =>
  fields.reduce((acc, field) => ({ ...acc, [field]: field }), {} as Record<keyof DepositLiquidityFormData, string>);

const depositLiquidityPoolSchema = (fields: string[]) =>
  yup.object().shape(
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: yup.number().requiredAmount().balance().minBalance().fees()
      }),
      {}
    )
  );

const forms = {
  vaults: {
    create: {
      fields: createVaultFields,
      schema: createVaultSchema
    }
  },
  amm: {
    pools: {
      deposit: {
        fields: depositLiquidityPoolFields,
        schema: depositLiquidityPoolSchema
      }
    }
  }
};

export { forms };
export type { CreateVaultFormData, DepositLiquidityFormData };
