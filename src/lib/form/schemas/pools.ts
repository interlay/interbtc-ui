import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const POOL_DEPOSIT_FEE_TOKEN_FIELD = 'despodit-fee-token';

type DepositLiquidityPoolFormData = {
  [field: string]: string | undefined;
  [POOL_DEPOSIT_FEE_TOKEN_FIELD]?: string;
};

type DepositLiquidityPoolValidationParams = {
  tokens: Record<string, MaxAmountValidationParams & MinAmountValidationParams>;
};

// MEMO: schema is dynamic because is deals with one to many fields
const depositLiquidityPoolSchema = (params: DepositLiquidityPoolValidationParams): yup.ObjectSchema<any> => {
  const shape = Object.keys(params.tokens).reduce((acc, ticker) => {
    const tokenParams = params.tokens[ticker];
    const validation = yup.string().requiredAmount('deposit').maxAmount(tokenParams).minAmount(tokenParams, 'deposit');

    return { ...acc, [ticker]: validation };
  }, {});

  return yup.object().shape({ ...shape, [POOL_DEPOSIT_FEE_TOKEN_FIELD]: yup.string().required() });
};

const POOL_WITHDRAW_AMOUNT_FIELD = 'withdraw-amount';
const POOL_WITHDRAW_FEE_TOKEN_FIELD = 'withdraw-fee-token';

type WithdrawLiquidityPoolFormData = {
  [POOL_WITHDRAW_AMOUNT_FIELD]?: string;
  [POOL_WITHDRAW_FEE_TOKEN_FIELD]?: string;
};

type WithdrawLiquidityPoolValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const withdrawLiquidityPoolSchema = (params: WithdrawLiquidityPoolValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [POOL_WITHDRAW_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('withdraw')
      .maxAmount(params)
      .minAmount(params, 'withdraw'),
    [POOL_WITHDRAW_FEE_TOKEN_FIELD]: yup.string().required()
  });

const POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD = 'claim-rewards-fee-token';

type ClaimRewardsPoolFormData = {
  [POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD]?: string;
};

const claimRewardsPoolSchema = (): yup.ObjectSchema<any> =>
  yup.object().shape({
    [POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD]: yup.string().required()
  });

export {
  claimRewardsPoolSchema,
  depositLiquidityPoolSchema,
  POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD,
  POOL_DEPOSIT_FEE_TOKEN_FIELD,
  POOL_WITHDRAW_AMOUNT_FIELD,
  POOL_WITHDRAW_FEE_TOKEN_FIELD,
  withdrawLiquidityPoolSchema
};
export type {
  ClaimRewardsPoolFormData,
  DepositLiquidityPoolFormData,
  DepositLiquidityPoolValidationParams,
  WithdrawLiquidityPoolFormData,
  WithdrawLiquidityPoolValidationParams
};
