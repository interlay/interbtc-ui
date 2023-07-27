import { CoinIcon, Flex, FlexProps, IconSize } from '@/component-library';

import { StyledStack } from './BaseInfographics.styles';

type Props = {
  size: IconSize;
  ticker: string | string[];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type InfographicsPropsToken = Props & InheritAttrs;

const BaseInfographicsToken = ({ ticker, size, ...props }: InfographicsPropsToken): JSX.Element => {
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

export { BaseInfographicsToken };
export type { InfographicsPropsToken };
