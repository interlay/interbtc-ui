import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'i18next';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { PROXY_ACCOUNT_RESERVE_AMOUNT } from '@/utils/constants/account';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from '../yup.custom';

const STRATEGY_DEPOSIT_AMOUNT_FIELD = 'strategy-deposit-amount';
const STRATEGY_DEPOSIT_FEE_TOKEN_FIELD = 'strategy-deposit-fee-token';

type StrategyDepositFormData = {
  [STRATEGY_DEPOSIT_AMOUNT_FIELD]?: string;
  [STRATEGY_DEPOSIT_FEE_TOKEN_FIELD]?: string;
};

type StrategyDepositValidationParams = MaxAmountValidationParams &
  MinAmountValidationParams & {
    governanceBalance: MonetaryAmount<CurrencyExt>;
    requireProxyDeposit: boolean;
  };

const strategyDepositSchema = (
  action: string,
  params: StrategyDepositValidationParams,
  t: TFunction
): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [STRATEGY_DEPOSIT_AMOUNT_FIELD]: yup
      .string()
      .requiredAmount(action)
      .maxAmount(params)
      .minAmount(params, action)
      .fees(
        {
          transactionFee: params.requireProxyDeposit
            ? PROXY_ACCOUNT_RESERVE_AMOUNT
            : newMonetaryAmount(0, GOVERNANCE_TOKEN),
          governanceBalance: params.governanceBalance
        },
        t('strategies.proxy_deposit_insufficient_funds', { currency: GOVERNANCE_TOKEN.ticker })
      ),
    [STRATEGY_DEPOSIT_FEE_TOKEN_FIELD]: yup.string().required()
  });
};

const STRATEGY_WITHDRAW_AMOUNT_FIELD = 'strategy-withdraw-amount';
const STRATEGY_WITHDRAW_FEE_TOKEN_FIELD = 'strategy-withdraw-fee-token';

type StrategyWithdrawFormData = {
  [STRATEGY_WITHDRAW_AMOUNT_FIELD]?: string;
  [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]?: string;
};

type StrategyWithdrawValidationParams = MaxAmountValidationParams & MinAmountValidationParams;

const strategyWithdrawSchema = (action: string, params: StrategyWithdrawValidationParams): yup.ObjectSchema<any> => {
  return yup.object().shape({
    [STRATEGY_WITHDRAW_AMOUNT_FIELD]: yup.string().requiredAmount(action).maxAmount(params).minAmount(params, action),
    [STRATEGY_WITHDRAW_FEE_TOKEN_FIELD]: yup.string().required()
  });
};

export {
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_DEPOSIT_FEE_TOKEN_FIELD,
  STRATEGY_WITHDRAW_AMOUNT_FIELD,
  STRATEGY_WITHDRAW_FEE_TOKEN_FIELD,
  strategyDepositSchema,
  strategyWithdrawSchema
};
export type {
  StrategyDepositFormData,
  StrategyDepositValidationParams,
  StrategyWithdrawFormData,
  StrategyWithdrawValidationParams
};
