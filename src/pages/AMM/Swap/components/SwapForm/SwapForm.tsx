import { CurrencyExt, LiquidityPool, Trade } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AddressOrPair } from '@polkadot/api/types';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDebounce } from 'react-use';

import { StoreType } from '@/common/types/util.types';
import { Card, CardProps, Divider, Flex, H1, TokenInput } from '@/component-library';
import { AuthCTA } from '@/components';
import { SlippageManager } from '@/pages/AMM/shared/components';
import { SwapPair } from '@/types/swap';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import useAccountId from '@/utils/hooks/use-account-id';

import { useSwapFormData } from '../../hooks/use-swap-form-data';
import { SwapInfo } from '../SwapInfo';
import { SwapDivider } from './SwapDivider';

const getPairChange = (pair: SwapPair, currency: CurrencyExt, name: string): SwapPair => {
  switch (name) {
    case FormFields.INPUT_TICKER: {
      return currency.ticker === pair.output?.ticker
        ? { input: currency, output: pair.input }
        : { ...pair, input: currency };
    }
    case FormFields.OUTPUT_TICKER: {
      return currency.ticker === pair.input?.ticker
        ? { input: pair.output, output: currency }
        : { ...pair, output: currency };
    }
    default:
      return pair;
  }
};

type SwapData = {
  trade: Trade;
  minimumAmountOut: MonetaryAmount<CurrencyExt>;
  recipient: AddressOrPair;
  deadline: string | number;
};

const mutateSwap = ({ deadline, minimumAmountOut, recipient, trade }: SwapData) =>
  window.bridge.amm.swap(trade, minimumAmountOut, recipient, deadline);

enum FormFields {
  INPUT_AMOUNT = 'input-amount',
  INPUT_TICKER = 'input-ticker',
  OUTPUT_AMOUNT = 'output-amount',
  OUTPUT_TICKER = 'output-ticker'
}

type Props = {
  pair: SwapPair;
  liquidityPools: LiquidityPool[];
  onChangePair: (pair: SwapPair) => void;
  onSwap: () => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const worker = new Worker(new URL('./worker.ts', import.meta.url));

const SwapForm = ({ pair, liquidityPools, onChangePair, onSwap, ...props }: SwapFormProps): JSX.Element | null => {
  const [slippage, setSlippage] = useState(0.1);
  const [inputAmount, setInputAmount] = useState<number>();
  const [trade, setTrade] = useState<Trade | null>();

  const accountId = useAccountId();
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);

  // useEffect(() => {
  //   if (window.Worker) {
  //     counter.postMessage({ liquidityPools, pair, inputAmount });
  //   }
  // }, [counter]);

  // useCallback(
  //   async (inputAmount: number) => {
  //     const a = await createInterBtcApi(constants.PARACHAIN_URL, constants.BITCOIN_NETWORK);
  //     const inputMonetaryAmount = newMonetaryAmount(inputAmount, pair.input as any, true);

  //     return a.amm.getOptimalTrade(inputMonetaryAmount, pair.output as any, liquidityPools);
  //   },
  //   [liquidityPools, pair.input, pair.output]
  // );

  useDebounce(
    async () => {
      if (!pair.input || !pair.output || inputAmount === undefined) {
        return setTrade(undefined);
      }

      worker.postMessage(JSON.stringify({ inputAmount, liquidityPools, pair }));
      worker.addEventListener('message', (message) => {
        console.log(message);
        // Handle worker response here
      });

      // const result = await sortWorker(inputAmount); // non-blocking UI
    },
    500,
    [inputAmount, pair]
  );

  const swapMutation = useMutation<void, Error, SwapData>(mutateSwap, {
    onSuccess: () => {
      toast.success('Swap successful');
      onSwap();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const { buttonProps, inputProps, outputProps } = useSwapFormData(pair, inputAmount, trade);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = Number(e.target.value) || undefined;
    setTrade(undefined);
    setInputAmount(value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

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

  const handleTickerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: ticker, name } = e.target;

    const currency = getCurrencyFromTicker(ticker);
    const newPair = getPairChange(pair, currency, name);

    onChangePair(newPair);
  };

  const handlePairSwap = () => onChangePair({ input: pair.output, output: pair.input });

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Swap
      </H1>
      <Divider orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <SlippageManager value={slippage} onChange={(slippage) => setSlippage(slippage)} />
        <form onSubmit={handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <Flex direction='column' gap='spacing12'>
              <TokenInput
                placeholder='0.00'
                label={t('amm.from')}
                selectProps={{
                  name: FormFields.INPUT_TICKER,
                  onChange: handleTickerChange,
                  value: pair.input?.ticker || ''
                }}
                name={FormFields.INPUT_AMOUNT}
                onChange={handleChangeInput}
                {...inputProps}
              />
              <SwapDivider onPress={handlePairSwap} />
              <TokenInput
                placeholder='0.00'
                label={t('amm.to')}
                isDisabled
                name={FormFields.OUTPUT_AMOUNT}
                selectProps={{
                  name: FormFields.OUTPUT_TICKER,
                  onChange: handleTickerChange,
                  value: pair.output?.ticker || ''
                }}
                {...outputProps}
              />
            </Flex>
            {trade && <SwapInfo trade={trade} slippage={Number(slippage)} />}
            <AuthCTA
              type='submit'
              fullWidth
              size='large'
              {...mergeProps(buttonProps, { loading: swapMutation.isLoading })}
            />
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};

export { SwapForm };
export type { SwapFormProps };
