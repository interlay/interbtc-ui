import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const STRATEGY_DEPOSIT_AMOUNT_FIELD = 'strategy-deposit-amount';
const STRATEGY_DEPOSIT_LEVERAGE_FIELD = 'strategy-deposit-leverage';
const STRATEGY_DEPOSIT_FEE_TOKEN_FIELD = 'strategy-deposit-fee-token';

type StrategyDepositFormData = {
  [STRATEGY_DEPOSIT_AMOUNT_FIELD]?: string;
  [STRATEGY_DEPOSIT_LEVERAGE_FIELD]?: number;
  [STRATEGY_DEPOSIT_FEE_TOKEN_FIELD]?: string;
};

type StrategyDepositValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const strategyDepositSchema = (action: string, params: StrategyDepositValidationParams): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [STRATEGY_DEPOSIT_AMOUNT_FIELD]: yup.string().requiredAmount(action).maxAmount(params).minAmount(params, action),
    [STRATEGY_DEPOSIT_LEVERAGE_FIELD]: yup.number(),
    [STRATEGY_DEPOSIT_FEE_TOKEN_FIELD]: yup.string().required()
  });
};

const STRATEGY_WITHDRAW_AMOUNT_FIELD = 'strategy-withdraw-amount';
const STRATEGY_WITHDRAW_FEE_TOKEN_FIELD = 'strategy-withdraw-fee-token';

type StrategyWithdrawFormData = {
  [STRATEGY_WITHDRAW_AMOUNT_FIELD]?: string;
  [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]?: string;
};

type StrategyWithdrawValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const strategyWithdrawSchema = (action: string, params: StrategyWithdrawValidationParams): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [STRATEGY_WITHDRAW_AMOUNT_FIELD]: yup.string().requiredAmount(action).maxAmount(params).minAmount(params, action),
    [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]: yup.string().required()
  });
};

export {
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_DEPOSIT_FEE_TOKEN_FIELD,
  STRATEGY_DEPOSIT_LEVERAGE_FIELD,
  STRATEGY_WITHDRAW_AMOUNT_FIELD,
  STRATEGY_WITHDRAW_FEE_TOKEN_FIELD,
  strategyDepositSchema,
  strategyWithdrawSchema
};
export type {
  StrategyDepositFormData,
  StrategyDepositValidationParams,
  StrategyWithdrawFormData,
  StrategyWithdrawValidationParams
};
