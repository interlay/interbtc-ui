import { ArrowRightCircle } from '@/assets/icons';
import { Flex } from '@/component-library';

import { Chains, ChainSelect } from '../ChainSelect';
import { IconWrapper } from './ChainInputs.styles';

type Props = {
  testChains: Chains;
};

const ChainInputs = ({ testChains }: Props): JSX.Element => {
  return (
    <Flex alignItems='center' direction='row' gap='spacing4' justifyContent='space-between'>
      <ChainSelect chains={testChains} />
      <IconWrapper>
        <ArrowRightCircle color='secondary' strokeWidth={2} />
      </IconWrapper>
      <ChainSelect chains={testChains} />
    </Flex>
  );
};

export { ChainInputs };
