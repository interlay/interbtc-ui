import { Card, CardProps, CTA, Divider, H1 } from '@/component-library';
import { SwapPair } from '@/types/swap';

import { SlippageManager } from '../SlippageManager';
import { SwapInfo } from '../SwapInfo';

type Props = {
  pair: SwapPair;
  onChangePair: (pair: SwapPair) => void;
};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = (props: SwapFormProps): JSX.Element | null => {
  return (
    <Card {...props}>
      <H1>Swap</H1>
      <Divider orientation='horizontal' />
      <SlippageManager />
      <SwapInfo />
      <CTA>Swap</CTA>
    </Card>
  );
};

export { SwapForm };
export type { SwapFormProps };
