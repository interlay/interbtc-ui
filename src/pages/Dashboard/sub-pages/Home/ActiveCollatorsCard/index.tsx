
import { useTranslation } from 'react-i18next';
import useDarkMode from 'use-dark-mode';

import LineChart from '../../../LineChart';
import Stats, {
  StatsDt,
  StatsDd
} from '../../../Stats';
import DashboardCard from 'pages/Dashboard/cards/DashboardCard';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  INTERLAY_DENIM,
  KINTSUGI_MIDNIGHT
} from 'utils/constants/colors';
import { range } from 'common/utils/utils';

const ActiveCollatorsCard = (): JSX.Element => {
  const { t } = useTranslation();
  const { value: darkMode } = useDarkMode();

  // TODO: this function should be removed once real data is pulled in
  const dateToMidnightTemp = (date: Date): Date => {
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date;
  };

  const data = [3, 3, 3, 3, 3];
  const dates = range(0, 5).map(i =>
    dateToMidnightTemp(new Date(Date.now() - 86400 * 1000 * i))
      .toISOString()
      .substring(0, 10)
  );

  let chartLineColor;
  if (!darkMode && (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production')) {
    chartLineColor = INTERLAY_DENIM[500];
  } else if (darkMode && process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
    chartLineColor = KINTSUGI_MIDNIGHT[500];
  } else {
    throw new Error('Something went wrong!');
  }

  return (
    <DashboardCard>
      <Stats
        leftPart={
          <>
            <StatsDt>
              {t('dashboard.collators.active_collators')}
            </StatsDt>
            <StatsDd>
              3
            </StatsDd>
          </>
        } />
      <LineChart
        wrapperClassName='h-full'
        colors={[chartLineColor]}
        labels={[t('dashboard.collators.total_collators_chart')]}
        yLabels={dates}
        yAxes={[{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]}
        datasets={[data]} />
    </DashboardCard>
  );
};

export default ActiveCollatorsCard;
