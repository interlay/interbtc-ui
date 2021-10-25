
import { useTranslation } from 'react-i18next';

import OracleStatus from '../components/oracle-status';
import OraclesTable from './OraclesTable';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import Hr1 from 'components/hrs/Hr1';

const Oracles = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.oracles.oracles')}
          subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <OracleStatus />
      <OraclesTable />
    </MainContainer>
  );
};

export default Oracles;
