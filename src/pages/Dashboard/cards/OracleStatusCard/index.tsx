import clsx from 'clsx';
import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { RELAY_CHAIN_NATIVE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { OracleStatus, useGetOracleStatus } from '@/hooks/api/oracle/use-get-oracle-status';
import { useGetExchangeRate } from '@/hooks/api/use-get-exchange-rate';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import Ring64, { Ring64Subtitle, Ring64Title, Ring64Value } from '@/legacy-components/Ring64';
import { PAGES } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

interface Props {
  hasLinks?: boolean;
}

const OracleStatusCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { data: oracleStatus, isLoading: isLoadingOracleStatus } = useGetOracleStatus();
  const { data: relayChainExchangeRate, isLoading: isLoadingExchangeRate } = useGetExchangeRate(
    RELAY_CHAIN_NATIVE_TOKEN
  );

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (isLoadingOracleStatus || isLoadingExchangeRate) {
      return <>Loading...</>;
    }

    const oracleOnline = oracleStatus && oracleStatus === OracleStatus.ONLINE;

    let statusText;
    let statusCircleText;
    if (relayChainExchangeRate === undefined) {
      statusText = t('dashboard.oracles.not_available');
      statusCircleText = t('unavailable');
    } else if (oracleOnline === true) {
      statusText = t('dashboard.oracles.online');
      statusCircleText = t('online');
    } else if (oracleOnline === false) {
      statusText = t('dashboard.oracles.offline');
      statusCircleText = t('offline');
    } else {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>{t('dashboard.oracles.oracles_are')}</StatsDt>
              <StatsDd
                className={clsx(
                  { [getColorShade('green')]: oracleOnline === true },
                  { [getColorShade('red')]: oracleOnline === false }
                )}
              >
                {statusText}
              </StatsDd>
            </>
          }
          rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_ORACLES}>View oracles</StatsRouterLink>}</>}
        />
        <Ring64
          className={clsx(
            'mx-auto',
            { [getColorShade('green', 'ring')]: oracleOnline === true },
            { [getColorShade('red', 'ring')]: oracleOnline === false }
          )}
        >
          <Ring64Subtitle>BTC/{RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}</Ring64Subtitle>
          <Ring64Title
            className={clsx(
              { [getColorShade('green')]: oracleOnline === true },
              { [getColorShade('red')]: oracleOnline === false }
            )}
          >
            {statusCircleText}
          </Ring64Title>
          {relayChainExchangeRate && (
            <Ring64Value>
              {relayChainExchangeRate.toHuman(5)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
            </Ring64Value>
          )}
        </Ring64>
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(OracleStatusCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
