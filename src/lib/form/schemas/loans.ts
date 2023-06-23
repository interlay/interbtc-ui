import { LoanAction } from '@/types/loans';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const LOAN_AMOUNT_FIELD = 'loan-amount';
const LOAN_FEE_TOKEN_FIELD = 'loan-fee-token';

type LoanFormData = {
  [LOAN_AMOUNT_FIELD]?: string;
  [LOAN_FEE_TOKEN_FIELD]?: string;
};

type LoanValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const loanSchema = (loanAction: LoanAction, params: LoanValidationParams): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [LOAN_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount(loanAction)
      .maxAmount(params, loanAction)
      .minAmount(params, loanAction),
    [LOAN_FEE_TOKEN_FIELD]: yup.string().required()
  });
};

const LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD = 'loan-toggle-collateral-fee-token';

type ToggleCollateralLoansFormData = {
  [LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD]?: string;
};

const toggleCollateralLoanSchema = (): yup.ObjectSchema<any> =>
  yup.object().shape({
    [LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD]: yup.string().required()
  });

const LOANS_CLAIM_REWARDS_FEE_TOKEN_FIELD = 'loan-claim-rewards-fee-token';

type ClaimRewardsLoansFormData = {
  [LOANS_CLAIM_REWARDS_FEE_TOKEN_FIELD]?: string;
};

const claimRewardsLoanSchema = (): yup.ObjectSchema<any> =>
  yup.object().shape({
    [LOANS_CLAIM_REWARDS_FEE_TOKEN_FIELD]: yup.string().required()
  });

export {
  claimRewardsLoanSchema,
  LOAN_AMOUNT_FIELD,
  LOAN_FEE_TOKEN_FIELD,
  LOAN_TOGGLE_COLLATERAL_FEE_TOKEN_FIELD,
  LOANS_CLAIM_REWARDS_FEE_TOKEN_FIELD,
  loanSchema,
  toggleCollateralLoanSchema
};
export type { ClaimRewardsLoansFormData, LoanFormData, LoanValidationParams, ToggleCollateralLoansFormData };
