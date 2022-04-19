// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import {
  RedeemStatus
} from '@interlay/interbtc-api';

import SectionTitle from 'parts/SectionTitle';
import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import ErrorFallback from 'components/ErrorFallback';
import ExternalLink from 'components/ExternalLink';
import InterlayPagination from 'components/UI/InterlayPagination';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import StatusCell from 'components/UI/InterlayTable/StatusCell';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import {
  shortAddress,
  formatDateTimePrecise,
  displayMonetaryAmount
} from 'common/utils/utils';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import { BTC_EXPLORER_ADDRESS_API } from 'config/blockstream-explorer-links';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
import redeemCountQuery from 'services/queries/redeem-count-query';
import redeemFetcher, { getRedeemWithStatus, REDEEM_FETCHER } from 'services/fetchers/redeem-request-fetcher';

interface Props {
  vaultAddress: string;
}

const VaultRedeemRequestsTable = ({
  vaultAddress
}: Props): JSX.Element | null => {
  const queryParams = useQueryParams();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { t } = useTranslation();

  const {
    isIdle: btcConfirmationsIdle,
    isLoading: btcConfirmationsLoading,
    data: btcConfirmations,
    error: btcConfirmationsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'btcRelay',
      'getStableBitcoinConfirmations'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcConfirmationsError);

  const {
    isIdle: latestParachainActiveBlockIdle,
    isLoading: latestParachainActiveBlockLoading,
    data: latestParachainActiveBlock,
    error: latestParachainActiveBlockError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'system',
      'getCurrentActiveBlockNumber'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(latestParachainActiveBlockError);

  const {
    isIdle: parachainConfirmationsIdle,
    isLoading: parachainConfirmationsLoading,
    data: parachainConfirmations,
    error: parachainConfirmationsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'btcRelay',
      'getStableParachainConfirmations'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(parachainConfirmationsError);

  const {
    isIdle: redeemRequestsTotalCountIdle,
    isLoading: redeemRequestsTotalCountLoading,
    data: redeemRequestsTotalCount,
    error: redeemRequestsTotalCountError
  // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      redeemCountQuery(`vault: {accountId_eq: "${vaultAddress}"}`)
    ],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(redeemRequestsTotalCountError);

  const {
    isIdle: redeemRequestsIdle,
    isLoading: redeemRequestsLoading,
    data: redeemRequests,
    error: redeemRequestsError
  // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      REDEEM_FETCHER,
      selectedPageIndex * TABLE_PAGE_LIMIT, // offset
      TABLE_PAGE_LIMIT, // limit
      `vault: {accountId_eq: "${vaultAddress}"}` // `WHERE` condition
    ],
    redeemFetcher
  );
  useErrorHandler(redeemRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('id'),
        accessor: 'id',
        classNames: [
          'text-center'
        ]
      },
      {
        Header: t('date_created'),
        classNames: [
          'text-left'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          return (
            <>
              {formatDateTimePrecise(new Date(redeem.request.timestamp))}
            </>
          );
        }
      },
      {
        Header: t('vault.creation_block'),
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          return (
            <>
              {redeem.request.height.active}
            </>
          );
        }
      },
      {
        Header: t('last_update'),
        classNames: [
          'text-left'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          let date;
          if (redeem.execution) {
            date = redeem.execution.timestamp;
          } else if (redeem.cancellation) {
            date = redeem.cancellation.timestamp;
          } else {
            date = redeem.request.timestamp;
          }

          return (
            <>
              {formatDateTimePrecise(new Date(date))}
            </>
          );
        }
      },
      {
        Header: t('last_update_block'),
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let height;
          if (issue.execution) {
            height = issue.execution.height.active;
          } else if (issue.cancellation) {
            height = issue.cancellation.height.active;
          } else {
            height = issue.request.height.active;
          }

          return (
            <>
              {height}
            </>
          );
        }
      },
      {
        Header: t('user'),
        accessor: 'userParachainAddress',
        classNames: [
          'text-center'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <>
              {shortAddress(value)}
            </>
          );
        }
      },
      {
        Header: t('issue_page.amount'),
        accessor: 'amountBTC',
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          return (
            <>
              {displayMonetaryAmount(redeem.request.requestedAmountBacking)}
            </>
          );
        }
      },
      {
        Header: t('redeem_page.btc_destination_address'),
        accessor: 'userBackingAddress',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <ExternalLink href={`${BTC_EXPLORER_ADDRESS_API}${value}`}>
              {shortAddress(value)}
            </ExternalLink>
          );
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: RedeemStatus; }) {
          return (
            <StatusCell
              status={{
                completed: value === RedeemStatus.Completed,
                cancelled: value === RedeemStatus.Retried,
                isExpired: value === RedeemStatus.Expired,
                reimbursed: value === RedeemStatus.Reimbursed
              }} />
          );
        }
      }
    ],
    [t]
  );

  const data =
    (
      redeemRequests === undefined ||
      btcConfirmations === undefined ||
      parachainConfirmations === undefined ||
      latestParachainActiveBlock === undefined
    ) ?
      [] :
      redeemRequests.map(
        // TODO: should type properly (`Relay`)
        (redeemRequest: any) => getRedeemWithStatus(
          redeemRequest,
          btcConfirmations,
          parachainConfirmations,
          latestParachainActiveBlock
        )
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
      data
    }
  );

  if (
    btcConfirmationsIdle ||
    btcConfirmationsLoading ||
    parachainConfirmationsIdle ||
    parachainConfirmationsLoading ||
    latestParachainActiveBlockIdle ||
    latestParachainActiveBlockLoading ||
    redeemRequestsTotalCountIdle ||
    redeemRequestsTotalCountLoading ||
    redeemRequestsIdle ||
    redeemRequestsLoading
  ) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }
  if (redeemRequestsTotalCount === undefined) {
    throw new Error('Something went wrong!');
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const totalSuccessfulRedeemCount = redeemRequestsTotalCount.data.redeemsConnection.totalCount || 0;
  const pageCount = Math.ceil(totalSuccessfulRedeemCount / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>
        {t('redeem_requests')}
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

export default withErrorBoundary(VaultRedeemRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
