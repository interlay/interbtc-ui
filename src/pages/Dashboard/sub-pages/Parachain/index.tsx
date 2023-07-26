import { useTranslation } from 'react-i18next';

import Hr1 from '@/legacy-components/hrs/Hr1';
import PageTitle from '@/legacy-components/PageTitle';
import TimerIncrement from '@/legacy-components/TimerIncrement';

import ParachainSecurityCard from '../../cards/ParachainSecurityCard';

const Parachain = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.parachain.parachain')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <ParachainSecurityCard />
    </>
  );
};

export default Parachain;
