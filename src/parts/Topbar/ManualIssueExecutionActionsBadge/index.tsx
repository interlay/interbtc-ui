import { CTALink } from '@/component-library';
import { PAGES } from '@/utils/constants/links';

// TODO: follow the same folder structures as `component-library`
const ManualIssueExecutionActionsBadge = (): JSX.Element => {
  return (
    <CTALink variant='outlined' to={PAGES.ACTIONS}>
      {/* TODO: translate */}
      Actions Needed
    </CTALink>
  );
};

export default ManualIssueExecutionActionsBadge;
