import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import { useQuery } from 'react-query';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { IssueStatus } from '@interlay/interbtc-api';

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
import {
  shortAddress,
  formatDateTimePrecise,
  displayMonetaryAmount
} from 'common/utils/utils';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import graphqlFetcher, {
  GraphqlReturn,
  GRAPHQL_FETCHER
} from 'services/fetchers/graphql-fetcher';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import issueFetcher, {
  ISSUE_FETCHER,
  getIssueWithStatus
} from 'services/fetchers/issue-request-fetcher';
import issueCountQuery from 'services/queries/issue-count-query';
import { StoreType } from 'common/types/util.types';

const IssueRequestsTable = (): JSX.Element => {
  const queryParams = useQueryParams();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { t } = useTranslation();

  const columns = React.useMemo(
    () => [
      {
        Header: t('date_created'),
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
        Header: t('issue_page.parachain_block'),
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
        Header: t('issue_page.vault_dot_address'),
        accessor: 'vault',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: any; }) {
          return (
            <>
              {shortAddress(value.accountId)}
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

  const {
    isIdle: stableBtcConfirmationsIdle,
    isLoading: stableBtcConfirmationsLoading,
    data: stableBtcConfirmations,
    error: stableBtcConfirmationsError
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
  useErrorHandler(stableBtcConfirmationsError);

  const {
    isIdle: latestActiveBlockIdle,
    isLoading: latestActiveBlockLoading,
    data: latestParachainActiveBlock,
    error: latestActiveBlockError
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
  useErrorHandler(latestActiveBlockError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
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
  useErrorHandler(stableParachainConfirmationsError);

  const selectedPageIndex = selectedPage - 1;

  const {
    isIdle: issuesIdle,
    isLoading: issuesLoading,
    data: issues,
    error: issuesError
  // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      ISSUE_FETCHER,
      selectedPageIndex * TABLE_PAGE_LIMIT, // offset
      TABLE_PAGE_LIMIT, // limit
      stableBtcConfirmations
    ],
    issueFetcher,
    {
      enabled: stableBtcConfirmations !== undefined
    }
  );
  useErrorHandler(issuesError);

  const {
    isIdle: issuesCountIdle,
    isLoading: issuesCountLoading,
    data: issuesCount,
    error: issuesCountError
  // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueCountQuery()
    ],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(issuesCountError);

  const data =
    (
      issues === undefined ||
      stableBtcConfirmations === undefined ||
      stableParachainConfirmations === undefined ||
      latestParachainActiveBlock === undefined
    ) ?
      [] :
      issues.map(
        // TODO: should type properly (`Relay`)
        (issue: any) => getIssueWithStatus(
          issue,
          stableBtcConfirmations,
          stableParachainConfirmations,
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

  const renderContent = () => {
    if (
      stableBtcConfirmationsIdle ||
      stableBtcConfirmationsLoading ||
      stableParachainConfirmationsIdle ||
      stableParachainConfirmationsLoading ||
      latestActiveBlockIdle ||
      latestActiveBlockLoading ||
      issuesIdle ||
      issuesLoading ||
      issuesCountIdle ||
      issuesCountLoading
    ) {
      return <PrimaryColorEllipsisLoader />;
    }
    if (issuesCount === undefined) {
      throw new Error('Something went wrong!');
    }

    const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
      updateQueryParameters({
        [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
      });
    };

    const totalIssueCount = issuesCount.data.issuesConnection.totalCount || 0;
    const pageCount = Math.ceil(totalIssueCount / TABLE_PAGE_LIMIT);

    return (
      <>
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
      </>
    );
  };

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>
        {t('issue_page.recent_requests')}
      </SectionTitle>
      {renderContent()}
    </InterlayTableContainer>
  );
};

export default withErrorBoundary(IssueRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
