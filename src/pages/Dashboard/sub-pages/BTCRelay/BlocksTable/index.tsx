
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  reverseEndiannessHex,
  stripHexPrefix
} from '@interlay/interbtc-api';

import SectionTitle from 'parts/SectionTitle';
import ErrorFallback from 'components/ErrorFallback';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import ExternalLink from 'components/ExternalLink';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayPagination from 'components/UI/InterlayPagination';
import useQueryParams from 'utils/hooks/use-query-params';
import { BTC_BLOCK_API } from 'config/bitcoin';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { formatDateTimePrecise } from 'common/utils/utils';
import {
  StoreType,
  RelayedBlock
} from 'common/types/util.types';

const BlocksTable = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  const {
    isIdle: blocksIdle,
    isLoading: blocksLoading,
    data: blocks,
    error: blocksError
  } = useQuery<Array<RelayedBlock>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getBlocks',
      {
        page: selectedPageIndex,
        perPage: TABLE_PAGE_LIMIT
      }
    ],
    genericFetcher<Array<RelayedBlock>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(blocksError);
  const {
    isIdle: totalRelayedBlocksCountIdle,
    isLoading: totalRelayedBlocksCountLoading,
    data: totalRelayedBlocksCount,
    error: totalRelayedBlocksCountError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalRelayedBlocksCount'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalRelayedBlocksCountError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('dashboard.relay.block_height'),
        accessor: 'height',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('dashboard.relay.block_hash'),
        accessor: 'hash',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          const hash = reverseEndiannessHex(stripHexPrefix(value));
          return (
            <ExternalLink href={`${BTC_BLOCK_API}${hash}`}>
              {hash}
            </ExternalLink>
          );
        }
      },
      {
        Header: t('dashboard.relay.timestamp'),
        accessor: 'relayTs',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: number; }) {
          return (
            <>
              {formatDateTimePrecise(new Date(value))}
            </>
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
      data: blocks ?? []
    }
  );

  if (
    blocksIdle ||
    blocksLoading ||
    totalRelayedBlocksCountIdle ||
    totalRelayedBlocksCountLoading
  ) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }
  if (!blocks) {
    throw new Error('Something went wrong!');
  }
  if (!totalRelayedBlocksCount) {
    throw new Error('Something went wrong!');
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const pageCount = Math.ceil(totalRelayedBlocksCount / TABLE_PAGE_LIMIT);

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
      {pageCount > 0 && (
        <div
          className={clsx(
            'flex',
            'justify-end'
          )}>
          <InterlayPagination
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            forcePage={selectedPageIndex} />
        </div>
      )}
    </InterlayTableContainer>
  );
};

export default withErrorBoundary(BlocksTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
