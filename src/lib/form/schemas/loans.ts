import { LoanAction } from '@/types/loans';

import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

type LoanFormData = Partial<Record<LoanAction, string>>;

type LoanValidationParams = FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;

const loanSchema = (loanAction: LoanAction, params: LoanValidationParams): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [loanAction]: yup.string().requiredAmount(loanAction).maxAmount(params).minAmount(params, loanAction).fees(params)
  });
};

export { loanSchema };
export type { LoanFormData, LoanValidationParams };
