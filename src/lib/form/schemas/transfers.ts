import { ChainName } from '@interlay/bridge';
import i18n from 'i18next';
import { TFunction } from 'react-i18next';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const BRIDGE_FROM_FIELD = 'transfer-from';
const BRIDGE_TO_FIELD = 'transfer-to';
const BRIDGE_AMOUNT_FIELD = 'transfer-amount';
const BRIDGE_TOKEN_FIELD = 'transfer-token';
const BRIDGE_TO_ACCOUNT_FIELD = 'transfer-account';

type BridgeFormData = {
  [BRIDGE_FROM_FIELD]?: ChainName;
  [BRIDGE_TO_FIELD]?: ChainName;
  [BRIDGE_AMOUNT_FIELD]?: string;
  [BRIDGE_TOKEN_FIELD]?: string;
  [BRIDGE_TO_ACCOUNT_FIELD]?: string;
};

type BridgeValidationParams = {
  [BRIDGE_AMOUNT_FIELD]: Partial<MaxAmountValidationParams> & Partial<MinAmountValidationParams>;
};

// MEMO: until now, only BRIDGE_AMOUNT_FIELD needs validation
const bridgeSchema = (params: BridgeValidationParams, t: TFunction): yup.ObjectSchema<any> =>
  yup.object().shape({
    [BRIDGE_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params[BRIDGE_AMOUNT_FIELD] as MaxAmountValidationParams)
      .minAmount(params[BRIDGE_AMOUNT_FIELD] as MinAmountValidationParams, 'transfer'),
    [BRIDGE_FROM_FIELD]: yup.string().required(t('forms.please_enter_your_field', { field: 'source chain' })),
    [BRIDGE_TO_FIELD]: yup.string().required(t('forms.please_enter_your_field', { field: 'destination chain' })),
    [BRIDGE_TO_ACCOUNT_FIELD]: yup.string().required(t('forms.please_enter_your_field', { field: 'destination' })),
    [BRIDGE_TOKEN_FIELD]: yup.string().required(t('forms.please_select_your_field', { field: 'transfer token' }))
  });

const TRANSFER_RECIPIENT_FIELD = 'transfer-destination';
const TRANSFER_TOKEN_FIELD = 'transfer-token';
const TRANSFER_AMOUNT_FIELD = 'transfer-amount';
const TRANSFER_FEE_TOKEN_FIELD = 'transfer-fee-token';

type TransferFormData = {
  [TRANSFER_RECIPIENT_FIELD]?: string;
  [TRANSFER_TOKEN_FIELD]?: string;
  [TRANSFER_AMOUNT_FIELD]?: string;
  [TRANSFER_FEE_TOKEN_FIELD]?: string;
};

type TransferValidationParams = {
  [TRANSFER_AMOUNT_FIELD]: Partial<MaxAmountValidationParams> & Partial<MinAmountValidationParams>;
};

const transferSchema = (params: TransferValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [TRANSFER_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params[TRANSFER_AMOUNT_FIELD] as MaxAmountValidationParams)
      .minAmount(params[TRANSFER_AMOUNT_FIELD] as MinAmountValidationParams, 'transfer'),
    [TRANSFER_RECIPIENT_FIELD]: yup
      .string()
      .required(i18n.t('forms.please_enter_your_field', { field: 'recipient' }))
      .address(),
    [TRANSFER_TOKEN_FIELD]: yup
      .string()
      .required(i18n.t('forms.please_select_your_field', { field: 'transfer token' })),
    [TRANSFER_FEE_TOKEN_FIELD]: yup.string().required()
  });

export {
  BRIDGE_AMOUNT_FIELD,
  BRIDGE_FROM_FIELD,
  BRIDGE_TO_ACCOUNT_FIELD,
  BRIDGE_TO_FIELD,
  BRIDGE_TOKEN_FIELD,
  bridgeSchema,
  TRANSFER_AMOUNT_FIELD,
  TRANSFER_FEE_TOKEN_FIELD,
  TRANSFER_RECIPIENT_FIELD,
  TRANSFER_TOKEN_FIELD,
  transferSchema
};
export type { BridgeFormData, BridgeValidationParams, TransferFormData, TransferValidationParams };
