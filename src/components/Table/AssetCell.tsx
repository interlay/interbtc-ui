import { CoinIcon, Flex, FlexProps, Span } from '@/component-library';

type Props = {
  ticker: string;
  tickers?: string[];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AssetCellProps = Props & InheritAttrs;

const AssetCell = ({ ticker, tickers, ...props }: AssetCellProps): JSX.Element => (
  <Flex gap='spacing2' alignItems='center' {...props}>
    <CoinIcon ticker={ticker} tickers={tickers} size={tickers ? 'lg' : 'md'} />
    <Span size='s' weight='bold'>
      {ticker}
    </Span>
  </Flex>
);

export { AssetCell };
export type { AssetCellProps };
