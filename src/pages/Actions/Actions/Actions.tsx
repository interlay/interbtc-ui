import MainContainer from '@/parts/MainContainer';

import { ManualIssueActionsTable } from './components/ManualIssueActionsTable';

const Actions = (): JSX.Element => {
  return (
    <MainContainer>
      <ManualIssueActionsTable />
    </MainContainer>
  );
};

export { Actions };
