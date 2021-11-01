
import { useTranslation } from 'react-i18next';

import OracleStatusCard from '../OracleStatusCard';
import OraclesTable from './OraclesTable';
import TimerIncrement from 'parts/TimerIncrement';
import PageTitle from 'parts/PageTitle';
import Hr1 from 'components/hrs/Hr1';

const Oracles = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle
          mainTitle={t('dashboard.oracles.oracles')}
          subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <OracleStatusCard />
      <OraclesTable />
    </>
  );
};

export default Oracles;
