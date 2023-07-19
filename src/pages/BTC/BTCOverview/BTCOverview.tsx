import { Flex, Tabs, TabsItem } from '@/component-library';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { QUERY_PARAMETERS_VALUES } from '@/utils/constants/links';
import { useGetIssueData } from '@/utils/hooks/api/bridge/use-get-issue-data';
import { useGetIssueRequestLimit } from '@/utils/hooks/api/bridge/use-get-issue-request-limits';
import { useGetMaxBurnableTokens } from '@/utils/hooks/api/bridge/use-get-max-burnable-tokens';
import { useGetRedeemData } from '@/utils/hooks/api/bridge/use-get-redeem-data';
import { usePageQueryParams } from '@/utils/hooks/use-page-query-params';

import { StyledCard, StyledFormWrapper, StyledWrapper } from './BTCOverview.styles';
import { IssueForm, LegacyBurnForm, LegacyTransactions, RedeemForm } from './components';

const BTCOverview = (): JSX.Element => {
  const { tabsProps } = usePageQueryParams();

  const { defaultSelectedKey } = tabsProps;

  const { data: issueRequestLimit } = useGetIssueRequestLimit();
  const { data: maxBurnableTokensData } = useGetMaxBurnableTokens();
  const { data: issueData } = useGetIssueData();
  const { data: redeemData } = useGetRedeemData();

  // Only show the loading bar if the tab needed data is still loading
  const isIssueLoading = defaultSelectedKey === QUERY_PARAMETERS_VALUES.BRIDGE.TAB.ISSUE && issueData === undefined;
  const isRedeemLoading = defaultSelectedKey === QUERY_PARAMETERS_VALUES.BRIDGE.TAB.REDEEM && redeemData === undefined;

  if (issueRequestLimit === undefined || isIssueLoading || isRedeemLoading) {
    return <FullLoadingSpinner />;
  }

  return (
    <MainContainer>
      <StyledWrapper>
        <StyledCard gap='spacing2'>
          <Flex direction='column' gap='spacing8'>
            <Tabs {...tabsProps} size='large' fullWidth>
              <TabsItem title='Issue' key={QUERY_PARAMETERS_VALUES.BRIDGE.TAB.ISSUE}>
                <StyledFormWrapper>
                  {issueData && <IssueForm requestLimits={issueRequestLimit} {...issueData} />}
                </StyledFormWrapper>
              </TabsItem>
              <TabsItem title='Redeem' key={QUERY_PARAMETERS_VALUES.BRIDGE.TAB.REDEEM}>
                <StyledFormWrapper>{redeemData && <RedeemForm {...redeemData} />}</StyledFormWrapper>
              </TabsItem>
              {maxBurnableTokensData?.hasBurnableTokens && (
                <TabsItem title='Burn' key={QUERY_PARAMETERS_VALUES.BRIDGE.TAB.BURN}>
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

export default BTCOverview;
