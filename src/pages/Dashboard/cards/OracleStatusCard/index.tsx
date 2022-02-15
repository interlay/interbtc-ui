import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { CollateralUnit } from '@interlay/interbtc-api';

import DashboardCard from '../DashboardCard';
import Stats, {
  StatsDt,
  StatsDd,
  StatsRouterLink
} from '../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import { StoreType } from 'common/types/util.types';
import Ring64, {
  Ring64Title,
  Ring64Value
} from 'components/Ring64';
import { COLLATERAL_TOKEN, COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import {
  BtcToCurrencyOracleStatus,
  latestExchangeRateFetcher,
  ORACLE_LATEST_EXCHANGE_RATE_FETCHER
} from 'services/fetchers/oracle-exchange-rates-fetcher';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';

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
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'oracle',
      'getOnlineTimeout'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(oracleTimeoutError);

  const {
    isIdle: oracleStatusIdle,
    isLoading: oracleStatusLoading,
    data: oracleStatus,
    error: oracleStatusError
  } = useQuery<BtcToCurrencyOracleStatus<CollateralUnit> | undefined, Error >(
    [
      ORACLE_LATEST_EXCHANGE_RATE_FETCHER,
      COLLATERAL_TOKEN,
      oracleTimeout
    ],
    latestExchangeRateFetcher,
    {
      enabled: !!oracleTimeout
    }
  );
  useErrorHandler(oracleStatusError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (
      oracleStatusIdle ||
      oracleStatusLoading ||
      oracleTimeoutIdle ||
      oracleTimeoutLoading
    ) {
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
              <StatsDt>
                {t('dashboard.oracles.oracles_are')}
              </StatsDt>
              <StatsDd
                className={clsx(
                  { 'text-interlayConifer': oracleOnline === true },
                  { 'text-interlayCinnabar': oracleOnline === false }
                )}>
                {statusText}
              </StatsDd>
            </>
          }
          rightPart={
            <>
              {hasLinks && (
                <StatsRouterLink to={PAGES.DASHBOARD_ORACLES}>
                  View oracles
                </StatsRouterLink>
              )}
            </>
          } />
        <Ring64
          className={clsx(
            'mx-auto',
            { 'ring-interlayConifer': oracleOnline === true },
            { 'ring-interlayCinnabar': oracleOnline === false }
          )}>
          <Ring64Title
            className={clsx(
              { 'text-interlayConifer': oracleOnline === true },
              { 'text-interlayCinnabar': oracleOnline === false }
            )}>
            {statusCircleText}
          </Ring64Title>
          {exchangeRate &&
            <Ring64Value>
              {exchangeRate.toHuman(5)} BTC/{COLLATERAL_TOKEN_SYMBOL}
            </Ring64Value>
          }
        </Ring64>
      </>
    );
  };

  return (
    <DashboardCard>
      {renderContent()}
    </DashboardCard>
  );
};

export default withErrorBoundary(OracleStatusCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
