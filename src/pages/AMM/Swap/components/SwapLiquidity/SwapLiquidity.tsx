import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';

import { formatUSD } from '@/common/utils/utils';
import { Card, CardProps, CoinPair, Dd, Dl, DlGroup, Dt, Flex, H2 } from '@/component-library';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { calculateTotalLiquidityUSD } from '../../../shared/utils';

type Props = {
  input: CurrencyExt;
  output: CurrencyExt;
  // TODO: not used
  liquidityPool: LiquidityPool;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type SwapLiquidityProps = Props & InheritAttrs;

const SwapLiquidity = ({ input, output, liquidityPool, ...props }: SwapLiquidityProps): JSX.Element | null => {
  const prices = useGetPrices();
  const liquidity = calculateTotalLiquidityUSD(liquidityPool.pooledCurrencies, prices);

  return (
    <Card {...props} gap='spacing4'>
      <Flex gap='spacing2' alignItems='center'>
        <CoinPair coinOne={input.ticker} coinTwo={output.ticker} size='lg' />
        <H2 size='lg' weight='bold'>
          {input.ticker} - {output.ticker}
        </H2>
      </Flex>
      <Dl>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1' flex={1}>
          <Dt color='primary'>Volume (24h)</Dt>
          <Dd weight='bold'>-</Dd>
        </DlGroup>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1' flex={1}>
          <Dt color='primary'>Liquidity</Dt>
          <Dd weight='bold'>{formatUSD(liquidity, { compact: true })}</Dd>
        </DlGroup>
      </Dl>
    </Card>
  );
};

export { SwapLiquidity };
export type { SwapLiquidityProps };
