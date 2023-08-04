import { IssueStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaRegClock, FaRegTimesCircle } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';

import { formatDateTimePrecise, formatNumber, shortTxId } from '@/common/utils/utils';
import { BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useIssueRequests } from '@/hooks/issue-requests';
import useQueryParams from '@/hooks/use-query-params';
import useUpdateQueryParameters from '@/hooks/use-update-query-parameters';
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
import { useSubstrateSecureState } from '@/lib/substrate';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import { issuesCountQuery } from '@/services/queries/issues';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

import IssueRequestModal from './IssueRequestModal';

const IssueRequestsTable = (): JSX.Element => {
  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const selectedIssueRequestId = queryParams.get(QUERY_PARAMETERS.ISSUE_REQUEST_ID);
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.ISSUE_REQUESTS_PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  const { extensions, selectedAccount } = useSubstrateSecureState();

  const {
    isIdle: issueRequestsTotalCountIdle,
    isLoading: issueRequestsTotalCountLoading,
    data: issueRequestsTotalCount,
    error: issueRequestsTotalCountError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, issuesCountQuery(`userParachainAddress_eq: "${selectedAccount?.address ?? ''}"`)],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(issueRequestsTotalCountError);

  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequests,
    error: issueRequestsError
  } = useIssueRequests(
    selectedPageIndex * TABLE_PAGE_LIMIT,
    TABLE_PAGE_LIMIT,
    `userParachainAddress_eq: "${selectedAccount?.address ?? ''}"`,
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(issueRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
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
        Header: `${t('issue_page.amount')} (${WRAPPED_TOKEN_SYMBOL})`,
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
        Header: t('issue_page.confirmations'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          const value = issue.backingPayment.confirmations;
          return <>{value === undefined ? t('not_applicable') : formatNumber(Math.max(value, 0))}</>;
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: IssueStatus }) {
          let icon;
          let notice;
          let colorClassName;
          switch (value) {
            case IssueStatus.RequestedRefund:
            case IssueStatus.Completed: {
              icon = <FaCheck />;
              notice = t('completed');
              colorClassName = getColorShade('green');
              break;
            }
            case IssueStatus.Cancelled:
            case IssueStatus.Expired: {
              icon = <FaRegTimesCircle />;
              notice = t('cancelled');
              colorClassName = getColorShade('red');
              break;
            }
            default: {
              icon = <FaRegClock />;
              notice = t('pending');
              colorClassName = getColorShade('yellow');
              break;
            }
          }

          // TODO: double-check with `src\components\UI\InterlayTable\StatusCell\index.tsx`
          return (
            <div className={clsx('inline-flex', 'items-center', 'space-x-1.5', colorClassName)}>
              {icon}
              <span>{notice}</span>
            </div>
          );
        }
      }
    ],
    [t]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: issueRequests ?? []
  });

  if (issueRequestsTotalCountIdle || issueRequestsTotalCountLoading || issueRequestsIdle || issueRequestsLoading) {
    return <PrimaryColorEllipsisLoader />;
  }
  if (issueRequestsTotalCount === undefined) {
    throw new Error('Something went wrong!');
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.ISSUE_REQUESTS_PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const handleIssueModalClose = () => {
    updateQueryParameters({
      [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: ''
    });
  };

  const handleRowClick = (requestId: string) => () => {
    if (extensions.length && selectedAccount) {
      updateQueryParameters({
        [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: requestId
      });
    }
  };

  const totalSuccessfulIssueCount = issueRequestsTotalCount.data.issuesConnection.totalCount || 0;
  const pageCount = Math.ceil(totalSuccessfulIssueCount / TABLE_PAGE_LIMIT);
  // TODO: should type properly (`Relay`)
  const selectedIssueRequest = issueRequests?.find((issueRequest: any) => issueRequest.id === selectedIssueRequestId);

  return (
    <>
      <InterlayTableContainer className={clsx('space-y-6', 'container', 'mx-auto')}>
        <SectionTitle>{t('issue_page.issue_requests')}</SectionTitle>
        {issueRequests?.length ? (
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

                const { className: rowClassName, ...restRowProps } = row.getRowProps();

                return (
                  // eslint-disable-next-line react/jsx-key
                  <InterlayTr
                    className={clsx(rowClassName, 'cursor-pointer')}
                    {...restRowProps}
                    onClick={handleRowClick(row.original.id)}
                  >
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
        ) : (
          <p>{t('empty_data')}</p>
        )}
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
      {selectedIssueRequest && (
        <IssueRequestModal
          open={!!selectedIssueRequest}
          onClose={handleIssueModalClose}
          request={selectedIssueRequest}
        />
      )}
    </>
  );
};

export default withErrorBoundary(IssueRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
