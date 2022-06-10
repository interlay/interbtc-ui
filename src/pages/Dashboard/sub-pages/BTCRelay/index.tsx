import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';

import BTCRelayCard from '../../cards/BTCRelayCard';
import BlocksTable from './BlocksTable';
import BlockstreamCard from './BlockstreamCard';

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
