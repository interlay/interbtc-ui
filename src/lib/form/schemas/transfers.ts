import { TFunction } from 'react-i18next';

import yup, { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const CROSS_CHAIN_TRANSFER_FROM_FIELD = 'transfer-from';
const CROSS_CHAIN_TRANSFER_TO_FIELD = 'transfer-to';
const CROSS_CHAIN_TRANSFER_AMOUNT_FIELD = 'transfer-amont';
const CROSS_CHAIN_TRANSFER_TOKEN_FIELD = 'transfer-token';
const CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD = 'transfer-account';

type CrossChainTransferFormData = {
  [CROSS_CHAIN_TRANSFER_FROM_FIELD]?: string;
  [CROSS_CHAIN_TRANSFER_TO_FIELD]?: string;
  [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]?: string;
  [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]?: string;
  [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]?: string;
};

type CrossChainTransferValidationParams = {
  [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;
};

// MEMO: until now, only CROSS_CHAIN_TRANSFER_AMOUNT_FIELD needs validation
const crossChainTransferSchema = (params: CrossChainTransferValidationParams, t: TFunction): yup.ObjectSchema<any> =>
  yup.object().shape({
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD])
      .minAmount(params[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD], 'transfer')
      .fees(params[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]),
    [CROSS_CHAIN_TRANSFER_FROM_FIELD]: yup
      .string()
      .required(t('forms.please_enter_your_field', { field: 'source chain' })),
    [CROSS_CHAIN_TRANSFER_TO_FIELD]: yup
      .string()
      .required(t('forms.please_enter_your_field', { field: 'destination chain' })),
    [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]: yup
      .string()
      .required(t('forms.please_enter_your_field', { field: 'destination' })),
    // TODO: at the moment, this one is not displaying
    [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]: yup
      .string()
      .required(t('forms.please_select_your_field', { field: 'transfer token' }))
  });

export {
  CROSS_CHAIN_TRANSFER_AMOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_FROM_FIELD,
  CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_TO_FIELD,
  CROSS_CHAIN_TRANSFER_TOKEN_FIELD,
  crossChainTransferSchema
};
export type { CrossChainTransferFormData, CrossChainTransferValidationParams };