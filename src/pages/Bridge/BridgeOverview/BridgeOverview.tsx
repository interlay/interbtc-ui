import { Flex, Tabs, TabsItem } from '@/component-library';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { BridgeActions } from '@/types/bridge';
import { useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { useGetIssueRequestLimit } from '@/utils/hooks/api/bridge/use-get-issue-request-limits';
import { useGetMaxBurnableTokens } from '@/utils/hooks/api/bridge/use-get-max-burnable-tokens';
import { useGetRedeemData } from '@/utils/hooks/api/bridge/use-get-redeem-data';
import { useTabPageLocation } from '@/utils/hooks/use-tab-page-location';

import { StyledCard, StyledFormWrapper, StyledWrapper } from './BridgeOverview.styles';
import { IssueForm, LegacyBurnForm, LegacyTransactions, RedeemForm } from './components';

const BridgeOverview = (): JSX.Element => {
  const { tabsProps } = useTabPageLocation();

  const { defaultSelectedKey } = tabsProps;

  const { data: issueRequestLimit } = useGetIssueRequestLimit();
  const { data: maxBurnableTokensData } = useGetMaxBurnableTokens();
  const { data: issueData } = useGetIssueData();
  const { data: redeemData } = useGetRedeemData();

  // Only show the loading bar if the tab needed data is still loading
  const isIssueLoading = defaultSelectedKey === BridgeActions.ISSUE && issueData === undefined;
  const isRedeemLoading = defaultSelectedKey === BridgeActions.REDEEM && redeemData === undefined;

  if (issueRequestLimit === undefined || isIssueLoading || isRedeemLoading) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper>
        <StyledCard gap='spacing2'>
          <Flex direction='column' gap='spacing8'>
            <Tabs {...tabsProps} size='large' fullWidth>
              <TabsItem title='Issue' key={BridgeActions.ISSUE}>
                <StyledFormWrapper>
                  {issueData && <IssueForm requestLimits={issueRequestLimit} {...issueData} />}
                </StyledFormWrapper>
              </TabsItem>
              <TabsItem title='Redeem' key={BridgeActions.REDEEM}>
                <StyledFormWrapper>{redeemData && <RedeemForm {...redeemData} />}</StyledFormWrapper>
              </TabsItem>
              {maxBurnableTokensData?.hasBurnableTokens && (
                <TabsItem title='Burn' key={BridgeActions.BURN}>
                  <StyledFormWrapper>
                    <LegacyBurnForm />
                  </StyledFormWrapper>
                </TabsItem>
              )}
            </Tabs>
          </Flex>
        </StyledCard>
      </StyledWrapper>
      <LegacyTransactions />
    </MainContainer>
  );
};

export default BridgeOverview;
