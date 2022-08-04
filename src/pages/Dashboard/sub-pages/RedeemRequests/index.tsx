import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import RedeemRequestsTable from '@/pages/Dashboard/sub-pages/RedeemRequests/RedeemRequestsTable';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';

import UpperContent from './UpperContent';

const RedeemRequests = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.redeem.redeem')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <UpperContent />
      <RedeemRequestsTable />
    </>
  );
};

export default RedeemRequests;
