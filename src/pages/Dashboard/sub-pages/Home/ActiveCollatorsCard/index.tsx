import { useTranslation } from 'react-i18next';

import { getLastMidnightTimestamps } from '@/common/utils/utils';
import DashboardCard from '@/pages/Dashboard/cards/DashboardCard';
import { INTERLAY_DENIM, KINTSUGI_APPLE } from '@/utils/constants/colors';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import LineChart from '../../../LineChart';
import Stats, { StatsDd, StatsDt } from '../../../Stats';

// TODO: this function should be removed once real data is pulled in
const cutoffTimestamps = getLastMidnightTimestamps(5, false);

// TODO: hardcoded
const data = [3, 3, 3, 3, 3];
const dates = cutoffTimestamps.map((date) => date.toISOString().substring(0, 10));

const ActiveCollatorsCard = (): JSX.Element => {
  const { t } = useTranslation();

  let chartLineColor;
  if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
    chartLineColor = INTERLAY_DENIM[500];
    // MEMO: should check dark mode as well
  } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
    chartLineColor = KINTSUGI_APPLE[300];
  } else {
    throw new Error('Something went wrong!');
  }

  return (
    <DashboardCard>
      <Stats
        leftPart={
          <>
            <StatsDt>{t('dashboard.collators.active_collators')}</StatsDt>
            <StatsDd>3</StatsDd>
          </>
        }
      />
      <LineChart
        wrapperClassName='h-full'
        colors={[chartLineColor]}
        labels={[t('dashboard.collators.total_collators_chart')]}
        yLabels={dates}
        yAxes={[
          {
            ticks: {
              beginAtZero: true,
              precision: 0
            }
          }
        ]}
        datasets={[data]}
      />
    </DashboardCard>
  );
};

export default ActiveCollatorsCard;
