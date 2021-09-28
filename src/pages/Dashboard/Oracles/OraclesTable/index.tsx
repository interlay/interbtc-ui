
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
import { CollateralBtcOracleStatus } from '@interlay/interbtc/build/oracleTypes';
import { ExchangeRate } from '@interlay/monetary-js';

import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import ErrorFallback from 'components/ErrorFallback';
import EllipsisLoader from 'components/EllipsisLoader';
import { ORACLE_CURRENCY_KEY } from 'config/relay-chains';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { formatDateTime } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as CheckCircleIcon } from 'assets/img/icons/check-circle.svg';
import { ReactComponent as CancelIcon } from 'assets/img/icons/cancel.svg';

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
        Cell: function FormattedCell({ value }: { value: ExchangeRate; }) {
          return (
            <>1 BTC = {value.toHuman(5)} DOT</>
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
      data: oracles ?? []
    }
  );

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

  return (
    <InterlayTableContainer
      className={clsx(
        'space-y-6',
        'container',
        'mx-auto'
      )}>
      <div>
        <h2
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          {t('dashboard.relay.blocks')}
        </h2>
      </div>
      <InterlayTable {...getTableProps()}>
        <InterlayThead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <InterlayTr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
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
          {rows.map(row => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...row.getRowProps()}>
                {row.cells.map(cell => {
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
