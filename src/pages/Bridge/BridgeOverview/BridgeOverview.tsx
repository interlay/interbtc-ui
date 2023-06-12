import { Flex, Tabs, TabsItem } from '@/component-library';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { useGetIssueRequestLimit } from '@/utils/hooks/api/bridge/use-get-issue-request-limits';
import { useGetMaxBurnanbleTokens } from '@/utils/hooks/api/bridge/use-get-max-burnable-tokens';
import { useTabPageLocation } from '@/utils/hooks/use-tab-page-location';

import { StyledCard, StyledFormWrapper, StyledWrapper } from './BridgeOverview.styles';
import { IssueForm } from './components';

enum BridgeTabs {
  ISSUE = 'issue',
  REDEEM = 'redeem',
  BURN = 'burn'
}

// TODO: check for burn tab
const BridgeOverview = (): JSX.Element => {
  const { tabsProps } = useTabPageLocation();

  const { data: issueRequestLimit } = useGetIssueRequestLimit();
  const { data: maxBurnableTokensData } = useGetMaxBurnanbleTokens();
  const { data: issueData } = useGetIssueData();

  if (issueRequestLimit === undefined || issueData === undefined) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper>
        <StyledCard gap='spacing2'>
          <Flex direction='column' gap='spacing8'>
            <Tabs {...tabsProps} size='large' fullWidth>
              <TabsItem title='Issue' key={BridgeTabs.ISSUE}>
                <StyledFormWrapper>
                  <IssueForm requestLimits={issueRequestLimit} data={issueData} />
                </StyledFormWrapper>
              </TabsItem>
              <TabsItem title='Redeem' key={BridgeTabs.REDEEM}>
                <StyledFormWrapper>Redeem</StyledFormWrapper>
              </TabsItem>
              {maxBurnableTokensData?.hasBurnableTokens && (
                <TabsItem title='Burn' key={BridgeTabs.BURN}>
                  <StyledFormWrapper>Burn</StyledFormWrapper>
                </TabsItem>
              )}
            </Tabs>
          </Flex>
        </StyledCard>
      </StyledWrapper>
    </MainContainer>
  );
};

export default BridgeOverview;
