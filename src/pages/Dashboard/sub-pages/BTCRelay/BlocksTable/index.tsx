// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
import { stripHexPrefix } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';

import { formatDateTimePrecise } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import ExternalLink from '@/components/ExternalLink';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import InterlayPagination from '@/components/UI/InterlayPagination';
import InterlayTable, {
  InterlayTableContainer,
  InterlayTbody,
  InterlayTd,
  InterlayTh,
  InterlayThead,
  InterlayTr
} from '@/components/UI/InterlayTable';
import { BTC_EXPLORER_BLOCK_API } from '@/config/blockstream-explorer-links';
import SectionTitle from '@/parts/SectionTitle';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import btcBlocksCountQuery from '@/services/queries/btc-blocks-count-query';
import btcBlocksQuery from '@/services/queries/btc-blocks-query';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import useQueryParams from '@/utils/hooks/use-query-params';
import useUpdateQueryParameters from '@/utils/hooks/use-update-query-parameters';

const BlocksTable = (): JSX.Element => {
  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  const {
    isIdle: btcBlocksIdle,
    isLoading: btcBlocksLoading,
    data: btcBlocks,
    error: btcBlocksError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      btcBlocksQuery(),
      {
        limit: TABLE_PAGE_LIMIT,
        offset: selectedPageIndex * TABLE_PAGE_LIMIT
      }
    ],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(btcBlocksError);

  const {
    isIdle: btcBlocksCountIdle,
    isLoading: btcBlocksCountLoading,
    data: btcBlocksCount,
    error: btcBlocksCountError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, btcBlocksCountQuery()],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(btcBlocksCountError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('dashboard.relay.block_height'),
        accessor: 'backingHeight',
        classNames: ['text-right']
      },
      {
        Header: t('dashboard.relay.block_hash'),
        accessor: 'blockHash',
        classNames: ['text-right'],
        Cell: function FormattedCell({ value }: { value: string }) {
          const hash = stripHexPrefix(value);
          return <ExternalLink href={`${BTC_EXPLORER_BLOCK_API}${hash}`}>{hash}</ExternalLink>;
        }
      },
      {
        Header: t('dashboard.relay.inclusion_timestamp'),
        accessor: 'timestamp',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <>{formatDateTimePrecise(new Date(value))}</>;
        }
      },
      {
        Header: t('dashboard.relay.inclusion_block'),
        accessor: 'relayedAtHeight',
        classNames: ['text-right'],
        Cell: function FormattedCell({ value }: { value: any }) {
          return <>{value.absolute}</>;
        }
      },
      {
        Header: t('dashboard.relay.relayed_by'),
        accessor: 'relayer',
        classNames: ['text-right']
      }
    ],
    [t]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: btcBlocks?.data?.relayedBlocks ?? []
  });

  if (btcBlocksIdle || btcBlocksLoading || btcBlocksCountIdle || btcBlocksCountLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (!btcBlocks) {
    throw new Error('Something went wrong!');
  }
  if (!btcBlocksCount) {
    throw new Error('Something went wrong!');
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const pageCount = Math.ceil((btcBlocksCount.data.relayedBlocksConnection.totalCount || 0) / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className={clsx('space-y-6', 'container', 'mx-auto')}>
      <SectionTitle>{t('dashboard.relay.blocks')}</SectionTitle>
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
                  ])}
                >
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
                      ])}
                    >
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
        <div className={clsx('flex', 'justify-end')}>
          <InterlayPagination
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            forcePage={selectedPageIndex}
          />
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
