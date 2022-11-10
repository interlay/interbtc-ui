import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { CTALink } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import { useManualIssueRequests } from '@/services/hooks/issue-requests';
import { PAGES } from '@/utils/constants/links';

// ray test touch <
// TODO:
// - Follow the same folder structures as `component-library`.
// - active/inactive behavior
// - Make it close to its design.
// ray test touch >
const ManualIssueExecutionActionsBadge = (): JSX.Element => {
  // ray test touch <
  const {
    isIdle: manualIssueRequestsIdle,
    isLoading: manualIssueRequestsLoading,
    data: manualIssueRequests,
    error: manualIssueRequestsError
  } = useManualIssueRequests();
  useErrorHandler(manualIssueRequestsError);

  const disabled = manualIssueRequestsIdle || manualIssueRequestsLoading || manualIssueRequests?.length === 0;

  const countOfActionsLabel = manualIssueRequests ? manualIssueRequests.length : '-';
  // ray test touch >

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
