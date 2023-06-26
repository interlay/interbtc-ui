import { Flex, Tabs, TabsItem } from '@/component-library';
import MainContainer from '@/parts/MainContainer';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { usePageQueryParams } from '@/utils/hooks/use-page-query-params';

import { BridgeForm, TransferForm } from './components';
import { StyledCard, StyledFormWrapper, StyledWrapper } from './SendAndReceiveForms.styles';

enum TransferActions {
  TRASNFER = 'transfer',
  BRIDGE = 'crossChainTransfer'
}

const SendAndReceiveForms = (): JSX.Element => {
  const { data, tabsProps } = usePageQueryParams();

  const ticker: string | undefined = data[QUERY_PARAMETERS.TRANSFER.TICKER];
  const xcmTicker: string | undefined = data[QUERY_PARAMETERS.TRANSFER.XCM_TICKER];

  return (
    <MainContainer>
      <StyledWrapper>
        <StyledCard gap='spacing2'>
          <Flex direction='column' gap='spacing8'>
            <Tabs {...tabsProps} size='large' fullWidth>
              <TabsItem title='Transfer' key={TransferActions.TRASNFER}>
                <StyledFormWrapper>
                  <TransferForm ticker={ticker} />
                </StyledFormWrapper>
              </TabsItem>
              <TabsItem title='Bridge' key={TransferActions.BRIDGE}>
                <StyledFormWrapper>
                  <BridgeForm ticker={xcmTicker} />
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
