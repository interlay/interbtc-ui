import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const POOL_DEPOSIT_FEE_TOKEN_FIELD = 'despodit-fee-token';

type DepositLiquidityPoolFormData = {
  [field: string]: string | undefined;
  [POOL_DEPOSIT_FEE_TOKEN_FIELD]?: string;
};

type DepositLiquidityPoolValidationParams = FeesValidationParams & {
  tokens: Record<string, MaxAmountValidationParams & MinAmountValidationParams>;
};

// MEMO: schema is dynamic because is deals with one to many fields
const depositLiquidityPoolSchema = (params: DepositLiquidityPoolValidationParams): yup.ObjectSchema<any> => {
  const shape = Object.keys(params.tokens).reduce((acc, ticker, idx) => {
    const tokenParams = params.tokens[ticker];
    const validation = yup.string().requiredAmount('deposit').maxAmount(tokenParams).minAmount(tokenParams, 'deposit');

    if (idx === 0) {
      return { ...acc, [ticker]: validation.fees(params) };
    }

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

type WithdrawLiquidityPoolValidationParams = FeesValidationParams &
  MaxAmountValidationParams &
  MinAmountValidationParams;

const withdrawLiquidityPoolSchema = (params: WithdrawLiquidityPoolValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [POOL_WITHDRAW_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount(POOL_WITHDRAW_AMOUNT_FIELD)
      .maxAmount(params)
      .minAmount(params, POOL_WITHDRAW_AMOUNT_FIELD)
      .fees(params),
    [POOL_DEPOSIT_FEE_TOKEN_FIELD]: yup.string().required()
  });

export {
  depositLiquidityPoolSchema,
  POOL_DEPOSIT_FEE_TOKEN_FIELD,
  POOL_WITHDRAW_AMOUNT_FIELD,
  POOL_WITHDRAW_FEE_TOKEN_FIELD,
  withdrawLiquidityPoolSchema
};
export type {
  DepositLiquidityPoolFormData,
  DepositLiquidityPoolValidationParams,
  WithdrawLiquidityPoolFormData,
  WithdrawLiquidityPoolValidationParams
};
