import { EarnStrategyFormType } from '@/pages/EarnStrategies/types/form';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

type EarnStrategyValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const earnStrategySchema = (
  earnStrategyFormType: EarnStrategyFormType,
  params: EarnStrategyValidationParams
): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [earnStrategyFormType]: yup
      .string()
      .requiredAmount(earnStrategyFormType)
      .maxAmount(params)
      .minAmount(params, earnStrategyFormType)
  });
};

export { earnStrategySchema };
export type { EarnStrategyValidationParams };
