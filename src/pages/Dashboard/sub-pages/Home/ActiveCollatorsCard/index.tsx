
import { useTranslation } from 'react-i18next';

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
  KINTSUGI_APPLE
} from 'utils/constants/colors';
import { getLastMidnightTimestamps } from 'common/utils/utils';

const ActiveCollatorsCard = (): JSX.Element => {
  const { t } = useTranslation();

  // TODO: this function should be removed once real data is pulled in
  const graphTimestamps = getLastMidnightTimestamps(5, false);

  // TODO: hardcoded
  const data = [3, 3, 3, 3, 3];
  const dates = graphTimestamps.map(date => date.toISOString().substring(0, 10));

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
