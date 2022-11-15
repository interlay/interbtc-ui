import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { CTALink } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import { useManualIssueRequests } from '@/services/hooks/issue-requests';
import { PAGES } from '@/utils/constants/links';

const ManualIssueExecutionActionsBadge = (): JSX.Element => {
  const {
    isIdle: manualIssueRequestsIdle,
    isLoading: manualIssueRequestsLoading,
    data: manualIssueRequests,
    error: manualIssueRequestsError
  } = useManualIssueRequests();
  useErrorHandler(manualIssueRequestsError);

  const disabled = manualIssueRequestsIdle || manualIssueRequestsLoading || manualIssueRequests?.length === 0;

  const countOfActionsLabel = manualIssueRequests ? manualIssueRequests.length : '-';

  return (
    <CTALink variant='outlined' to={PAGES.ACTIONS} disabled={disabled}>
      {/* TODO: translate */}
      {countOfActionsLabel} Actions Needed
    </CTALink>
  );
};

export default withErrorBoundary(ManualIssueExecutionActionsBadge, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
