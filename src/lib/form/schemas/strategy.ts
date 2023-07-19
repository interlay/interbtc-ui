import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

type StrategyValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const StrategySchema = (
  strategyFormField: string,
  action: string,
  params: StrategyValidationParams
): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [strategyFormField]: yup.string().requiredAmount(action).maxAmount(params).minAmount(params, action)
  });
};

export { StrategySchema };
export type { StrategyValidationParams };
