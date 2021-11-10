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
import { IssueStatus } from '@interlay/interbtc-api';

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
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import issueFetcher, { ISSUE_FETCHER, setIssueStatus } from 'services/fetchers/issue-request-fetcher';
import issueCountQuery from 'services/queries/issueRequestCount';

const IssueRequestsTable = (): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { t } = useTranslation();

  const columns = React.useMemo(
    () => [
      {
        Header: t('date_created'),
        accessor: '',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          const date = issue.request.timestamp;
          return (
            <>
              {formatDateTimePrecise(new Date(date))}
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
          if (issue.execution) height = issue.execution.height.active;
          else if (issue.cancellation) height = issue.cancellation.height.active;
          else height = issue.request.height.active;
          return (
            <>
              {height}
            </>
          );
        }
      },
      {
        Header: t('last_update'),
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
              {formatDateTimePrecise(new Date(date))}
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
          if (issue.execution) value = issue.execution.amountWrapped;
          else value = issue.request.amountWrapped;
          return (
            <>
              {value.toHuman()}
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

  const {
    isIdle: btcConfirmationsIdle,
    isLoading: btcConfirmationsLoading,
    data: stableBtcConfirmations,
    error: btcConfirmationsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getParachainConfirmations'
    ],
    genericFetcher<number>()
  );

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
    genericFetcher<number>()
  );

  const {
    isIdle: parachainConfirmationsIdle,
    isLoading: parachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: parachainConfirmationsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getBtcConfirmations'
    ],
    genericFetcher<number>()
  );

  // TODO: Type graphql returns properly
  const {
    isIdle: issuesIdle,
    isLoading: issuesLoading,
    data: issuesData,
    error: issuesError
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
  const {
    isIdle: issuesCountIdle,
    isLoading: issuesCountLoading,
    data: issuesCountData,
    error: issuesCountError
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueCountQuery
    ],
    graphqlFetcher<any>()
  );
  useErrorHandler(issuesError);
  useErrorHandler(issuesCountError);
  useErrorHandler(btcConfirmationsError);
  useErrorHandler(parachainConfirmationsError);
  useErrorHandler(latestActiveBlockError);

  const anyIdle =
    btcConfirmationsIdle ||
    btcConfirmationsLoading ||
    parachainConfirmationsIdle ||
    parachainConfirmationsLoading ||
    latestActiveBlockLoading ||
    latestActiveBlockIdle ||
    issuesIdle ||
    issuesLoading ||
    issuesCountIdle ||
    issuesCountLoading;

  if (!anyIdle && (
    !issuesData ||
    !issuesCountData ||
    !stableBtcConfirmations ||
    !stableParachainConfirmations ||
    !latestParachainActiveBlock
  )) {
    throw new Error('Something went wrong!');
  }

  const totalIssueCount = issuesCountData?.data?.issuesConnection?.totalCount;
  const issues = anyIdle ? [] : issuesData.map(
    (issue: any) => setIssueStatus(
      issue,
      // anyIdle = false, therefore stableBtcConfirmations !== undefined
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stableBtcConfirmations!, stableParachainConfirmations!, latestParachainActiveBlock!
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
