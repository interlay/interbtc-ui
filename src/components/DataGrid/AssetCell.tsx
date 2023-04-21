import { CoinIcon, Flex, FlexProps, FontSize, IconSize, Span } from '@/component-library';

import { StyledAssetCellInfo } from './DataGrid.style';

type Props = {
  ticker: string;
  tickers?: string[];
  size?: IconSize;
  textSize?: FontSize;
  isEmptyPool?: boolean;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AssetCellProps = Props & InheritAttrs;

const AssetCell = ({ ticker, tickers, size, isEmptyPool, textSize = 's', ...props }: AssetCellProps): JSX.Element => (
  <Flex gap='spacing2' alignItems='center' {...props}>
    <CoinIcon ticker={ticker} tickers={tickers} size={size || (tickers ? 'lg' : 'md')} />
    <Span size={textSize} weight='bold'>
      {ticker}
    </Span>
    {isEmptyPool && <StyledAssetCellInfo>illiquid</StyledAssetCellInfo>}
  </Flex>
);

export { AssetCell };
export type { AssetCellProps };
