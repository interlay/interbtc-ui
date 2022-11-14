import MainContainer from '@/parts/MainContainer';

import { ManualIssueExecutionActionsTable } from './components/ManualIssueExecutionActionsTable';

const Actions = (): JSX.Element => {
  return (
    <MainContainer>
      <ManualIssueExecutionActionsTable />
    </MainContainer>
  );
};

export { Actions };
