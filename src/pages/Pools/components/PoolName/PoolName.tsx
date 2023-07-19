import { Flex, FlexProps, TokenStack } from '@/component-library';

import { StyledSpan } from './PoolName.style';

type Props = {
  tickers: string[];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type PoolNameProps = Props & InheritAttrs;

const PoolName = ({ tickers, ...props }: PoolNameProps): JSX.Element => (
  <Flex {...props} gap='spacing2' alignItems='center' wrap>
    <TokenStack tickers={tickers} />
    <StyledSpan size='s' weight='bold'>
      {tickers.join(' - ')}
    </StyledSpan>
  </Flex>
);

export { PoolName };
export type { PoolNameProps };
