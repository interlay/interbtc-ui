import { Flex, Tabs, TabsItem } from '@/component-library';
import MainContainer from '@/parts/MainContainer';
import { useTabPageLocation } from '@/utils/hooks/use-tab-page-location';

import { CrossChainTransferForm, TransferForm } from './components';
import { StyledCard, StyledFormWrapper, StyledWrapper } from './TransferForms.styles';

const TransferForms = (): JSX.Element => {
  const { tabsProps } = useTabPageLocation();

  return (
    <MainContainer>
      <StyledWrapper>
        <StyledCard gap='spacing2'>
          <Flex direction='column' gap='spacing8'>
            <Tabs {...tabsProps} size='large' fullWidth>
              <TabsItem title='Transfer' key='transfer'>
                <StyledFormWrapper>
                  <TransferForm />
                </StyledFormWrapper>
              </TabsItem>
              <TabsItem title='Bridge' key='crossChainTransfer'>
                <StyledFormWrapper>
                  <CrossChainTransferForm />
                </StyledFormWrapper>
              </TabsItem>
            </Tabs>
          </Flex>
        </StyledCard>
      </StyledWrapper>
    </MainContainer>
  );
};

export default TransferForms;
