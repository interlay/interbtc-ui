import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

enum SwapErrorMessage {
  SELECT_TOKEN = 'SELECT_TOKEN',
  INPUT_REQUIRED = 'INPUT_REQUIRED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  UNAVAILABLE_TRADE = 'UNAVAILABLE_TRADE'
}

const SWAP_INPUT_AMOUNT_FIELD = 'input-amount';
const SWAP_INPUT_TOKEN_FIELD = 'input-token';
const SWAP_OUTPUT_TOKEN_FIELD = 'output-token';
const SWAP_FEE_TOKEN_FIELD = 'fee-token';

type SwapFormData = {
  [SWAP_INPUT_AMOUNT_FIELD]?: string;
  [SWAP_INPUT_TOKEN_FIELD]?: string;
  [SWAP_OUTPUT_TOKEN_FIELD]?: string;
  [SWAP_FEE_TOKEN_FIELD]?: string;
};

type SwapValidationParams = Partial<MaxAmountValidationParams> & Partial<MinAmountValidationParams>;

// Does not follow the normal pattern because this form has a
// custom validation, specially when it comes to error messages
const swapSchema = (params: { [SWAP_INPUT_AMOUNT_FIELD]: SwapValidationParams }): yup.ObjectSchema<any> =>
  yup.object().shape({
    [SWAP_INPUT_TOKEN_FIELD]: yup.string().required('amm.select_token'),
    [SWAP_OUTPUT_TOKEN_FIELD]: yup.string().required('amm.select_token'),
    [SWAP_INPUT_AMOUNT_FIELD]: yup.string().when([SWAP_INPUT_TOKEN_FIELD, SWAP_OUTPUT_TOKEN_FIELD], {
      is: (input: string, output: string) => input && output,
      then: (schema) =>
        schema
          .requiredAmount(undefined, 'amm.enter_token_amount')
          // validates if the user inputs 0
          .minAmount(params[SWAP_INPUT_AMOUNT_FIELD] as MinAmountValidationParams, undefined, 'amm.enter_token_amount')
          .maxAmount(
            params[SWAP_INPUT_AMOUNT_FIELD] as MaxAmountValidationParams,
            undefined,
            'amm.insufficient_token_balance'
          )
    }),
    [SWAP_FEE_TOKEN_FIELD]: yup.string().required()
  });

export {
  SWAP_FEE_TOKEN_FIELD,
  SWAP_INPUT_AMOUNT_FIELD,
  SWAP_INPUT_TOKEN_FIELD,
  SWAP_OUTPUT_TOKEN_FIELD,
  SwapErrorMessage,
  swapSchema
};
export type { SwapFormData, SwapValidationParams };
