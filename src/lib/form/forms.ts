import * as Yup from 'yup';

const createVaultFields = {
  deposit: 'deposit'
};

const createVaultSchema = Yup.object().shape({
  [createVaultFields.deposit]: Yup.number().requiredAmount().balance().minBalance().fees()
});

const forms = {
  createVault: {
    fields: createVaultFields,
    schema: createVaultSchema
  }
};

export { forms };
