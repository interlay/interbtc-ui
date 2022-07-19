import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';

import IssueRequestsTable from './IssueRequestsTable';
import UpperContent from './UpperContent';

const IssueRequests = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle mainTitle={t('issue_page.issue_requests')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <UpperContent />
      <IssueRequestsTable />
    </>
  );
};

export default IssueRequests;
