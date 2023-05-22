import clsx from 'clsx';

import { Flex, Tabs, TabsItem } from '@/component-library';
import Panel from '@/legacy-components/Panel';
import MainContainer from '@/parts/MainContainer';

import CrossChainTransferForm from './CrossChainTransferForm';
import { StyledWrapper } from './Transfer.style';
import TransferForm from './TransferForm';

const Transfer = (): JSX.Element | null => {
  return (
    <MainContainer>
      <Panel className={clsx('mx-auto', 'w-full', 'md:max-w-xl', 'p-10')}>
        <Flex direction='column' gap='spacing8'>
          <Tabs size='large' fullWidth>
            <TabsItem title='Transfer' key='transfer'>
              <StyledWrapper>
                <TransferForm />
              </StyledWrapper>
            </TabsItem>
            <TabsItem title='Cross Chain Transfer' key='crossChainTransfer'>
              <StyledWrapper>
                <CrossChainTransferForm />
              </StyledWrapper>
            </TabsItem>
          </Tabs>
        </Flex>
      </Panel>
    </MainContainer>
  );
};

export default Transfer;
