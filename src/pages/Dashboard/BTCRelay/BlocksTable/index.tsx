
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
// ray test touch <
// import { useSelector } from 'react-redux';
// import { useQuery } from 'react-query';
import {
  // useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
// ray test touch >
import { useTable } from 'react-table';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  reverseEndiannessHex,
  stripHexPrefix
} from '@interlay/interbtc-api';

import ErrorFallback from 'components/ErrorFallback';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import InterlayPagination from 'components/UI/InterlayPagination';
import InterlayLink from 'components/UI/InterlayLink';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import useQueryParams from 'utils/hooks/use-query-params';
import { BTC_BLOCK_API } from 'config/bitcoin';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
// ray test touch <
// import genericFetcher, {
//   GENERIC_FETCHER
// } from 'services/fetchers/generic-fetcher';
// ray test touch >
import { formatDateTimePrecise } from 'common/utils/utils';
import {
  // ray test touch <
  // StoreType,
  // ray test touch >
  RelayedBlock
} from 'common/types/util.types';

const BlocksTable = (): JSX.Element => {
  const { t } = useTranslation();

  // ray test touch <
  // const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  // console.log('ray : ***** window?.bridge?.index => ', window?.bridge?.index);
  // ray test touch >
  const [blocks, setBlocks] = React.useState<Array<RelayedBlock>>();
  const [totalRelayedBlocks, setTotalRelayedBlocks] = React.useState(0);
  const statsApi = useInterbtcIndex();

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  // ray test touch <
  // const {
  //   isLoading: blocksLoading,
  //   data: blocks,
  //   error: blocksError
  // } = useQuery<Big, Error>(
  //   [
  //     GENERIC_FETCHER,
  //     'index',
  //     'getBlocks',
  //     {
  //       page: selectedPageIndex,
  //       perPage: TABLE_PAGE_LIMIT
  //     }
  //   ],
  //   genericFetcher<Big>(),
  //   {
  //     enabled: !!bridgeLoaded
  //   }
  // );
  // useErrorHandler(blocksError);
  // const {
  //   isLoading: totalRelayedBlocksCountLoading,
  //   data: totalRelayedBlocksCount,
  //   error: totalRelayedBlocksCountError
  // } = useQuery<Big, Error>(
  //   [
  //     GENERIC_FETCHER,
  //     'index',
  //     'getTotalRelayedBlocksCount'
  //   ],
  //   genericFetcher<Big>(),
  //   {
  //     enabled: !!bridgeLoaded
  //   }
  // );
  // useErrorHandler(totalRelayedBlocksCountError);
  // ray test touch >

  React.useEffect(() => {
    if (selectedPageIndex === undefined) return;
    if (!statsApi) return;

    (async () => {
      try {
        const [
          theBlocks,
          theTotalRelayedBlocksCount
        ] = await Promise.all([
          statsApi.getBlocks({
            page: selectedPageIndex,
            perPage: TABLE_PAGE_LIMIT
          }),
          statsApi.getTotalRelayedBlocksCount()
        ]);
        setBlocks(theBlocks);
        setTotalRelayedBlocks(Number(theTotalRelayedBlocksCount));
      } catch (error) {
        console.log('[BlocksTable] error.message => ', error.message);
      }
    })();
  }, [
    selectedPageIndex,
    statsApi
  ]);

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
        Cell: function FormattedCell({ value }: { value: number; }) {
          const hash = reverseEndiannessHex(stripHexPrefix(value));
          return (
            <InterlayLink
              className={clsx(
                'text-interlayDenim',
                'space-x-1.5',
                'inline-flex',
                'items-center'
              )}
              href={`${BTC_BLOCK_API}${hash}`}
              target='_blank'
              rel='noopener noreferrer'>
              <span>{hash}</span>
              <FaExternalLinkAlt />
            </InterlayLink>
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

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const pageCount = Math.ceil(totalRelayedBlocks / TABLE_PAGE_LIMIT);

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
