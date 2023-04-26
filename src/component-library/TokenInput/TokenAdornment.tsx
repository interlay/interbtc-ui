import { useMemo } from 'react';

import { CoinIcon } from '../CoinIcon';
import { FlexProps } from '../Flex';
import { StyledTicker, StyledTokenAdornment } from './TokenInput.style';

type SingleToken = string;

type MultiToken = { text: string; icons: string[] };

type TokenTicker = SingleToken | MultiToken;

type Props = {
  ticker?: TokenTicker;
};

type NativeAttrs = Omit<FlexProps, keyof Props>;

type TokenAdornmentProps = Props & NativeAttrs;

const TokenAdornment = ({ ticker = '', ...props }: TokenAdornmentProps): JSX.Element => {
  const { tickerText, tickers } = useMemo(() => {
    if (typeof ticker === 'object') {
      return {
        tickerText: ticker.text,
        tickers: ticker.icons
      };
    }

    return {
      tickerText: ticker,
      tickers: undefined
    };
  }, [ticker]);

  return (
    <StyledTokenAdornment {...props} alignItems='center' justifyContent='space-evenly' gap='spacing1'>
      <CoinIcon ticker={tickerText} tickers={tickers} />
      <StyledTicker>{tickerText}</StyledTicker>
    </StyledTokenAdornment>
  );
};

export { TokenAdornment };
export type { TokenAdornmentProps, TokenTicker };
