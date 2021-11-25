
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
import {
  ExchangeRate,
  Bitcoin,
  BitcoinUnit,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

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
import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
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
      COLLATERAL_TOKEN_SYMBOL
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
        Cell: function FormattedCell({ value }: {
          value: ExchangeRate<
            Bitcoin,
            BitcoinUnit,
            Currency<CollateralUnit>,
            CollateralUnit
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
      data: oracles ?? []
    }
  );

  if (oraclesIdle || oraclesLoading) {
    return (
      <PrimaryColorEllipsisLoader />
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
      <SectionTitle>
        {t('dashboard.relay.blocks')}
      </SectionTitle>
      <InterlayTable {...getTableProps()}>
        <InterlayThead>
          {/* TODO: should type properly */}
          {headerGroups.map((headerGroup: any) => (
            // eslint-disable-next-line react/jsx-key
            <InterlayTr {...headerGroup.getHeaderGroupProps()}>
              {/* TODO: should type properly */}
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
          {/* TODO: should type properly */}
          {rows.map((row: any) => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...row.getRowProps()}>
                {/* TODO: should type properly */}
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
