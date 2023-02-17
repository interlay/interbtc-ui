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

type CrossChainTransferValidationParams = FeesValidationParams & MaxAmountValidationParams & MinAmountValidationParams;

const crossChainTransferSchema = (params: CrossChainTransferValidationParams): yup.ObjectSchema<any> =>
  yup.object().shape({
    [CROSS_CHAIN_TRANSFER_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params)
      .minAmount(params, 'transfer')
      .fees(params)
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
