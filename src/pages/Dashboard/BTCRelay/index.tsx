
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import BlocksTable from './BlocksTable';
import BtcRelay from '../components/btc-relay';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

const BTCRelay = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.relay.btc_relay')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayCalifornia',
            'mt-2'
          )} />
      </div>
      <div className='grid grid-cols-2 gap-7'>
        <BtcRelay displayBlockstreamData />
      </div>
      <BlocksTable />
    </MainContainer>
  );
};

export default BTCRelay;
