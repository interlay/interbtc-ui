import { CurrencyExt, LiquidityPool } from '@interlay/interbtc-api';

import { formatUSD } from '@/common/utils/utils';
import { Card, CardProps, CoinPair, Dd, Dl, DlGroup, Dt, Flex, H2 } from '@/component-library';
import { DateRangeVolume, useGetDexVolumes } from '@/hooks/api/use-get-dex-volume';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { calculateTotalLiquidityUSD } from '@/utils/helpers/pool';

type Props = {
  input: CurrencyExt;
  output: CurrencyExt;
  liquidityPool?: LiquidityPool;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type SwapLiquidityProps = Props & InheritAttrs;

const SwapLiquidity = ({ input, output, liquidityPool, ...props }: SwapLiquidityProps): JSX.Element | null => {
  const prices = useGetPrices();
  const { getDexTotalVolumeUSD } = useGetDexVolumes(DateRangeVolume.H24);

  const h24Volume = getDexTotalVolumeUSD([input.ticker, output.ticker]);
  const h24VolumeLabel = formatUSD(h24Volume, { compact: true });

  const liquidity = liquidityPool && calculateTotalLiquidityUSD(liquidityPool.pooledCurrencies, prices);
  const liquidityLabel = liquidity ? formatUSD(liquidity, { compact: true }) : '-';

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
          <Dd weight='bold'>{h24VolumeLabel}</Dd>
        </DlGroup>
        <DlGroup direction='column' alignItems='flex-start' gap='spacing1' flex={1}>
          <Dt color='primary'>Liquidity</Dt>
          <Dd weight='bold'>{liquidityLabel}</Dd>
        </DlGroup>
      </Dl>
    </Card>
  );
};

export { SwapLiquidity };
export type { SwapLiquidityProps };
