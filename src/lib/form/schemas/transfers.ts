import { ChainName } from '@interlay/bridge';
import i18n from 'i18next';
import { TFunction } from 'react-i18next';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const CROSS_CHAIN_TRANSFER_FROM_FIELD = 'transfer-from';
const CROSS_CHAIN_TRANSFER_TO_FIELD = 'transfer-to';
const CROSS_CHAIN_TRANSFER_AMOUNT_FIELD = 'transfer-amount';
const CROSS_CHAIN_TRANSFER_TOKEN_FIELD = 'transfer-token';
const CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD = 'transfer-account';

type CrossChainTransferFormData = {
  [CROSS_CHAIN_TRANSFER_FROM_FIELD]?: ChainName;
  [CROSS_CHAIN_TRANSFER_TO_FIELD]?: ChainName;
  [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]?: string;
  [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]?: string;
  [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]?: string;
};

type CrossChainTransferValidationParams = {
  [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: Partial<MaxAmountValidationParams> & Partial<MinAmountValidationParams>;
};

// MEMO: until now, only CROSS_CHAIN_TRANSFER_AMOUNT_FIELD needs validation
const crossChainTransferSchema = (params: CrossChainTransferValidationParams, t: TFunction): yup.ObjectSchema<any> =>
  yup.object().shape({
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] as MaxAmountValidationParams)
      .minAmount(params[CROSS_CHAIN_TRANSFER_AMOUNT_FIELD] as MinAmountValidationParams, 'transfer'),
    [CROSS_CHAIN_TRANSFER_FROM_FIELD]: yup
      .string()
      .required(t('forms.please_enter_your_field', { field: 'source chain' })),
    [CROSS_CHAIN_TRANSFER_TO_FIELD]: yup
      .string()
      .required(t('forms.please_enter_your_field', { field: 'destination chain' })),
    [CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD]: yup
      .string()
      .required(t('forms.please_enter_your_field', { field: 'destination' })),
    [CROSS_CHAIN_TRANSFER_TOKEN_FIELD]: yup
      .string()
      .required(t('forms.please_select_your_field', { field: 'transfer token' }))
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
  CROSS_CHAIN_TRANSFER_AMOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_FROM_FIELD,
  CROSS_CHAIN_TRANSFER_TO_ACCOUNT_FIELD,
  CROSS_CHAIN_TRANSFER_TO_FIELD,
  CROSS_CHAIN_TRANSFER_TOKEN_FIELD,
  crossChainTransferSchema,
  TRANSFER_AMOUNT_FIELD,
  TRANSFER_FEE_TOKEN_FIELD,
  TRANSFER_RECIPIENT_FIELD,
  TRANSFER_TOKEN_FIELD,
  transferSchema
};
export type {
  CrossChainTransferFormData,
  CrossChainTransferValidationParams,
  TransferFormData,
  TransferValidationParams
};
