// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import {
  IssueStatus
} from '@interlay/interbtc-api';

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorFallback from 'components/ErrorFallback';
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
import InterlayLink from 'components/UI/InterlayLink';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import {
  shortAddress,
  formatDateTimePrecise
} from 'common/utils/utils';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import { BTC_ADDRESS_API } from 'config/bitcoin';
import issueRequestsQuery from 'services/queries/issueRequests';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';

const IssueRequestsTable = (): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { t } = useTranslation();

  const columns = React.useMemo(
    () => [
      {
        Header: t('date'),
        accessor: '',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let date;
          if (issue.execution) date = issue.execution.timestamp;
          else if (issue.cancellation) date = issue.cancellation.timestamp;
          else date = issue.request.timestamp;
          return (
            <>
              {formatDateTimePrecise(new Date(Number(date)))}
            </>
          );
        }
      },
      {
        Header: t('issue_page.amount'),
        accessor: '',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let value;
          if (issue.execution) value = issue.execution.executedAmountWrapped;
          else value = issue.request.requestedAmountWrapped;
          return (
            <>
              {value.toHuman()}
            </>
          );
        }
      },
      {
        Header: t('issue_page.parachain_block'),
        accessor: '',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let height;
          if (issue.execution) height = issue.execution.height.absolute;
          else if (issue.cancellation) height = issue.cancellation.height.absolute;
          else height = issue.request.height.absolute;
          return (
            <>
              {height}
            </>
          );
        }
      },
      {
        Header: t('issue_page.vault_dot_address'),
        accessor: 'vaultParachainAddress',
        classNames: [
          'text-left'
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
        Header: t('issue_page.vault_btc_address'),
        accessor: 'vaultBackingAddress',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <InterlayLink
              className={clsx(
                'text-interlayDenim',
                'space-x-1.5',
                'inline-flex',
                'items-center'
              )}
              href={`${BTC_ADDRESS_API}${value}`}
              target='_blank'
              rel='noopener noreferrer'>
              <span>{shortAddress(value)}</span>
              <FaExternalLinkAlt />
            </InterlayLink>
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

  const selectedPageIndex = selectedPage - 1;

  // TODO: Type graphql returns properly
  const {
    isIdle: issuesIdle,
    isLoading: issuesLoading,
    data: issuesData,
    error: issuesError
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueRequestsQuery,
      {
        limit: TABLE_PAGE_LIMIT,
        offset: selectedPageIndex * TABLE_PAGE_LIMIT
      }
    ],
    graphqlFetcher<any>()
  );
  const {
    isIdle: issuesCountIdle,
    isLoading: issuesCountLoading,
    data: issuesCountData,
    error: issuesCountError
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      `{
        issuesConnection {
          totalCount
        }
      }`
    ],
    graphqlFetcher<any>()
  );
  useErrorHandler(issuesError);
  useErrorHandler(issuesCountError);

  const anyIdle = issuesIdle || issuesLoading || issuesCountIdle || issuesCountLoading;
  if (!anyIdle && (!issuesData || !issuesCountData)) {
    throw new Error('Something went wrong!');
  }

  const totalIssueCount = issuesCountData?.data?.issuesConnection?.totalCount;
  const rawIssues = issuesData?.data?.issues || [];
  const issues = rawIssues.map(processIssueAmounts);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: issues
    }
  );

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const pageCount = Math.ceil(totalIssueCount / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className='space-y-6'>
      <h2
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {t('issue_page.recent_requests')}
      </h2>
      {anyIdle && (
        <div
          className={clsx(
            'flex',
            'justify-center'
          )}>
          <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
        </div>
      )}
      {!anyIdle && (
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
      )}
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

export default withErrorBoundary(IssueRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
