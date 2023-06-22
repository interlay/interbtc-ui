import {
  CurrencyExt,
  CurrencyId,
  ExtrinsicData,
  isCurrencyEqual,
  LiquidityPool,
  MultiPath,
  newCurrencyId,
  Trade
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { getExtrinsic } from '../extrinsics';
import { Transaction, TransactionActions } from '../types';

// 50% on top of trade to be safe (slippage, different weight)
const OUTPUT_AMOUNT_SAFE_OFFSET_MULTIPLIER = 1.5;

const constructSwapPathPrimitive = (path: MultiPath): Array<CurrencyId> => {
  const inputCurrency = newCurrencyId(window.bridge.api, path[0].input);
  return [inputCurrency, ...path.map(({ output }) => newCurrencyId(window.bridge.api, output))];
};

// Recursively double input amount until the trade with higher than minimum output
// amount is found.
const getOptimalTradeForTxFeeSwap = (
  minOutputAmount: MonetaryAmount<CurrencyExt>,
  inputAmount: MonetaryAmount<CurrencyExt>,
  pools: Array<LiquidityPool>
): Trade => {
  const trade = window.bridge.amm.getOptimalTrade(inputAmount, minOutputAmount.currency, pools);

  if (trade === null || trade.outputAmount.lt(minOutputAmount)) {
    // If the output amount is lower than minimum trade or minimum txFee
    // then double the input currency amount and check again.
    return getOptimalTradeForTxFeeSwap(minOutputAmount, inputAmount.mul(2), pools);
  }
  return trade;
};

const getTxFeeSwapData = async (
  nativeTxFee: MonetaryAmount<CurrencyExt>,
  feeCurrency: CurrencyExt,
  baseExtrinsic: SubmittableExtrinsic<'promise'>,
  pools: Array<LiquidityPool>
): Promise<{ swapPathPrimitive: Array<CurrencyId>; inputAmount: MonetaryAmount<CurrencyExt> }> => {
  // First we construct reverse direction trade to get estimated swap path and amount
  const reverseDirectionTrade = window.bridge.amm.getOptimalTrade(nativeTxFee, feeCurrency, pools);
  if (reverseDirectionTrade === null) {
    throw new Error(
      `Not possible to exchange ${feeCurrency.name} for ${nativeTxFee.currency.name}: trade path not found.`
    );
  }
  // Final native token transaction fee is estimated for base extrinsic wrapped in multiTransactionPayment call.
  // NOTE: We assume here the reverse direction trade has similar weight.
  const reverseDirectionExtrinsic = window.bridge.api.tx.multiTransactionPayment.withFeeSwapPath(
    constructSwapPathPrimitive(reverseDirectionTrade.path),
    reverseDirectionTrade.outputAmount.toString(true),
    baseExtrinsic
  );
  const withSwapTxFee = await window.bridge.transaction.getFeeEstimate(reverseDirectionExtrinsic);
  const { inputAmount, path } = getOptimalTradeForTxFeeSwap(
    withSwapTxFee.mul(OUTPUT_AMOUNT_SAFE_OFFSET_MULTIPLIER),
    reverseDirectionTrade.outputAmount,
    pools
  );
  const swapPathPrimitive = constructSwapPathPrimitive(path);

  return { inputAmount, swapPathPrimitive };
};

const estimateTransactionFee: (
  feeCurrency: CurrencyExt,
  pools: Array<LiquidityPool>,
  params: TransactionActions
) => Promise<MonetaryAmount<CurrencyExt>> = async (feeCurrency, pools, params) => {
  const baseExtrinsicData = await getExtrinsic(params);
  const baseTxFee = await window.bridge.transaction.getFeeEstimate(baseExtrinsicData.extrinsic);

  if (isCurrencyEqual(feeCurrency, GOVERNANCE_TOKEN)) {
    return baseTxFee;
  }

  const { inputAmount: wrappedInSwapTxFee } = await getTxFeeSwapData(
    baseTxFee,
    feeCurrency,
    baseExtrinsicData.extrinsic,
    pools
  );

  return wrappedInSwapTxFee;
};

const wrapWithTxFeeSwap = (
  feeAmount: MonetaryAmount<CurrencyExt> | undefined,
  baseExtrinsicData: ExtrinsicData,
  pools: Array<LiquidityPool>
): ExtrinsicData => {
  if (feeAmount === undefined || isCurrencyEqual(feeAmount.currency, GOVERNANCE_TOKEN)) {
    return baseExtrinsicData;
  }

  const trade = window.bridge.amm.getOptimalTrade(feeAmount, GOVERNANCE_TOKEN, pools);

  if (trade === null) {
    throw new Error(`Trade path for ${feeAmount.currency.name} -> ${GOVERNANCE_TOKEN.name} not found.`);
  }

  const swapPath = constructSwapPathPrimitive(trade.path);
  const wrappedCall = window.bridge.api.tx.multiTransactionPayment.withFeeSwapPath(
    swapPath,
    feeAmount.toString(true),
    baseExtrinsicData.extrinsic
  );

  return { extrinsic: wrappedCall };
};

const getActionAmount = (
  params: TransactionActions,
  feeCurrency: CurrencyExt
): MonetaryAmount<CurrencyExt> | undefined => {
  let amounts: MonetaryAmount<CurrencyExt> | MonetaryAmount<CurrencyExt>[] | undefined;

  switch (params.type) {
    case Transaction.REDEEM_REQUEST: {
      const [amount] = params.args;
      return amount;
    }
    case Transaction.TOKENS_TRANSFER: {
      const [, amount] = params.args;
      amounts = amount;
      break;
    }
    /* START - AMM */
    case Transaction.AMM_SWAP: {
      const [trade] = params.args;
      amounts = trade.inputAmount;
      break;
    }
    case Transaction.AMM_ADD_LIQUIDITY: {
      const [pooledAmounts] = params.args;
      amounts = pooledAmounts;
      break;
    }
    case Transaction.AMM_REMOVE_LIQUIDITY: {
      const [amount] = params.args;
      amounts = amount;
      break;
    }
    /* END - AMM */
  }

  if (!amounts) return;

  if (Array.isArray(amounts)) {
    return amounts.find((amount) => isCurrencyEqual(amount.currency, feeCurrency));
  }

  return isCurrencyEqual(amounts.currency, feeCurrency) ? amounts : undefined;
};

export { estimateTransactionFee, getActionAmount, wrapWithTxFeeSwap };
