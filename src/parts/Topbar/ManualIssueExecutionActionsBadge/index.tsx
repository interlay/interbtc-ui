import { CTALink } from '@/component-library';
import { PAGES } from '@/utils/constants/links';

// TODO:
// - Follow the same folder structures as `component-library`.
// - active/inactive behavior
// - Make it close to its design.
const ManualIssueExecutionActionsBadge = (): JSX.Element => {
  // ray test touch <
  // ray test touch >
  return (
    <CTALink variant='outlined' to={PAGES.ACTIONS}>
      {/* TODO: translate */}
      Actions Needed
    </CTALink>
  );
};

export default ManualIssueExecutionActionsBadge;
