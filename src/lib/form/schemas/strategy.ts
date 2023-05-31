import { StrategyFormType } from '@/pages/Strategies/types/form';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

type StrategyValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const StrategySchema = (
  StrategyFormType: StrategyFormType,
  params: StrategyValidationParams
): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [StrategyFormType]: yup
      .string()
      .requiredAmount(StrategyFormType)
      .maxAmount(params)
      .minAmount(params, StrategyFormType)
  });
};

export { StrategySchema };
export type { StrategyValidationParams };
