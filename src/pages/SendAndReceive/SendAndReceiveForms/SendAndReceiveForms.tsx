import { Flex, Tabs, TabsItem } from '@/component-library';
import { usePageQueryParams } from '@/hooks/use-page-query-params';
import MainContainer from '@/legacy-components/MainContainer';
import { QUERY_PARAMETERS, QUERY_PARAMETERS_VALUES } from '@/utils/constants/links';

import { BridgeForm, TransferForm } from './components';
import { StyledCard, StyledFormWrapper, StyledWrapper } from './SendAndReceiveForms.styles';

const SendAndReceiveForms = (): JSX.Element => {
  const { data, tabsProps } = usePageQueryParams();

  const ticker: string | undefined = data[QUERY_PARAMETERS.TRANSFER.TICKER];

  return (
    <MainContainer>
      <StyledWrapper>
        <StyledCard gap='spacing2'>
          <Flex direction='column' gap='spacing8'>
            <Tabs {...tabsProps} size='large' fullWidth>
              <TabsItem title='Transfer' key={QUERY_PARAMETERS_VALUES.TRANSFER.TAB.TRANSFER}>
                <StyledFormWrapper>
                  <TransferForm ticker={ticker} />
                </StyledFormWrapper>
              </TabsItem>
              <TabsItem title='Bridge' key={QUERY_PARAMETERS_VALUES.TRANSFER.TAB.BRIDGE}>
                <StyledFormWrapper>
                  <BridgeForm />
                </StyledFormWrapper>
              </TabsItem>
            </Tabs>
          </Flex>
        </StyledCard>
      </StyledWrapper>
    </MainContainer>
  );
};

export default SendAndReceiveForms;
