import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import OracleStatus from '../components/oracle-status';
import OracleTable from '../../../common/components/oracle-table/oracle-table';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

export default function OraclesDashboard(): ReactElement {
  const { t } = useTranslation();

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.oracles.oracles')}
          subTitle={<TimerIncrement />} />
        <hr className='border-interlayDenim' />
      </div>
      <OracleStatus />
      <OracleTable dotLocked='1' />
    </MainContainer>
  );
}
