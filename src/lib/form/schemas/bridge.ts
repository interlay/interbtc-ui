import i18n from 'i18next';

import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const BRIDGE_ISSUE_AMOUNT_FIELD = 'issue-amount';
const BRIDGE_ISSUE_VAULT_FIELD = 'issue-vault';
const BRIDGE_ISSUE_MANUAL_VAULT_FIELD = 'manual-vault';

type BridgeIssueFormData = {
  [BRIDGE_ISSUE_AMOUNT_FIELD]?: string;
  [BRIDGE_ISSUE_VAULT_FIELD]?: string;
  [BRIDGE_ISSUE_MANUAL_VAULT_FIELD]?: boolean;
};

type BridgeIssueValidationParams = {
  [BRIDGE_ISSUE_AMOUNT_FIELD]: FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;
};

const bridgeIssueSchema = (params: BridgeIssueValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BRIDGE_ISSUE_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('issue')
      .maxAmount(
        params[BRIDGE_ISSUE_AMOUNT_FIELD],
        'issue',
        i18n.t('forms.amount_must_be_at_most', {
          action: 'issue',
          amount: params[BRIDGE_ISSUE_AMOUNT_FIELD].maxAmount.toString()
        })
      )
      .minAmount(params[BRIDGE_ISSUE_AMOUNT_FIELD], 'issue')
      .fees(params[BRIDGE_ISSUE_AMOUNT_FIELD]),
    [BRIDGE_ISSUE_VAULT_FIELD]: yup.string().when([BRIDGE_ISSUE_MANUAL_VAULT_FIELD], {
      is: (isManualVault: string) => isManualVault,
      then: (schema) => schema.required()
    })
  });

export { BRIDGE_ISSUE_AMOUNT_FIELD, BRIDGE_ISSUE_MANUAL_VAULT_FIELD, BRIDGE_ISSUE_VAULT_FIELD, bridgeIssueSchema };
export type { BridgeIssueFormData };
