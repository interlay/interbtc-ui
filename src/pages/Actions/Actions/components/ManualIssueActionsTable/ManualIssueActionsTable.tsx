import { IssueStatus } from '@interlay/interbtc-api';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { Table, TableProps } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useSubstrateSecureState } from '@/lib/substrate';
import useIssueRequests from '@/services/hooks/use-issue-requests';

import { Wrapper } from './ManualIssueActionsTable.style';

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
        // ray test touch <
        [ManualIssueActionsTableKeys.VaultAccountID]: item.vault.accountId,
        [ManualIssueActionsTableKeys.Action]: item.id
        // ray test touch >
      };
    });
  }, [issueRequests]);

  if (issueRequestsIdle || issueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (issueRequests === undefined) {
    throw new Error('Something went wrong!');
  }
  // const handleVisitIssueRequestClick = (issueRequest: IssueRequestWithStatusDecoded) => {
  //   console.log('ray : ***** issueRequest => ', issueRequest);
  // };
  // ray test touch >

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
