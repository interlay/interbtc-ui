import i18n from 'i18next';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const BRIDGE_ISSUE_AMOUNT_FIELD = 'issue-amount';
const BRIDGE_ISSUE_CUSTOM_VAULT_FIELD = 'issue-custom-vault';
const BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH = 'issue-custom-vault-switch';
const BRIDGE_ISSUE_GRIEFING_COLLATERAL_TICKER = 'griefing-collateral-currency';
const BRIDGE_ISSUE_FEE_TOKEN = 'fee-token';

type BridgeIssueFormData = {
  [BRIDGE_ISSUE_AMOUNT_FIELD]?: string;
  [BRIDGE_ISSUE_CUSTOM_VAULT_FIELD]?: string;
  [BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH]?: boolean;
  [BRIDGE_ISSUE_GRIEFING_COLLATERAL_TICKER]?: string;
  [BRIDGE_ISSUE_FEE_TOKEN]?: string;
};

type BridgeIssueValidationParams = {
  [BRIDGE_ISSUE_AMOUNT_FIELD]: MaxAmountValidationParams & MinAmountValidationParams;
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
      .minAmount(params[BRIDGE_ISSUE_AMOUNT_FIELD], 'issue'),
    [BRIDGE_ISSUE_CUSTOM_VAULT_FIELD]: yup.string().when([BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH], {
      is: (isManualVault: string) => isManualVault,
      then: (schema) => schema.required(i18n.t('forms.please_select_your_field', { field: 'issue vault' }))
    }),
    [BRIDGE_ISSUE_GRIEFING_COLLATERAL_TICKER]: yup.string().required(),
    [BRIDGE_ISSUE_FEE_TOKEN]: yup.string().required()
  });

const BRIDGE_REDEEM_AMOUNT_FIELD = 'redeem-amount';
const BRIDGE_REDEEM_CUSTOM_VAULT_FIELD = 'redeem-custom-vault';
const BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH = 'redeem-custom-vault-switch';
const BRIDGE_REDEEM_PREMIUM_VAULT_FIELD = 'redeem-premium-vault';
const BRIDGE_REDEEM_ADDRESS = 'redeem-address';
const BRIDGE_REDEEM_FEE_TOKEN = 'fee-token';

type BridgeRedeemFormData = {
  [BRIDGE_REDEEM_AMOUNT_FIELD]?: string;
  [BRIDGE_REDEEM_CUSTOM_VAULT_FIELD]?: string;
  [BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH]?: boolean;
  [BRIDGE_REDEEM_PREMIUM_VAULT_FIELD]?: boolean;
  [BRIDGE_REDEEM_ADDRESS]?: string;
  [BRIDGE_REDEEM_FEE_TOKEN]?: string;
};

type BridgeRedeemValidationParams = {
  [BRIDGE_REDEEM_AMOUNT_FIELD]: MaxAmountValidationParams & MinAmountValidationParams;
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
      .minAmount(params[BRIDGE_REDEEM_AMOUNT_FIELD], 'redeem'),
    [BRIDGE_REDEEM_CUSTOM_VAULT_FIELD]: yup.string().when([BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH], {
      is: (isManualVault: string) => isManualVault,
      then: (schema) => schema.required(i18n.t('forms.please_select_your_field', { field: 'redeem vault' }))
    }),
    [BRIDGE_REDEEM_ADDRESS]: yup.string().required(i18n.t('forms.please_enter_your_field', { field: 'BTC address' })),
    [BRIDGE_REDEEM_FEE_TOKEN]: yup.string().required()
  });

export {
  BRIDGE_ISSUE_AMOUNT_FIELD,
  BRIDGE_ISSUE_CUSTOM_VAULT_FIELD,
  BRIDGE_ISSUE_CUSTOM_VAULT_SWITCH,
  BRIDGE_ISSUE_FEE_TOKEN,
  BRIDGE_ISSUE_GRIEFING_COLLATERAL_TICKER,
  BRIDGE_REDEEM_ADDRESS,
  BRIDGE_REDEEM_AMOUNT_FIELD,
  BRIDGE_REDEEM_CUSTOM_VAULT_FIELD,
  BRIDGE_REDEEM_CUSTOM_VAULT_SWITCH,
  BRIDGE_REDEEM_FEE_TOKEN,
  BRIDGE_REDEEM_PREMIUM_VAULT_FIELD,
  bridgeIssueSchema,
  bridgeRedeemSchema
};
export type { BridgeIssueFormData, BridgeRedeemFormData };
