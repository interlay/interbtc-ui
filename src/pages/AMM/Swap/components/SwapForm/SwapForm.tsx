import { CurrencyExt, LiquidityPool, newMonetaryAmount, Trade } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AddressOrPair } from '@polkadot/api/types';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDebounce } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { convertMonetaryAmountToValueInUSD, formatUSD } from '@/common/utils/utils';
import { Card, CardProps, Divider, Flex, H1, TokenInput, TokenInputProps } from '@/component-library';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import {
  SWAP_INPUT_AMOUNT_FIELD,
  SWAP_INPUT_TOKEN_FIELD,
  SWAP_OUTPUT_TOKEN_FIELD,
  SwapFormData,
  swapSchema,
  useForm
} from '@/lib/form';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { SwapPair } from '@/types/swap';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import useAccountId from '@/utils/hooks/use-account-id';

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

const getPooledTickers = (liquidityPools: LiquidityPool[]): Set<string> =>
  liquidityPools.reduce((acc, pool) => {
    pool.pooledCurrencies.forEach((curr) => acc.add(curr.currency.ticker));

    return acc;
  }, new Set<string>());

type SwapData = {
  trade: Trade;
  minimumAmountOut: MonetaryAmount<CurrencyExt>;
  recipient: AddressOrPair;
  deadline: string | number;
};

const mutateSwap = ({ deadline, minimumAmountOut, recipient, trade }: SwapData) =>
  window.bridge.amm.swap(trade, minimumAmountOut, recipient, deadline);

type Props = {
  pair: SwapPair;
  liquidityPools: LiquidityPool[];
  onChangePair: (pair: SwapPair) => void;
  onSwap: () => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = ({ pair, liquidityPools, onChangePair, onSwap, ...props }: SwapFormProps): JSX.Element | null => {
  const [slippage, setSlippage] = useState(0.1);
  const [inputAmount, setInputAmount] = useState<string>();
  const [trade, setTrade] = useState<Trade | null>();

  const prices = useGetPrices();
  const accountId = useAccountId();
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);
  const { getBalance, getAvailableBalance } = useGetBalances();
  const { data: currencies } = useGetCurrencies(bridgeLoaded);

  useDebounce(
    () => {
      if (!pair.input || !pair.output || !inputAmount) {
        return setTrade(undefined);
      }

      const inputMonetaryAmount = newMonetaryAmount(inputAmount, pair.input, true);
      const trade = window.bridge.amm.getOptimalTrade(inputMonetaryAmount, pair.output, liquidityPools);
      setTrade(trade);
    },
    500,
    [inputAmount, pair]
  );

  const swapMutation = useMutation<void, Error, SwapData>(mutateSwap, {
    onSuccess: () => {
      toast.success('Swap successful');
      setTrade(undefined);
      setInputAmount(undefined);
      onSwap();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

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

  const handleSubmit = async () => {
    if (!trade || !accountId) return;

    try {
      const minimumAmountOut = trade.getMinimumOutputAmount(slippage);

      const deadline = await window.bridge.system.getFutureBlockNumber(30 * 60);

      return swapMutation.mutate({
        trade,
        recipient: accountId,
        minimumAmountOut,
        deadline
      });
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const initialValues = useMemo(
    () => ({
      [SWAP_INPUT_AMOUNT_FIELD]: '',
      [SWAP_INPUT_TOKEN_FIELD]: pair.input?.ticker,
      [SWAP_OUTPUT_TOKEN_FIELD]: pair.output?.ticker
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<SwapFormData>({
    initialValues,
    validationSchema: swapSchema({ [SWAP_INPUT_AMOUNT_FIELD]: inputSchemaParams }),
    onSubmit: handleSubmit,
    disableValidation: swapMutation.isLoading,
    validateOnMount: true
  });

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTrade(undefined);
    setInputAmount(e.target.value);
  };

  const handlePairChange = (pair: SwapPair) => {
    onChangePair(pair);
    form.setValues(
      {
        ...form.values,
        [SWAP_INPUT_TOKEN_FIELD]: pair.input?.ticker || '',
        [SWAP_OUTPUT_TOKEN_FIELD]: pair.output?.ticker || ''
      },
      true
    );
    setTrade(undefined);
  };

  const handleTickerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: ticker, name } = e.target;

    const currency = getCurrencyFromTicker(ticker);
    const newPair = getPairChange(pair, currency, name);

    handlePairChange(newPair);
  };

  const handlePairSwap = () => handlePairChange({ input: pair.output, output: pair.input });

  const inputValueUSD =
    inputAmount && pair.input
      ? convertMonetaryAmountToValueInUSD(
          newMonetaryAmount(inputAmount, pair.input, true),
          getTokenPrice(prices, pair.input.ticker)?.usd
        ) || 0
      : 0;

  const outputValueUSD =
    trade?.outputAmount && pair.output
      ? convertMonetaryAmountToValueInUSD(trade.outputAmount, getTokenPrice(prices, pair.output.ticker)?.usd) || 0
      : 0;

  const pooledTickers = useMemo(() => getPooledTickers(liquidityPools), [liquidityPools]);

  const tokens: TokenInputProps['tokens'] = useMemo(
    () =>
      currencies
        ?.filter((currency) => pooledTickers.has(currency.ticker))
        .map((currency) => {
          const balance = getAvailableBalance(currency.ticker);
          const balanceUSD = balance
            ? convertMonetaryAmountToValueInUSD(balance, getTokenPrice(prices, currency.ticker)?.usd)
            : 0;

          return {
            balance: balance?.toHuman() || 0,
            balanceUSD: formatUSD(balanceUSD || 0, { compact: true }),
            ticker: currency.ticker
          };
        }),
    [currencies, getAvailableBalance, pooledTickers, prices]
  );

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Swap
      </H1>
      <Divider orientation='horizontal' color='secondary' />
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
                valueUSD={inputValueUSD}
                tokens={tokens}
                selectProps={mergeProps(form.getFieldProps(SWAP_INPUT_TOKEN_FIELD, false), {
                  onChange: handleTickerChange
                })}
                {...mergeProps(form.getFieldProps(SWAP_INPUT_AMOUNT_FIELD, false), { onChange: handleChangeInput })}
              />
              <SwapDivider onPress={handlePairSwap} />
              <TokenInput
                placeholder='0.00'
                label={t('amm.to')}
                isDisabled
                balance={outputBalance?.toString() || 0}
                humanBalance={outputBalance?.toHuman() || 0}
                valueUSD={outputValueUSD}
                value={trade?.outputAmount.toString() || ''}
                tokens={tokens}
                selectProps={mergeProps(form.getFieldProps(SWAP_OUTPUT_TOKEN_FIELD, false), {
                  onChange: handleTickerChange
                })}
              />
            </Flex>
            {trade && <SwapInfo trade={trade} slippage={Number(slippage)} />}
            <SwapCTA trade={trade} errors={form.errors} loading={swapMutation.isLoading} pair={pair} />
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};

export { SwapForm };
export type { SwapFormProps };
