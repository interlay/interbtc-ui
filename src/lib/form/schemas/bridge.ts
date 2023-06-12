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
      then: (schema) => schema.required(i18n.t('forms.please_select_your_field', { field: 'issue vault' }))
    })
  });

const BRIDGE_REDEEM_AMOUNT_FIELD = 'redeem-amount';
const BRIDGE_REDEEM_VAULT_FIELD = 'redeem-vault';
const BRIDGE_REDEEM_MANUAL_VAULT_FIELD = 'redeem-manual-vault';
const BRIDGE_REDEEM_PREMIUM_VAULT_FIELD = 'redeem-premium-vault';
const BRIDGE_REDEEM_ADDRESS = 'redeem-address';

type BridgeRedeemFormData = {
  [BRIDGE_REDEEM_AMOUNT_FIELD]?: string;
  [BRIDGE_REDEEM_VAULT_FIELD]?: string;
  [BRIDGE_REDEEM_MANUAL_VAULT_FIELD]?: boolean;
  [BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]?: boolean;
  [BRIDGE_REDEEM_ADDRESS]?: string;
};

type BridgeRedeemValidationParams = {
  [BRIDGE_REDEEM_AMOUNT_FIELD]: FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;
};

const bridgeRedeemSchema = (params: BridgeRedeemValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BRIDGE_REDEEM_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('redeem')
      .maxAmount(
        params[BRIDGE_REDEEM_AMOUNT_FIELD],
        'redeem',
        i18n.t('forms.amount_must_be_at_most', {
          action: 'redeem',
          amount: params[BRIDGE_REDEEM_AMOUNT_FIELD].maxAmount.toString()
        })
      )
      .minAmount(params[BRIDGE_REDEEM_AMOUNT_FIELD], 'redeem')
      .fees(params[BRIDGE_REDEEM_AMOUNT_FIELD]),
    [BRIDGE_REDEEM_VAULT_FIELD]: yup.string().when([BRIDGE_REDEEM_MANUAL_VAULT_FIELD], {
      is: (isManualVault: string) => isManualVault,
      then: (schema) => schema.required(i18n.t('forms.please_select_your_field', { field: 'redeem vault' }))
    }),
    [BRIDGE_REDEEM_ADDRESS]: yup.string().required(i18n.t('forms.please_enter_your_field', { field: 'BTC address' }))
  });

export {
  BRIDGE_ISSUE_AMOUNT_FIELD,
  BRIDGE_ISSUE_MANUAL_VAULT_FIELD,
  BRIDGE_ISSUE_VAULT_FIELD,
  BRIDGE_REDEEM_ADDRESS,
  BRIDGE_REDEEM_AMOUNT_FIELD,
  BRIDGE_REDEEM_MANUAL_VAULT_FIELD,
  BRIDGE_REDEEM_PREMIUM_VAULT_FIELD,
  BRIDGE_REDEEM_VAULT_FIELD,
  bridgeIssueSchema,
  bridgeRedeemSchema
};
export type { BridgeIssueFormData, BridgeRedeemFormData };
