import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import ErrorFallback from '@/components/ErrorFallback';
import Ring64, { Ring64Subtitle, Ring64Title, Ring64Value } from '@/components/Ring64';
import { RELAY_CHAIN_NATIVE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import {
  BtcToCurrencyOracleStatus,
  latestExchangeRateFetcher,
  ORACLE_LATEST_EXCHANGE_RATE_FETCHER
} from '@/services/fetchers/oracle-exchange-rates-fetcher';
import { PAGES } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

interface Props {
  hasLinks?: boolean;
}

const OracleStatusCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: oracleTimeoutIdle,
    isLoading: oracleTimeoutLoading,
    data: oracleTimeout,
    error: oracleTimeoutError
  } = useQuery<number, Error>([GENERIC_FETCHER, 'oracle', 'getOnlineTimeout'], genericFetcher<number>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(oracleTimeoutError);

  const {
    isIdle: oracleStatusIdle,
    isLoading: oracleStatusLoading,
    data: oracleStatus,
    error: oracleStatusError
  } = useQuery<BtcToCurrencyOracleStatus | undefined, Error>(
    [ORACLE_LATEST_EXCHANGE_RATE_FETCHER, RELAY_CHAIN_NATIVE_TOKEN, oracleTimeout],
    latestExchangeRateFetcher,
    {
      enabled: !!oracleTimeout
    }
  );
  useErrorHandler(oracleStatusError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (oracleStatusIdle || oracleStatusLoading || oracleTimeoutIdle || oracleTimeoutLoading) {
      return <>Loading...</>;
    }

    if (oracleTimeout === undefined) {
      throw new Error('Something went wrong!');
    }

    const exchangeRate = oracleStatus?.exchangeRate;
    const oracleOnline = oracleStatus && oracleStatus.online;

    let statusText;
    let statusCircleText;
    if (exchangeRate === undefined) {
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
          {exchangeRate && (
            <Ring64Value>
              {exchangeRate.toHuman(5)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
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
