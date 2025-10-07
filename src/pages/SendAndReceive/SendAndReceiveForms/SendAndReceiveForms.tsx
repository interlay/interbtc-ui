import { Alert, Flex, P, Tabs, TabsItem, TextLink } from '@/component-library';
import { MainContainer } from '@/components';
import { usePageQueryParams } from '@/hooks/use-page-query-params';
import { QUERY_PARAMETERS, QUERY_PARAMETERS_VALUES } from '@/utils/constants/links';

// import { BridgeForm, TransferForm } from './components';
import { TransferForm } from './components';
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
                  <Alert status='info'>
                    <P size='s'>
                    The Kintsugi Bridge is in maintenance mode while{' '}
                    <TextLink external to='https://kusama.subsquare.io/referenda/601' color='secondary'>
                      Referenda 601
                    </TextLink>{' '}
                    (Runtime Upgrade 1.9.1) is in progress. Bridging will be available when all upgrades have been completed.
                    </P>
                  </Alert>
                  {/* <BridgeForm /> */}
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
