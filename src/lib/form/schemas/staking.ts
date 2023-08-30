import i18n from 'i18next';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const STAKING_AMOUNT_FIELD = 'staking-amount';
const STAKING_LOCKED_WEEKS_AMOUNT_FIELD = 'staking-locked-weeks-amount';
const STAKING_FEE_TOKEN_FIELD = 'staking-fee-token';

type StakingFormData = {
  [STAKING_AMOUNT_FIELD]?: string;
  [STAKING_LOCKED_WEEKS_AMOUNT_FIELD]?: string;
  [STAKING_FEE_TOKEN_FIELD]?: string;
};

type StakingValidationParams = {
  [STAKING_AMOUNT_FIELD]: Partial<MaxAmountValidationParams> & Partial<MinAmountValidationParams>;
  [STAKING_LOCKED_WEEKS_AMOUNT_FIELD]: {
    min: number;
    max: number;
  };
};

const stakingSchema = (params: StakingValidationParams, hasStaked: boolean): yup.ObjectSchema<any> => {
  const amountParams = params[STAKING_AMOUNT_FIELD];
  const { min, max } = params[STAKING_LOCKED_WEEKS_AMOUNT_FIELD];

  let baseAmountSchema = yup
    .string()
    .maxAmount(amountParams as MaxAmountValidationParams)
    .minAmount(amountParams as MinAmountValidationParams, 'transfer');

  let baseLockTimeSchema = yup
    .string()
    .test('max', `Lock time must be less than or equal to ${max}`, (value) =>
      value === undefined ? true : Number(value) <= max
    );

  if (!hasStaked) {
    baseAmountSchema = baseAmountSchema.requiredAmount('stake');

    baseLockTimeSchema = baseLockTimeSchema
      .required(i18n.t('forms.please_enter_your_field', { field: 'lock time' }))
      .test('min', `Lock time must be greater than or equal to ${min}`, (value) =>
        value === undefined ? true : Number(value) >= min
      );
  }

  return yup.object().shape({
    [STAKING_AMOUNT_FIELD]: baseAmountSchema,
    [STAKING_LOCKED_WEEKS_AMOUNT_FIELD]: baseLockTimeSchema,
    [STAKING_FEE_TOKEN_FIELD]: yup.string().required()
  });
};

export { STAKING_AMOUNT_FIELD, STAKING_FEE_TOKEN_FIELD, STAKING_LOCKED_WEEKS_AMOUNT_FIELD, stakingSchema };
export type { StakingFormData, StakingValidationParams };
