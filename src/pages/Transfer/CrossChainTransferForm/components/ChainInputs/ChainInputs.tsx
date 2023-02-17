import { ArrowRightCircle } from '@/assets/icons';
import { Flex } from '@/component-library';
import { Chains } from '@/types/chains';

import { ChainSelect } from '../ChainSelect';
import { IconWrapper } from './ChainInputs.styles';

type Props = {
  fromChains: Chains;
  toChains: Chains;
};

const ChainInputs = ({ fromChains, toChains }: Props): JSX.Element => {
  return (
    <Flex alignItems='center' direction='row' gap='spacing4' justifyContent='space-between'>
      <ChainSelect chains={fromChains} />
      <IconWrapper>
        <ArrowRightCircle color='secondary' strokeWidth={2} />
      </IconWrapper>
      <ChainSelect chains={toChains} />
    </Flex>
  );
};

export { ChainInputs };
