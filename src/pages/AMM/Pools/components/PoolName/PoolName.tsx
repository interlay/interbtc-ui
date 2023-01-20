import { Flex, FlexProps, Span, TokenStack } from '@/component-library';

type Props = {
  tickers: string[];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type PoolNameProps = Props & InheritAttrs;

const PoolName = ({ tickers, ...props }: PoolNameProps): JSX.Element => (
  <Flex {...props} gap='spacing2' alignItems='center'>
    <TokenStack tickers={tickers} />
    <Span size='s' weight='bold'>
      {tickers.join(' - ')}
    </Span>
  </Flex>
);

export { PoolName };
export type { PoolNameProps };
