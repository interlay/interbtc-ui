import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';

import { Card, CardProps, CoinPair, Dd, Dl, DlGroup, Dt, Flex, H2 } from '@/component-library';

type Props = {
  input: CurrencyExt;
  output: CurrencyExt;
  // TODO: not used
  liquidityPool?: LiquidityPool;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type SwapLiquidityProps = Props & InheritAttrs;

const SwapLiquidity = ({ input, output, ...props }: SwapLiquidityProps): JSX.Element | null => {
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
          <Dd weight='bold'>$12,124</Dd>
        </DlGroup>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1' flex={1}>
          <Dt color='primary'>Liquidity</Dt>
          <Dd weight='bold'>$240,124</Dd>
        </DlGroup>
      </Dl>
    </Card>
  );
};

export { SwapLiquidity };
export type { SwapLiquidityProps };
