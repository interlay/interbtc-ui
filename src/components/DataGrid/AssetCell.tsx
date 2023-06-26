import { ReactNode } from 'react';

import { InformationCircle } from '@/assets/icons';
import { CoinIcon, Flex, FlexProps, FontSize, IconSize, Span, Tooltip } from '@/component-library';

import { StyledCellTag } from './DataGrid.style';

type Props = {
  ticker: string;
  tickers?: string[];
  size?: IconSize;
  textSize?: FontSize;
  tag?: ReactNode;
  tooltip?: ReactNode;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type AssetCellProps = Props & InheritAttrs;

const AssetCell = ({ ticker, tickers, size, tag, textSize = 's', tooltip, ...props }: AssetCellProps): JSX.Element => (
  <Flex gap='spacing2' alignItems='center' {...props}>
    <CoinIcon ticker={ticker} tickers={tickers} size={size || (tickers ? 'lg' : 'md')} />
    <Span size={textSize} weight='bold'>
      {ticker}
    </Span>
    {tag && <StyledCellTag>{tag}</StyledCellTag>}
    {tooltip && (
      <Tooltip label={tooltip}>
        <InformationCircle size='s' />
      </Tooltip>
    )}
  </Flex>
);

export { AssetCell };
export type { AssetCellProps };
