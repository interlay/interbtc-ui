import i18n from 'i18next';

import yup, { AddressType, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const BTC_ISSUE_AMOUNT_FIELD = 'issue-amount';
const BTC_ISSUE_CUSTOM_VAULT_FIELD = 'issue-custom-vault';
const BTC_ISSUE_CUSTOM_VAULT_SWITCH = 'issue-custom-vault-switch';
const BTC_ISSUE_GRIEFING_COLLATERAL_TOKEN = 'issue-griefing-collateral-token';
const BTC_ISSUE_FEE_TOKEN = 'issue-fee-token';

type BtcIssueFormData = {
  [BTC_ISSUE_AMOUNT_FIELD]?: string;
  [BTC_ISSUE_CUSTOM_VAULT_FIELD]?: string;
  [BTC_ISSUE_CUSTOM_VAULT_SWITCH]?: boolean;
  [BTC_ISSUE_GRIEFING_COLLATERAL_TOKEN]?: string;
  [BTC_ISSUE_FEE_TOKEN]?: string;
};

type BtcIssueValidationParams = {
  [BTC_ISSUE_AMOUNT_FIELD]: MaxAmountValidationParams & MinAmountValidationParams;
};

const btcIssueSchema = (params: BtcIssueValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BTC_ISSUE_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('issue')
      .maxAmount(
        params[BTC_ISSUE_AMOUNT_FIELD],
        'issue',
        i18n.t('forms.amount_must_be_at_most', {
          action: 'issue',
          amount: params[BTC_ISSUE_AMOUNT_FIELD].maxAmount.toString()
        })
      )
      .minAmount(params[BTC_ISSUE_AMOUNT_FIELD], 'issue'),
    [BTC_ISSUE_CUSTOM_VAULT_FIELD]: yup.string().when([BTC_ISSUE_CUSTOM_VAULT_SWITCH], {
      is: (isManualVault: string) => isManualVault,
      then: (schema) => schema.required(i18n.t('forms.please_select_your_field', { field: 'issue vault' }))
    }),
    [BTC_ISSUE_GRIEFING_COLLATERAL_TOKEN]: yup.string().required(),
    [BTC_ISSUE_FEE_TOKEN]: yup.string().required()
  });

const BTC_REDEEM_AMOUNT_FIELD = 'redeem-amount';
const BTC_REDEEM_CUSTOM_VAULT_FIELD = 'redeem-custom-vault';
const BTC_REDEEM_CUSTOM_VAULT_SWITCH = 'redeem-custom-vault-switch';
const BTC_REDEEM_PREMIUM_VAULT_FIELD = 'redeem-premium-vault';
const BTC_REDEEM_ADDRESS = 'redeem-address';
const BTC_REDEEM_FEE_TOKEN = 'redeem-fee-token';

type BtcRedeemFormData = {
  [BTC_REDEEM_AMOUNT_FIELD]?: string;
  [BTC_REDEEM_CUSTOM_VAULT_FIELD]?: string;
  [BTC_REDEEM_CUSTOM_VAULT_SWITCH]?: boolean;
  [BTC_REDEEM_PREMIUM_VAULT_FIELD]?: boolean;
  [BTC_REDEEM_ADDRESS]?: string;
  [BTC_REDEEM_FEE_TOKEN]?: string;
};

type BtcRedeemValidationParams = {
  [BTC_REDEEM_AMOUNT_FIELD]: MaxAmountValidationParams & MinAmountValidationParams;
};

const btcRedeemSchema = (params: BtcRedeemValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BTC_REDEEM_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('redeem')
      .maxAmount(
        params[BTC_REDEEM_AMOUNT_FIELD],
        'redeem',
        i18n.t('forms.amount_must_be_at_most', {
          action: 'redeem',
          amount: params[BTC_REDEEM_AMOUNT_FIELD].maxAmount.toString()
        })
      )
      .minAmount(params[BTC_REDEEM_AMOUNT_FIELD], 'redeem'),
    [BTC_REDEEM_CUSTOM_VAULT_FIELD]: yup.string().when([BTC_REDEEM_CUSTOM_VAULT_SWITCH], {
      is: (isManualVault: string) => isManualVault,
      then: (schema) => schema.required(i18n.t('forms.please_select_your_field', { field: 'redeem vault' }))
    }),
    [BTC_REDEEM_ADDRESS]: yup
      .string()
      .required(i18n.t('forms.please_enter_your_field', { field: 'BTC address' }))
      .address(AddressType.BTC),
    [BTC_REDEEM_FEE_TOKEN]: yup.string().required()
  });

export {
  BTC_ISSUE_AMOUNT_FIELD,
  BTC_ISSUE_CUSTOM_VAULT_FIELD,
  BTC_ISSUE_CUSTOM_VAULT_SWITCH,
  BTC_ISSUE_FEE_TOKEN,
  BTC_ISSUE_GRIEFING_COLLATERAL_TOKEN,
  BTC_REDEEM_ADDRESS,
  BTC_REDEEM_AMOUNT_FIELD,
  BTC_REDEEM_CUSTOM_VAULT_FIELD,
  BTC_REDEEM_CUSTOM_VAULT_SWITCH,
  BTC_REDEEM_FEE_TOKEN,
  BTC_REDEEM_PREMIUM_VAULT_FIELD,
  btcIssueSchema,
  btcRedeemSchema
};
export type { BtcIssueFormData, BtcRedeemFormData };
