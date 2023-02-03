import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

type DepositLiquidityPoolFormData = Record<string, number>;

type DepositLiquidityPoolValidationParams = FeesValidationParams & {
  tokens: Record<string, MaxAmountValidationParams & MinAmountValidationParams>;
};

const depositLiquidityPoolSchema = (params: DepositLiquidityPoolValidationParams): yup.ObjectSchema<any> => {
  const shape = Object.keys(params.tokens).reduce((acc, ticker, idx) => {
    const tokenParams = params.tokens[ticker];
    const validation = yup.number().requiredAmount('deposit').maxAmount(tokenParams).minAmount(tokenParams, 'deposit');

    if (idx === 0) {
      return { ...acc, [ticker]: validation.fees(params) };
    }

    return { ...acc, [ticker]: validation };
  }, {});

  return yup.object().shape(shape);
};

const WITHDRAW_LIQUIDITY_POOL_FIELD = 'withdraw';

type WithdrawLiquidityPoolFormData = {
  [WITHDRAW_LIQUIDITY_POOL_FIELD]?: number;
};

type WithdrawLiquidityPoolValidationParams = FeesValidationParams &
  MaxAmountValidationParams &
  MinAmountValidationParams;

const withdrawLiquidityPoolSchema = (params: WithdrawLiquidityPoolValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [WITHDRAW_LIQUIDITY_POOL_FIELD]: yup
      .number()
      .requiredAmount(WITHDRAW_LIQUIDITY_POOL_FIELD)
      .maxAmount(params)
      .minAmount(params, WITHDRAW_LIQUIDITY_POOL_FIELD)
      .fees(params)
  });

export { depositLiquidityPoolSchema, WITHDRAW_LIQUIDITY_POOL_FIELD, withdrawLiquidityPoolSchema };
export type {
  DepositLiquidityPoolFormData,
  DepositLiquidityPoolValidationParams,
  WithdrawLiquidityPoolFormData,
  WithdrawLiquidityPoolValidationParams
};
