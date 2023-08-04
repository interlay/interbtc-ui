import { IssueStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';

import { formatDateTimePrecise, formatNumber, shortAddress, shortTxId } from '@/common/utils/utils';
import { BTC_EXPLORER_ADDRESS_API, BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { useIssueRequests } from '@/hooks/issue-requests';
import useQueryParams from '@/hooks/use-query-params';
import useUpdateQueryParameters from '@/hooks/use-update-query-parameters';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ExternalLink from '@/legacy-components/ExternalLink';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import SectionTitle from '@/legacy-components/SectionTitle';
import InterlayPagination from '@/legacy-components/UI/InterlayPagination';
import InterlayTable, {
  InterlayTableContainer,
  InterlayTbody,
  InterlayTd,
  InterlayTh,
  InterlayThead,
  InterlayTr
} from '@/legacy-components/UI/InterlayTable';
import StatusCell from '@/legacy-components/UI/InterlayTable/StatusCell';
import ViewRequestDetailsLink from '@/legacy-components/ViewRequestDetailsLink';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import { issuesCountQuery } from '@/services/queries/issues';
import { TXType } from '@/types/general.d';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';

const IssueRequestsTable = (): JSX.Element => {
  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { t } = useTranslation();

  const columns = React.useMemo(
    () => [
      {
        Header: t('date_created'),
        classNames: ['text-left'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          return <>{formatDateTimePrecise(new Date(issue.request.timestamp))}</>;
        }
      },
      {
        Header: t('last_update'),
        classNames: ['text-left'],
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

          return <>{formatDateTimePrecise(new Date(date))}</>;
        }
      },
      {
        Header: t('view_details'),
        classNames: ['text-left'],
        // TODO: should type properly (`Relay`)
        Cell: ({ row: { original: issue } }: any) => {
          return <ViewRequestDetailsLink id={issue.id} txType={TXType.Issue} />;
        }
      },
      {
        Header: t('issue_page.parachain_block'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let height;
          if (issue.execution) {
            height = issue.execution.height.absolute;
          } else if (issue.cancellation) {
            height = issue.cancellation.height.absolute;
          } else {
            height = issue.request.height.absolute;
          }

          return <>{formatNumber(height)}</>;
        }
      },
      {
        Header: t('issue_page.amount'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let wrappedTokenAmount;
          if (issue.execution) {
            wrappedTokenAmount = issue.execution.amountWrapped;
          } else {
            wrappedTokenAmount = issue.request.amountWrapped;
          }

          return <>{wrappedTokenAmount.toHuman(8)}</>;
        }
      },
      {
        Header: t('user'),
        accessor: 'userParachainAddress',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <AddressWithCopyUI address={value} />;
        }
      },
      {
        Header: t('issue_page.vault_dot_address'),
        accessor: 'vault',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: any }) {
          return <AddressWithCopyUI address={value.accountId} />;
        }
      },
      {
        Header: t('issue_page.vault_btc_address'),
        accessor: 'vaultBackingAddress',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <ExternalLink href={`${BTC_EXPLORER_ADDRESS_API}${value}`}>{shortAddress(value)}</ExternalLink>;
        }
      },
      {
        Header: t('issue_page.btc_transaction'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issueRequest } }: any) {
          return (
            <>
              {issueRequest.backingPayment.btcTxId ? (
                <ExternalLink
                  href={`${BTC_EXPLORER_TRANSACTION_API}${issueRequest.backingPayment.btcTxId}`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {shortTxId(issueRequest.backingPayment.btcTxId)}
                </ExternalLink>
              ) : issueRequest.status === IssueStatus.Expired || issueRequest.status === IssueStatus.Cancelled ? (
                t('redeem_page.failed')
              ) : (
                `${t('pending')}...`
              )}
            </>
          );
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: IssueStatus }) {
          return (
            <StatusCell
              status={{
                completed: value === IssueStatus.Completed,
                cancelled: value === IssueStatus.Cancelled,
                isExpired: value === IssueStatus.Expired,
                reimbursed: false
              }}
            />
          );
        }
      }
    ],
    [t]
  );

  const selectedPageIndex = selectedPage - 1;

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useIssueRequests(
    selectedPageIndex * TABLE_PAGE_LIMIT,
    TABLE_PAGE_LIMIT,
    undefined,
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(issueRequestsError);

  const {
    isIdle: issuesCountIdle,
    isLoading: issuesCountLoading,
    data: issuesCount,
    error: issuesCountError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>([GRAPHQL_FETCHER, issuesCountQuery()], graphqlFetcher<GraphqlReturn<any>>());
  useErrorHandler(issuesCountError);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: issueRequests ?? []
  });

  const renderContent = () => {
    if (issueRequestsIdle || issueRequestsLoading || issuesCountIdle || issuesCountLoading) {
      return <PrimaryColorEllipsisLoader />;
    }
    if (issuesCount === undefined) {
      throw new Error('Something went wrong!');
    }

    const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
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
                    ])}
                  >
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
      </>
    );
  };

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>{t('issue_page.recent_requests')}</SectionTitle>
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
