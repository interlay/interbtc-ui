import { IssueStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';

import { displayMonetaryAmount, formatDateTimePrecise, shortAddress, shortTxId } from '@/common/utils/utils';
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
import StatusCell from '@/components/UI/InterlayTable/StatusCell';
import { BTC_EXPLORER_ADDRESS_API, BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import SectionTitle from '@/parts/SectionTitle';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import issuesFetcher, { getIssueWithStatus, ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from '@/services/hooks/use-stable-bitcoin-confirmations';
import useStableParachainConfirmations from '@/services/hooks/use-stable-parachain-confirmations';
import issueCountQuery from '@/services/queries/issue-count-query';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import useQueryParams from '@/utils/hooks/use-query-params';
import useUpdateQueryParameters from '@/utils/hooks/use-update-query-parameters';

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

          return <>{height}</>;
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

          return <>{displayMonetaryAmount(wrappedTokenAmount)}</>;
        }
      },
      {
        Header: t('user'),
        accessor: 'userParachainAddress',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <>{value}</>;
        }
      },
      {
        Header: t('issue_page.vault_dot_address'),
        accessor: 'vault',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: any }) {
          return <>{shortAddress(value.accountId)}</>;
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

  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations,
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations();
  useErrorHandler(stableBitcoinConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations,
    error: stableParachainConfirmationsError
  } = useStableParachainConfirmations();
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
      ISSUES_FETCHER,
      selectedPageIndex * TABLE_PAGE_LIMIT, // offset
      TABLE_PAGE_LIMIT // limit
    ],
    issuesFetcher
  );
  useErrorHandler(issuesError);

  const {
    isIdle: issuesCountIdle,
    isLoading: issuesCountLoading,
    data: issuesCount,
    error: issuesCountError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>([GRAPHQL_FETCHER, issueCountQuery()], graphqlFetcher<GraphqlReturn<any>>());
  useErrorHandler(issuesCountError);

  const data =
    issues === undefined ||
    stableBitcoinConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    currentActiveBlockNumber === undefined
      ? []
      : issues.map(
          // TODO: should type properly (`Relay`)
          (issue: any) =>
            getIssueWithStatus(
              issue,
              stableBitcoinConfirmations,
              stableParachainConfirmations,
              currentActiveBlockNumber
            )
        );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  const renderContent = () => {
    if (
      stableBitcoinConfirmationsIdle ||
      stableBitcoinConfirmationsLoading ||
      stableParachainConfirmationsIdle ||
      stableParachainConfirmationsLoading ||
      currentActiveBlockNumberIdle ||
      currentActiveBlockNumberLoading ||
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
