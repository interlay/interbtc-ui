// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { CollateralUnit } from '@interlay/interbtc-api';
import {
  Currency,
  ExchangeRate,
  Bitcoin,
  BitcoinUnit
} from '@interlay/monetary-js';

import SectionTitle from 'parts/SectionTitle';
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import { COLLATERAL_TOKEN, COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { formatDateTime } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as CheckCircleIcon } from 'assets/img/icons/check-circle.svg';
import { ReactComponent as CancelIcon } from 'assets/img/icons/cancel.svg';
import {
  allLatestSubmissionsFetcher,
  BtcToCurrencyOracleStatus,
  ORACLE_ALL_LATEST_UPDATES_FETCHER
} from 'services/fetchers/oracle-exchange-rates-fetcher';

const OracleTable = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: namesMapIdle,
    isLoading: namesMapLoading,
    data: namesMap,
    error: namesMapError
  } = useQuery<Map<string, string>, Error>(
    [
      GENERIC_FETCHER,
      'oracle',
      'getSourcesById'
    ],
    genericFetcher<Map<string, string>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(namesMapError);

  const {
    isIdle: oracleTimeoutIdle,
    isLoading: oracleTimeoutLoading,
    data: oracleTimeout,
    error: oracleTimeoutError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
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
    isIdle: oracleSubmissionsIdle,
    isLoading: oracleSubmissionsLoading,
    data: oracleSubmissions,
    error: oracleSubmissionsError
  } = useQuery<BtcToCurrencyOracleStatus<CollateralUnit>[], Error >(
    [
      ORACLE_ALL_LATEST_UPDATES_FETCHER,
      COLLATERAL_TOKEN,
      oracleTimeout,
      namesMap
    ],
    allLatestSubmissionsFetcher,
    {
      enabled: !!oracleTimeout && !!namesMap
    }
  );
  useErrorHandler(oracleSubmissionsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('source'),
        accessor: 'source',
        classNames: [
          'text-center'
        ]
      },
      {
        Header: t('feed'),
        accessor: 'feed',
        classNames: [
          'text-center'
        ]
      },
      {
        Header: t('last_update'),
        accessor: 'lastUpdate',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: Date; }) {
          return (
            <>{formatDateTime(value)}</>
          );
        }
      },
      {
        Header: t('exchange_rate'),
        accessor: 'exchangeRate',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: {
          value: ExchangeRate<
            Bitcoin, BitcoinUnit, Currency<CollateralUnit>, CollateralUnit
          >;
        }) {
          return (
            <>1 BTC = {value.toHuman(5)} {COLLATERAL_TOKEN_SYMBOL}</>
          );
        }
      },
      {
        Header: t('status'),
        accessor: 'online',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: boolean; }) {
          return (
            <div
              className={clsx(
                'inline-flex',
                'items-center',
                'space-x-1'
              )}>
              {value ? (
                <>
                  <CheckCircleIcon className='text-interlayConifer' />
                  <span className='text-interlayConifer'>{t('online')}</span>
                </>
              ) : (
                <>
                  <CancelIcon className='text-interlayCinnabar' />
                  <span className='text-interlayCinnabar'>{t('offline')}</span>
                </>
              )}
            </div>
          );
        }
      }
    ],
    [t]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: oracleSubmissions ?? []
    }
  );

  if (
    namesMapIdle ||
    namesMapLoading ||
    oracleTimeoutIdle ||
    oracleTimeoutLoading ||
    oracleSubmissionsIdle ||
    oracleSubmissionsLoading
  ) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }
  if (!oracleSubmissions) {
    throw new Error('Something went wrong!');
  }

  return (
    <InterlayTableContainer
      className={clsx(
        'space-y-6',
        'container',
        'mx-auto'
      )}>
      <SectionTitle>
        {t('dashboard.oracles.oracles')}
      </SectionTitle>
      <InterlayTable {...getTableProps()}>
        <InterlayThead>
          {headerGroups.map((headerGroup: any) => (
            // eslint-disable-next-line react/jsx-key
            <InterlayTr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                // eslint-disable-next-line react/jsx-key
                <InterlayTh
                  {...column.getHeaderProps([
                    {
                      className: clsx(column.classNames),
                      style: column.style
                    }
                  ])}>
                  {column.render('Header')}
                </InterlayTh>
              ))}
            </InterlayTr>
          ))}
        </InterlayThead>
        <InterlayTbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <InterlayTd
                      {...cell.getCellProps([
                        {
                          className: clsx(cell.column.classNames),
                          style: cell.column.style
                        }
                      ])}>
                      {cell.render('Cell')}
                    </InterlayTd>
                  );
                })}
              </InterlayTr>
            );
          })}
        </InterlayTbody>
      </InterlayTable>
    </InterlayTableContainer>
  );
};

export default withErrorBoundary(OracleTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
