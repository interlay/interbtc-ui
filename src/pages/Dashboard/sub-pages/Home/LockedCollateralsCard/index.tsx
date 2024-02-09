import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD, getLastMidnightTimestamps } from '@/common/utils/utils';
import { CountOfDatesForChart } from '@/config/charts';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import useAllCumulativeVaultCollateralVolumes from '@/hooks/use-all-cumulative-vault-collateral-volumes';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import { INTERLAY_DENIM, KINTSUGI_SUPERNOVA } from '@/utils/constants/colors';
import { PAGES } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getTokenPrice } from '@/utils/helpers/prices';

import DashboardCard from '../../../cards/DashboardCard';
import LineChart from '../../../LineChart';
import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../../Stats';

const cutoffTimestamps = getLastMidnightTimestamps(CountOfDatesForChart.ONE_MONTH, true);

const LockedCollateralsCard = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const {
    data: allCumulativeVaultCollateralVolumes,
    error: allCumulativeVaultCollateralVolumesError
  } = useAllCumulativeVaultCollateralVolumes(cutoffTimestamps);
  useErrorHandler(allCumulativeVaultCollateralVolumesError);

  const cumulativeUSDVolumes = React.useMemo(() => {
    if (allCumulativeVaultCollateralVolumes === undefined) return;

    return Array<number>(CountOfDatesForChart.ONE_MONTH)
      .fill(0)
      .map((_, index) => {
        const collateralTickers = Object.keys(allCumulativeVaultCollateralVolumes);

        const collaterals = collateralTickers.map((ticker: string) => ({
          cumulativeVolumes: allCumulativeVaultCollateralVolumes[ticker],
          tokenPriceInUSD: getTokenPrice(prices, ticker)?.usd
        }));

        let sumValueInUSD = 0;
        for (const collateral of collaterals) {
          sumValueInUSD +=
            convertMonetaryAmountToValueInUSD(collateral.cumulativeVolumes[index].amount, collateral.tokenPriceInUSD) ??
            0;
        }

        return {
          sumValueInUSD,
          tillTimestamp: cutoffTimestamps[index]
        };
      });
  }, [allCumulativeVaultCollateralVolumes, prices]);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (allCumulativeVaultCollateralVolumes === undefined) {
      return <>Loading...</>;
    }

    if (cumulativeUSDVolumes === undefined) {
      throw new Error('Something went wrong with cumulativeUSDVolumes!');
    }

    const totalLockedCollateralValueInUSDLabel = formatUSD(cumulativeUSDVolumes.slice(-1)[0].sumValueInUSD);

    let chartLineColor;
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
      chartLineColor = INTERLAY_DENIM[500];
      // MEMO: should check dark mode as well
    } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
      chartLineColor = KINTSUGI_SUPERNOVA[500];
    } else {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>{t('dashboard.vault.total_collateral_locked_usd')}</StatsDt>
              <StatsDd>{totalLockedCollateralValueInUSDLabel}</StatsDd>
            </>
          }
          rightPart={<StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}
        />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_collateral_locked_usd')]}
          yLabels={cumulativeUSDVolumes.slice(0, -1).map((item) => item.tillTimestamp.toISOString().substring(0, 10))}
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[cumulativeUSDVolumes.slice(1).map((item) => item.sumValueInUSD)]}
        />
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(LockedCollateralsCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
