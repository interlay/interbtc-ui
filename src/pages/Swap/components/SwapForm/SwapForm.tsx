import { CurrencyExt, LiquidityPool, newMonetaryAmount, Trade } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { ChangeEventHandler, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDebounce, useInterval } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Card, CardProps, Divider, Flex, H1, TokenInput } from '@/component-library';
import { SlippageManager, TransactionFeeDetails } from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';
import {
  SWAP_FEE_TOKEN_FIELD,
  SWAP_INPUT_AMOUNT_FIELD,
  SWAP_INPUT_TOKEN_FIELD,
  SWAP_OUTPUT_TOKEN_FIELD,
  SwapFormData,
  swapSchema,
  useForm
} from '@/lib/form';
import { SwapPair } from '@/types/swap';
import { REFETCH_INTERVAL } from '@/utils/constants/api';
import { SWAP_PRICE_IMPACT_LIMIT } from '@/utils/constants/swap';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { Prices, useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import useAccountId from '@/utils/hooks/use-account-id';
import { useSelectCurrency } from '@/utils/hooks/use-select-currency';

import { PriceImpactModal } from '../PriceImpactModal';
import { SwapInfo } from '../SwapInfo';
import { SwapCTA } from './SwapCTA';
import { SwapDivider } from './SwapDivider';

const getPairChange = (pair: SwapPair, currency: CurrencyExt, name: string): SwapPair => {
  switch (name) {
    case SWAP_INPUT_TOKEN_FIELD: {
      return currency.ticker === pair.output?.ticker
        ? { input: currency, output: pair.input }
        : { ...pair, input: currency };
    }
    case SWAP_OUTPUT_TOKEN_FIELD: {
      return currency.ticker === pair.input?.ticker
        ? { input: pair.output, output: currency }
        : { ...pair, output: currency };
    }
    default:
      return pair;
  }
};

const getAmountsUSD = (pair: SwapPair, prices?: Prices, trade?: Trade | null, inputAmount?: string) => {
  const monetaryAmount = pair.input && newSafeMonetaryAmount(inputAmount || 0, pair.input, true);

  const inputAmountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const outputAmountUSD =
    trade?.outputAmount && pair.output
      ? convertMonetaryAmountToValueInUSD(trade.outputAmount, getTokenPrice(prices, pair.output.ticker)?.usd) || 0
      : 0;

  return {
    inputAmountUSD,
    outputAmountUSD,
    inputMonetary: monetaryAmount,
    outputMonetary: trade?.outputAmount
  };
};

const getPoolPriceImpact = (trade: Trade | null | undefined, inputAmountUSD: number, outputAmountUSD: number) => ({
  poolImpact: trade?.priceImpact,
  marketPrice:
    outputAmountUSD && inputAmountUSD
      ? new Big(inputAmountUSD - outputAmountUSD).div(inputAmountUSD).mul(100)
      : new Big(0)
});

type Props = {
  pair: SwapPair;
  liquidityPools: LiquidityPool[];
  onChangePair: (pair: SwapPair) => void;
  pooledTickers: Set<string>;
  onSwap: () => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = ({
  pair,
  liquidityPools,
  pooledTickers,
  onChangePair,
  onSwap,
  ...props
}: SwapFormProps): JSX.Element | null => {
  const [slippage, setSlippage] = useState(0.1);
  const [inputAmount, setInputAmount] = useState<string>();
  const [trade, setTrade] = useState<Trade | null>();
  const [isPriceImpactModalOpen, setPriceImpactModal] = useState(false);

  const prices = useGetPrices();
  const accountId = useAccountId();
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { data: balances, getBalance, getAvailableBalance } = useGetBalances();
  const selectCurrency = useSelectCurrency();

  // const preEstimate = useMemo(async () => {
  //   const inputMonetaryAmount = newMonetaryAmount(1, GOVERNANCE_TOKEN, true);

  //   const trade = window.bridge.amm.getOptimalTrade(inputMonetaryAmount, WRAPPED_TOKEN, liquidityPools);

  //   if (!trade || !accountId) return;

  //   const minimumAmountOut = trade.getMinimumOutputAmount(slippage);

  //   const deadline = await window.bridge.system.getFutureBlockNumber(30 * 60);

  //   return { args: [trade, minimumAmountOut, accountId, deadline] };
  // }, [accountId]);

  const transaction = useTransaction(Transaction.AMM_SWAP, {
    preEstimate: async () => {
      const inputMonetaryAmount = newMonetaryAmount(1, pair.input as any, true);

      const trade = window.bridge.amm.getOptimalTrade(inputMonetaryAmount, WRAPPED_TOKEN, liquidityPools);

      if (!trade || !accountId) return;

      const minimumAmountOut = trade.getMinimumOutputAmount(slippage);

      const deadline = await window.bridge.system.getFutureBlockNumber(30 * 60);

      return { args: [trade, minimumAmountOut, accountId, deadline] };
    },
    enablePreEstimate: true,
    onSigning: () => {
      setInputAmount(undefined);
      form.setFieldValue(SWAP_INPUT_AMOUNT_FIELD, '', true);
      setTrade(undefined);
    },
    onSuccess: onSwap
  });

  const handleChangeTrade = () => {
    if (!pair.input || !pair.output || !inputAmount) {
      return setTrade(undefined);
    }

    const inputMonetaryAmount = newMonetaryAmount(inputAmount, pair.input, true);
    const trade = window.bridge.amm.getOptimalTrade(inputMonetaryAmount, pair.output, liquidityPools);

    setTrade(trade);
  };

  // attemp to update trade object on each new block
  useInterval(handleChangeTrade, REFETCH_INTERVAL.BLOCK);

  useDebounce(handleChangeTrade, 500, [inputAmount, pair]);

  const inputBalance = pair.input && getAvailableBalance(pair.input.ticker);
  const outputBalance = pair.output && getAvailableBalance(pair.output.ticker);

  const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);
  const minAmount = pair.input && newMonetaryAmount(1, pair.input);

  const inputSchemaParams = {
    governanceBalance,
    maxAmount: inputBalance,
    minAmount,
    transactionFee: TRANSACTION_FEE_AMOUNT
  };

  const getTransactionArgs = useCallback(
    async (trade: Trade | null | undefined) => {
      if (!trade || !accountId) return;

      try {
        const minimumAmountOut = trade.getMinimumOutputAmount(slippage);
        const deadline = await window.bridge.system.getFutureBlockNumber(30 * 60);

        return {
          trade,
          minimumAmountOut,
          accountId,
          deadline
        };
      } catch (error: any) {
        transaction.reject(error);
      }
    },
    [accountId, slippage, transaction]
  );

  const handleSwap = async () => {
    const transactionData = await getTransactionArgs(trade);

    if (!transactionData) return;

    const { accountId, deadline, minimumAmountOut, trade: tradeData } = transactionData;

    transaction.execute(tradeData, minimumAmountOut, accountId, deadline);
  };

  const handleSubmit = async (values: SwapFormData) => {
    const { inputAmountUSD, outputAmountUSD } = getAmountsUSD(pair, prices, trade, values[SWAP_INPUT_AMOUNT_FIELD]);

    const isOverPricedBuy = inputAmountUSD >= outputAmountUSD;
    const { poolImpact, marketPrice } = getPoolPriceImpact(trade, inputAmountUSD, outputAmountUSD);

    if (isOverPricedBuy && (marketPrice.gte(SWAP_PRICE_IMPACT_LIMIT) || poolImpact?.gte(SWAP_PRICE_IMPACT_LIMIT))) {
      return setPriceImpactModal(true);
    }

    handleSwap();
  };

  const initialValues = useMemo(
    () => ({
      [SWAP_INPUT_AMOUNT_FIELD]: '',
      [SWAP_INPUT_TOKEN_FIELD]: pair.input?.ticker || '',
      [SWAP_OUTPUT_TOKEN_FIELD]: pair.output?.ticker || '',
      [SWAP_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<SwapFormData>({
    initialValues,
    validationSchema: swapSchema({ [SWAP_INPUT_AMOUNT_FIELD]: inputSchemaParams }),
    onSubmit: handleSubmit,
    validateOnMount: true
  });

  // MEMO: re-validate form on balances refetch
  useEffect(() => {
    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  // MEMO: trigger validation after pair state change
  useEffect(() => {
    form.setValues(
      {
        ...form.values,
        [SWAP_INPUT_TOKEN_FIELD]: pair.input?.ticker || '',
        [SWAP_OUTPUT_TOKEN_FIELD]: pair.output?.ticker || ''
      },
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]);

  const feeToken = form.values[SWAP_FEE_TOKEN_FIELD];

  useEffect(() => {
    const estimateFee = async () => {
      const transactionData = await getTransactionArgs(trade);

      if (!transactionData) return;

      const { accountId, deadline, minimumAmountOut, trade: tradeData } = transactionData;

      transaction.fee.setCurrency(feeToken).estimate(tradeData, minimumAmountOut, accountId, deadline);
    };

    if (!trade) return;

    estimateFee();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade, feeToken]);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => setInputAmount(e.target.value);

  const handlePairChange = (pair: SwapPair) => onChangePair(pair);

  const handleTickerChange = (ticker: string, name: string) => {
    const currency = getCurrencyFromTicker(ticker);
    const newPair = getPairChange(pair, currency, name);

    handlePairChange(newPair);
  };

  const handlePairSwap = () => handlePairChange({ input: pair.output, output: pair.input });

  const handleConfirmPriceImpactModal = () => {
    setPriceImpactModal(false);
    handleSwap();
  };

  const handleClosePriceImpactModal = () => setPriceImpactModal(false);

  const { inputAmountUSD, outputAmountUSD, inputMonetary, outputMonetary } = getAmountsUSD(
    pair,
    prices,
    trade,
    form.values[SWAP_INPUT_AMOUNT_FIELD]
  );

  const selectItems = selectCurrency.items.filter((tokenData) => pooledTickers.has(tokenData.value));

  const { poolImpact, marketPrice } = getPoolPriceImpact(trade, inputAmountUSD, outputAmountUSD);
  const priceImpact = (marketPrice || poolImpact).toNumber();

  return (
    <>
      <Card {...props} gap='spacing2'>
        <H1 size='base' color='secondary' weight='bold' align='center'>
          Swap
        </H1>
        <Divider size='medium' orientation='horizontal' color='secondary' />
        <Flex direction='column'>
          <SlippageManager value={slippage} onChange={(slippage) => setSlippage(slippage)} />
          <form onSubmit={form.handleSubmit}>
            <Flex direction='column' gap='spacing4'>
              <Flex direction='column' gap='spacing12'>
                <TokenInput
                  placeholder='0.00'
                  label={t('amm.from')}
                  balance={inputBalance?.toString() || 0}
                  humanBalance={inputBalance?.toHuman() || 0}
                  valueUSD={inputAmountUSD}
                  selectProps={mergeProps(form.getSelectFieldProps(SWAP_INPUT_TOKEN_FIELD, true), {
                    onSelectionChange: (ticker: Key) => handleTickerChange(ticker as string, SWAP_INPUT_TOKEN_FIELD),
                    items: selectItems
                  })}
                  {...mergeProps(form.getFieldProps(SWAP_INPUT_AMOUNT_FIELD, true), { onChange: handleChangeInput })}
                />
                <SwapDivider onPress={handlePairSwap} />
                <TokenInput
                  placeholder='0.00'
                  label={t('amm.to')}
                  isDisabled
                  balance={outputBalance?.toString() || 0}
                  humanBalance={outputBalance?.toHuman() || 0}
                  valueUSD={outputAmountUSD}
                  value={trade?.outputAmount.toString() || ''}
                  selectProps={mergeProps(form.getSelectFieldProps(SWAP_OUTPUT_TOKEN_FIELD, true), {
                    onSelectionChange: (ticker: Key) => handleTickerChange(ticker as string, SWAP_OUTPUT_TOKEN_FIELD),
                    items: selectItems
                  })}
                />
              </Flex>
              <Flex direction='column' gap='spacing2'>
                {trade && <SwapInfo trade={trade} slippage={Number(slippage)} />}
                <TransactionFeeDetails
                  {...transaction.fee.detailsProps}
                  selectProps={form.getSelectFieldProps(SWAP_FEE_TOKEN_FIELD)}
                />
              </Flex>
              <SwapCTA trade={trade} fee={transaction.fee} form={form} pair={pair} />
            </Flex>
          </form>
        </Flex>
      </Card>
      <PriceImpactModal
        isOpen={isPriceImpactModalOpen}
        onClose={handleClosePriceImpactModal}
        onConfirm={handleConfirmPriceImpactModal}
        inputValueUSD={inputAmountUSD}
        outputValueUSD={outputAmountUSD}
        inputAmount={inputMonetary}
        outputAmount={outputMonetary}
        pair={pair}
        priceImpact={priceImpact}
      />
    </>
  );
};

export { SwapForm };
export type { SwapFormProps };
