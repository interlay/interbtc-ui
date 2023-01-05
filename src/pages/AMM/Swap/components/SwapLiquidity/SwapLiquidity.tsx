import { Card, CardProps, CoinPair, Dd, Dl, DlGroup, Dt, Flex, H2 } from '@/component-library';
import { SwapPair } from '@/types/swap';

type Props = {
  pair: Required<SwapPair>;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type SwapLiquidityProps = Props & InheritAttrs;

const SwapLiquidity = ({ pair, ...props }: SwapLiquidityProps): JSX.Element | null => {
  const { input, output } = pair;

  return (
    <Card {...props} gap='spacing4'>
      <Flex gap='spacing2' alignItems='center'>
        <CoinPair coinOne={pair.input.ticker} coinTwo={pair.output.ticker} size='lg' />
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
