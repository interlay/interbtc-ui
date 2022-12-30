import { Card, CardProps, H2 } from '@/component-library';
import { SwapPair } from '@/types/swap';

type Props = {
  pair: Required<SwapPair>;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type SwapLiquidityProps = Props & InheritAttrs;

const SwapLiquidity = ({ pair, ...props }: SwapLiquidityProps): JSX.Element | null => {
  const { input, output } = pair;

  return (
    <Card {...props}>
      <H2>
        {input.ticker} - {output.ticker}
      </H2>
    </Card>
  );
};

export { SwapLiquidity };
export type { SwapLiquidityProps };
