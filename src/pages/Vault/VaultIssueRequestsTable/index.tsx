// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// /@ts-nocheck
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
  IssueStatus
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
import { BTC_ADDRESS_API } from 'config/bitcoin';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import issueCountQuery from 'services/queries/issue-count-query';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import {
  shortAddress,
  formatDateTimePrecise,
  displayMonetaryAmount
} from 'common/utils/utils';
import issueFetcher, { getIssueWithStatus, ISSUE_FETCHER } from 'services/fetchers/issue-request-fetcher';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  vaultAddress: string;
}

const VaultIssueRequestsTable = ({
  vaultAddress
}: Props): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: btcConfirmationsIdle,
    isLoading: btcConfirmationsLoading,
    data: btcConfirmations,
    error: btcConfirmationsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getBtcConfirmations'
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
      'interBtcIndex',
      'latestParachainActiveBlock'
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
      'interBtcIndex',
      'getParachainConfirmations'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(parachainConfirmationsError);

  const {
    isIdle: issueRequestsTotalCountIdle,
    isLoading: issueRequestsTotalCountLoading,
    data: issueRequestsTotalCount,
    error: issueRequestsTotalCountError
  // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueCountQuery(`vault: {accountId_eq: "${vaultAddress}"}`)
    ],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(issueRequestsTotalCountError);

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      ISSUE_FETCHER,
      selectedPageIndex * TABLE_PAGE_LIMIT, // offset
      TABLE_PAGE_LIMIT, // limit
      btcConfirmations,
      `vault: {accountId_eq: "${vaultAddress}"}` // `WHERE` condition
    ],
    issueFetcher,
    {
      enabled: btcConfirmations !== undefined
    }
  );
  useErrorHandler(issueRequestsError);

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
        accessor: 'request',
        classNames: [
          'text-left'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          return (
            <>
              {formatDateTimePrecise(new Date(issue.request.timestamp))}
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
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          return (
            <>
              {issue.request.height.active}
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
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let date;
          if (issue.execution) {
            date = issue.execution.timestamp;
          } else if (issue.cancellation) {
            date = issue.cancellation.timestamp;
          } else {
            date = issue.request.timestamp;
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
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let wrappedTokenAmount;
          if (issue.execution) {
            wrappedTokenAmount = issue.execution.amountWrapped;
          } else {
            wrappedTokenAmount = issue.request.amountWrapped;
          }

          return (
            <>
              {displayMonetaryAmount(wrappedTokenAmount)}
            </>
          );
        }
      },
      {
        Header: t('griefing_collateral'),
        accessor: 'griefingCollateral',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: { value: any; }) {
          return (
            <>
              {displayMonetaryAmount(value)}
            </>
          );
        }
      },
      {
        Header: t('issue_page.vault_btc_address'),
        accessor: 'vaultBackingAddress',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <ExternalLink href={`${BTC_ADDRESS_API}${value}`}>
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
        Cell: function FormattedCell({ value }: { value: IssueStatus; }) {
          return (
            <StatusCell
              status={{
                completed: value === IssueStatus.Completed,
                cancelled: value === IssueStatus.Cancelled,
                isExpired: value === IssueStatus.Expired,
                reimbursed: false
              }} />
          );
        }
      }
    ],
    [t]
  );

  const data =
    (
      issueRequests === undefined ||
      btcConfirmations === undefined ||
      parachainConfirmations === undefined ||
      latestParachainActiveBlock === undefined
    ) ?
      [] :
      issueRequests.map(
        // TODO: should type properly (`Relay`)
        (issueRequest: any) => getIssueWithStatus(
          issueRequest,
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
    issueRequestsTotalCountIdle ||
    issueRequestsTotalCountLoading ||
    issueRequestsIdle ||
    issueRequestsLoading
  ) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }
  if (issueRequestsTotalCount === undefined) {
    throw new Error('Something went wrong!');
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const totalSuccessfulIssueCount = issueRequestsTotalCount.data.issuesConnection.totalCount || 0;
  const pageCount = Math.ceil(totalSuccessfulIssueCount / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>
        {t('issue_requests')}
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

export default withErrorBoundary(VaultIssueRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
