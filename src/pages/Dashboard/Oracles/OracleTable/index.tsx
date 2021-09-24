
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { CollateralBtcOracleStatus } from '@interlay/interbtc/build/oracleTypes';

import DashboardTable, { StatusComponent, StatusCategories } from 'common/components/dashboard-table/dashboard-table';
import ErrorFallback from 'components/ErrorFallback';
import EllipsisLoader from 'components/EllipsisLoader';
import { ORACLE_CURRENCY_KEY } from 'config/relay-chains';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { formatDateTime } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';

const OracleTable = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: oraclesIdle,
    isLoading: oraclesLoading,
    data: oracles,
    error: oraclesError
  } = useQuery<Array<CollateralBtcOracleStatus>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getLatestSubmissionForEachOracle',
      ORACLE_CURRENCY_KEY
    ],
    genericFetcher<Array<CollateralBtcOracleStatus>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(oraclesError);

  if (oraclesIdle || oraclesLoading) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
      </div>
    );
  }
  if (!oracles) {
    throw new Error('Something went wrong!');
  }

  const tableHeadings = [
    <h1
      className='opacity-30'
      key={1}>
      {t('source')}
    </h1>,
    <h1
      className='opacity-30'
      key={2}>
      {t('feed')}
    </h1>,
    <h1
      className='opacity-30'
      key={3}>
      {t('last_update')}
    </h1>,
    <h1
      className='opacity-30'
      key={4}>
      {t('exchange_rate')}
    </h1>,
    <h1
      className='opacity-30'
      key={5}>
      {t('status')}
    </h1>
  ];

  const oracleTableRow = (oracle: CollateralBtcOracleStatus): ReactElement[] => [
    <p key={1}>{oracle.source}</p>,
    <p key={2}>{oracle.feed}</p>,
    <p key={3}>{formatDateTime(oracle.lastUpdate)}</p>,
    <p key={4}> 1 BTC = {oracle.exchangeRate.toHuman(5)} DOT</p>,
    <StatusComponent
      key={5}
      {...(oracle.online ?
        { text: t('online'), category: StatusCategories.Ok } :
        { text: t('offline'), category: StatusCategories.Bad })} />
  ];

  return (
    <div
      style={{ margin: '40px 0px' }}>
      <div>
        <p
          className='mb-4'
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.oracles.oracles')}
        </p>
      </div>
      <DashboardTable
        pageData={oracles}
        headings={tableHeadings}
        dataPointDisplayer={oracleTableRow}
        noDataEl={<td colSpan={4}>{t('no_oracles')}</td>} />
    </div>
  );
};

export default withErrorBoundary(OracleTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
