import { CoinIcon, Flex, FlexProps, IconSize } from '@/component-library';

import { StyledStack } from './StrategyInfographics.styles';

type Props = {
  size: IconSize;
  ticker: string | string[];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StrategyInfographicsPropsToken = Props & InheritAttrs;

const StrategyInfographicsToken = ({ ticker, size, ...props }: StrategyInfographicsPropsToken): JSX.Element => {
  if (typeof ticker === 'string') {
    return (
      <Flex {...props}>
        <CoinIcon size={size} ticker={ticker} />
      </Flex>
    );
  }

  return (
    <StyledStack>
      {ticker.map((item) => (
        <Flex key={item}>
          <CoinIcon size={size} ticker={item} />
        </Flex>
      ))}
    </StyledStack>
  );
};

export { StrategyInfographicsToken };
export type { StrategyInfographicsPropsToken };
