import { useId } from '@react-aria/utils';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { H3, Stack, Table, TableProps } from '@/component-library';
import { CTALink } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { useManualIssueRequests } from '@/services/hooks/issue-requests';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

import { Wrapper } from './ManualIssueExecutionActionsTable.style';

const queryString = require('query-string');

enum ManualIssueExecutionActionsTableKeys {
  VaultAccountID = 'vault-account-id',
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

  const columns = React.useMemo(
    () => [
      // TODO: translate
      { name: 'Notification', uid: ManualIssueExecutionActionsTableKeys.VaultAccountID },
      { name: 'Link', uid: ManualIssueExecutionActionsTableKeys.Action }
    ],
    []
  );

  const rows = React.useMemo(() => {
    if (manualIssueRequests === undefined) return undefined;

    return manualIssueRequests.map((item) => {
      return {
        id: item.id,
        [ManualIssueExecutionActionsTableKeys.VaultAccountID]: 'Execute issue request', // TODO: translate
        [ManualIssueExecutionActionsTableKeys.Action]: (
          <CTALink
            to={{
              pathname: PAGES.TRANSACTIONS,
              search: queryString.stringify({
                [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: item.id
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
  }, [manualIssueRequests]);

  if (manualIssueRequestsIdle || manualIssueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (manualIssueRequests === undefined) {
    throw new Error('Something went wrong!');
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
