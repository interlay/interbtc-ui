import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import BlocksTable from './BlocksTable';
import BlockstreamCard from './BlockstreamCard';
import BTCRelayCard from '../../cards/BTCRelayCard';
import TimerIncrement from 'parts/TimerIncrement';
import PageTitle from 'parts/PageTitle';
import Hr1 from 'components/hrs/Hr1';

const BTCRelay = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.relay.btc_relay')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <div className={clsx('grid', 'grid-cols-2', 'gap-7')}>
        <BTCRelayCard />
        <BlockstreamCard />
      </div>
      <BlocksTable />
    </>
  );
};

export default BTCRelay;
