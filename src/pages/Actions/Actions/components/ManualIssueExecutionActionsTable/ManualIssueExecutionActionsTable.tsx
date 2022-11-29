import { useId } from '@react-aria/utils';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
// ray test touch <
import { useQuery } from 'react-query';

// ray test touch >
import { H3, Stack, Table, TableProps } from '@/component-library';
import { CTALink } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
// ray test touch <
import { useSubstrateSecureState } from '@/lib/substrate';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
// ray test touch >
import { useManualIssueRequests } from '@/services/hooks/issue-requests';
// ray test touch <
import { issueIdsQuery } from '@/services/queries/issues';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
// ray test touch >
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

import { Wrapper } from './ManualIssueExecutionActionsTable.style';

const queryString = require('query-string');

// ray test touch <
// MEMO: inspired by https://dirask.com/posts/JavaScript-how-to-calculate-page-number-when-we-know-size-of-page-and-item-index-DLPrvD
const calculatePageNumber = (pageSize: number, itemIndex: number) => {
  return Math.ceil(++itemIndex / pageSize);
};
// ray test touch >

enum ManualIssueExecutionActionsTableKeys {
  Notification = 'notification',
  Action = 'action'
}

type InheritAttrs = Omit<TableProps, 'columns' | 'rows'>;

type ManualIssueExecutionActionsTableProps = InheritAttrs;

const ManualIssueExecutionActionsTable = (props: ManualIssueExecutionActionsTableProps): JSX.Element => {
  const titleId = useId();

  const {
    isIdle: manualIssueRequestsIdle,
    isLoading: manualIssueRequestsLoading,
    data: manualIssueRequests,
    error: manualIssueRequestsError
  } = useManualIssueRequests();
  useErrorHandler(manualIssueRequestsError);

  // ray test touch <
  const { selectedAccount } = useSubstrateSecureState();

  const {
    isIdle: issueRequestIdsIdle,
    isLoading: issueRequestIdsLoading,
    data: issueRequestIdsData,
    error: issueRequestIdsError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<Array<{ id: string }>>, Error>(
    [GRAPHQL_FETCHER, issueIdsQuery(`userParachainAddress_eq: "${selectedAccount?.address ?? ''}"`)],
    graphqlFetcher<Array<{ id: string }>>()
  );
  useErrorHandler(issueRequestIdsError);
  // ray test touch >

  const columns = React.useMemo(
    () => [
      // TODO: translate
      { name: 'Notification', uid: ManualIssueExecutionActionsTableKeys.Notification },
      { name: 'Link', uid: ManualIssueExecutionActionsTableKeys.Action }
    ],
    []
  );

  const rows = React.useMemo(() => {
    if (manualIssueRequests === undefined) return undefined;
    // ray test touch <
    if (issueRequestIdsData === undefined) return undefined;
    // ray test touch >

    return manualIssueRequests.map((item) => {
      // ray test touch <
      const issueRequestItemIndex = issueRequestIdsData.data.issues.findIndex(
        (issueRequest) => issueRequest.id === item.id
      );
      // ray test touch >

      return {
        id: item.id,
        [ManualIssueExecutionActionsTableKeys.Notification]: 'Execute issue request', // TODO: translate
        [ManualIssueExecutionActionsTableKeys.Action]: (
          <CTALink
            to={{
              pathname: PAGES.TRANSACTIONS,
              search: queryString.stringify({
                // ray test touch <
                [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: item.id,
                [QUERY_PARAMETERS.ISSUE_REQUESTS_PAGE]: calculatePageNumber(TABLE_PAGE_LIMIT, issueRequestItemIndex)
                // ray test touch >
              })
            }}
            variant='primary'
            fullWidth={false}
          >
            {/* TODO: translate */}
            Go to Request
          </CTALink>
        )
      };
    });
  }, [manualIssueRequests, issueRequestIdsData]);

  if (manualIssueRequestsIdle || manualIssueRequestsLoading || issueRequestIdsIdle || issueRequestIdsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }

  return (
    <Stack spacing='double'>
      {/* TODO: translate */}
      <H3 id={titleId}>Manual Issue Execution Actions Needed</H3>
      <Wrapper variant='bordered'>
        {rows && <Table aria-labelledby={titleId} columns={columns} rows={rows} {...props} />}
      </Wrapper>
    </Stack>
  );
};

const ManualIssueActionsTableWithErrorBoundary = withErrorBoundary(ManualIssueExecutionActionsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

export { ManualIssueActionsTableWithErrorBoundary as ManualIssueExecutionActionsTable };
export type { ManualIssueExecutionActionsTableProps };
