import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const BRIDGE_ISSUE_AMOUNT_FIELD = 'issue-amount';
const BRIDGE_ISSUE_VAULT_FIELD = 'issue-vault';

type BridgeIssueFormData = {
  [BRIDGE_ISSUE_AMOUNT_FIELD]?: string;
  [BRIDGE_ISSUE_VAULT_FIELD]?: string;
};

type BridgeIssueValidationParams = {
  [BRIDGE_ISSUE_AMOUNT_FIELD]: FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;
};

const bridgeIssueSchema = (params: BridgeIssueValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BRIDGE_ISSUE_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount(BRIDGE_ISSUE_AMOUNT_FIELD)
      .maxAmount(params[BRIDGE_ISSUE_AMOUNT_FIELD])
      .minAmount(params[BRIDGE_ISSUE_AMOUNT_FIELD], BRIDGE_ISSUE_AMOUNT_FIELD)
      .fees(params[BRIDGE_ISSUE_AMOUNT_FIELD]),
    [BRIDGE_ISSUE_VAULT_FIELD]: yup.string()
  });

export { BRIDGE_ISSUE_AMOUNT_FIELD, BRIDGE_ISSUE_VAULT_FIELD, bridgeIssueSchema };
export type { BridgeIssueFormData };
