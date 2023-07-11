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
import { FeeEstimateResult } from '../hooks/use-fee-estimate';
import { Actions, Transaction } from '../types';

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

// NOTE: This function assumes that there is existing swap path between feeCurrency and
// native fee currency
const getTxFeeSwapData = async (
  nativeTxFee: MonetaryAmount<CurrencyExt>,
  feeCurrency: CurrencyExt,
  baseExtrinsic: SubmittableExtrinsic<'promise'>,
  pools: Array<LiquidityPool>
): Promise<{ swapPathPrimitive: Array<CurrencyId>; inputAmount: MonetaryAmount<CurrencyExt> }> => {
  // First we construct reverse direction trade to get estimated swap path and amount
  const reverseDirectionTrade = window.bridge.amm.getOptimalTrade(nativeTxFee, feeCurrency, pools);
  if (reverseDirectionTrade === null) {
    // If the trade is not found it means the input amount is too small - multiply it by 10 and repeat calculation.
    return getTxFeeSwapData(nativeTxFee.mul(10), feeCurrency, baseExtrinsic, pools);
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
  params: Actions
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
  pools: Array<LiquidityPool> = []
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

// MEMO: if we ever need toadd QTOKENS as a possible fee
// token, we will need to handle it here for loan withdraw and
// withdrawAll
const getActionAmount = (params: Actions, feeCurrency: CurrencyExt): MonetaryAmount<CurrencyExt> | undefined => {
  let amounts: MonetaryAmount<CurrencyExt>[] | undefined;

  switch (params.type) {
    case Transaction.REDEEM_REQUEST: {
      const [amount] = params.args;
      amounts = [amount];
      break;
    }
    case Transaction.TOKENS_TRANSFER: {
      const [, amount] = params.args;
      amounts = [amount];
      break;
    }
    /* START - AMM */
    case Transaction.AMM_SWAP: {
      const [trade] = params.args;
      amounts = [trade.inputAmount];
      break;
    }
    case Transaction.AMM_ADD_LIQUIDITY: {
      const [pooledAmounts] = params.args;
      amounts = pooledAmounts;
      break;
    }
    case Transaction.AMM_REMOVE_LIQUIDITY: {
      const [amount] = params.args;
      amounts = [amount];
      break;
    }
    /* END - AMM */
    /* START - LOANS */
    case Transaction.LOANS_REPAY:
    case Transaction.LOANS_LEND: {
      const [, amount] = params.args;
      amounts = [amount];
      break;
    }
    case Transaction.LOANS_REPAY_ALL: {
      const [, calculatedLimit] = params.args;
      amounts = [calculatedLimit];
      break;
    }
    /* END - LOANS */
  }

  if (!amounts) return;

  return amounts.find((amount) => isCurrencyEqual(amount.currency, feeCurrency));
};

const subtractFee = (params: Actions, feeData: FeeEstimateResult): Actions => {
  switch (params.type) {
    // /* START - AMM */
    // case Transaction.AMM_SWAP: {
    //   return window.bridge.amm.swap(...params.args);
    // }

    /* START - TOKENS */
    case Transaction.TOKENS_TRANSFER: {
      const [destination, amount] = params.args;
      params.args = [destination, amount.sub(feeData.amount)];
      /* END - TOKENS */
    }
  }

  return params;
};

export { estimateTransactionFee, getActionAmount, subtractFee, wrapWithTxFeeSwap };
