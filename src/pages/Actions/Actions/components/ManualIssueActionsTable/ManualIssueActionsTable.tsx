import { IssueStatus } from '@interlay/interbtc-api';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { shortAddress } from '@/common/utils/utils';
import { Table, TableProps } from '@/component-library';
import { CTALink } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import useIssueRequests from '@/services/hooks/use-issue-requests';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

import { Wrapper } from './ManualIssueActionsTable.style';

const queryString = require('query-string');

const FAKE_UNLIMITED_NUMBER = 2147483647; // TODO: a temporary solution for now

enum ManualIssueActionsTableKeys {
  VaultAccountID = 'vault-account-id',
  Action = 'action'
}

type InheritAttrs = Omit<TableProps, 'columns' | 'rows'>;

type ManualIssueActionsTableProps = InheritAttrs;

const ManualIssueActionsTable = (props: ManualIssueActionsTableProps): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useIssueRequests(
    0,
    FAKE_UNLIMITED_NUMBER,
    `userParachainAddress_eq: "${selectedAccount?.address ?? ''}"`,
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(issueRequestsError);

  const columns = React.useMemo(
    () => [
      // TODO: translate
      { name: 'Vault Account ID', uid: ManualIssueActionsTableKeys.VaultAccountID },
      { name: 'Action', uid: ManualIssueActionsTableKeys.Action }
    ],
    []
  );

  const rows = React.useMemo(() => {
    if (issueRequests === undefined) return undefined;

    const manualIssueRequests = issueRequests.filter((item) => {
      switch (item.status) {
        case IssueStatus.Cancelled:
        case IssueStatus.Expired: {
          return item.backingPayment.btcTxId ? true : false;
        }
        case IssueStatus.PendingWithEnoughConfirmations:
          return true;
        default:
          return false;
      }
    });

    return manualIssueRequests.map((item) => {
      return {
        id: item.id,
        [ManualIssueActionsTableKeys.VaultAccountID]: shortAddress(item.vault.accountId),
        [ManualIssueActionsTableKeys.Action]: (
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
            Visit Issue Request
          </CTALink>
        )
      };
    });
  }, [issueRequests]);

  if (issueRequestsIdle || issueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (issueRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  return <Wrapper variant='bordered'>{rows && <Table columns={columns} rows={rows} {...props} />}</Wrapper>;
};

const ManualIssueActionsTableWithErrorBoundary = withErrorBoundary(ManualIssueActionsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});

export { ManualIssueActionsTableWithErrorBoundary as ManualIssueActionsTable };
export type { ManualIssueActionsTableProps };
