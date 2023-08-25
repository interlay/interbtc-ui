import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const STAKING_AMOUNT_FIELD = 'staking-amount';
const STAKING_LOCK_TIME_AMOUNT_FIELD = 'staking-lock-time-amount';
const STAKING_FEE_TOKEN_FIELD = 'staking-fee-token';

type StakingFormData = {
  [STAKING_AMOUNT_FIELD]?: string;
  [STAKING_LOCK_TIME_AMOUNT_FIELD]?: number;
  [STAKING_FEE_TOKEN_FIELD]?: string;
};

type StakingValidationParams = {
  [STAKING_AMOUNT_FIELD]: Partial<MaxAmountValidationParams> & Partial<MinAmountValidationParams>;
  [STAKING_LOCK_TIME_AMOUNT_FIELD]: {
    min: number;
    max: number;
  };
};

// TODO: lock time could be 0 if only adding into staking amount
const stakingSchema = (params: StakingValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [STAKING_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params[STAKING_AMOUNT_FIELD] as MaxAmountValidationParams)
      .minAmount(params[STAKING_AMOUNT_FIELD] as MinAmountValidationParams, 'transfer'),
    [STAKING_FEE_TOKEN_FIELD]: yup.string().required(),
    [STAKING_LOCK_TIME_AMOUNT_FIELD]: yup
      .number()
      .min(
        params[STAKING_LOCK_TIME_AMOUNT_FIELD].min,
        `Lock time must be greater than or equal to ${params[STAKING_LOCK_TIME_AMOUNT_FIELD].min}`
      )
      .max(
        params[STAKING_LOCK_TIME_AMOUNT_FIELD].max,
        `Lock time must be less than or equal to ${params[STAKING_LOCK_TIME_AMOUNT_FIELD].max}`
      )
  });

export { STAKING_AMOUNT_FIELD, STAKING_FEE_TOKEN_FIELD, STAKING_LOCK_TIME_AMOUNT_FIELD, stakingSchema };
export type { StakingFormData, StakingValidationParams };
