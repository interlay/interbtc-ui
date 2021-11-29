import * as React from 'react';
import { useTable } from 'react-table';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import {
  FaCheck,
  FaRegTimesCircle,
  FaRegClock
} from 'react-icons/fa';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  IssueStatus
} from '@interlay/interbtc-api';

import IssueRequestModal from './IssueRequestModal';
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
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import {
  formatDateTimePrecise,
  shortTxId,
  displayMonetaryAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import issueCountQuery from 'services/queries/issueRequestCount';
import issueFetcher, { ISSUE_FETCHER, setIssueStatus } from 'services/fetchers/issue-request-fetcher';

const IssueRequestsTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const selectedIssueRequestId = queryParams.get(QUERY_PARAMETERS.ISSUE_REQUEST_ID);
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.ISSUE_REQUESTS_PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  const {
    address,
    extensions,
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: btcConfirmationsIdle,
    isLoading: btcConfirmationsLoading,
    data: stableBtcConfirmations,
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
    isIdle: parachainConfirmationsIdle,
    isLoading: parachainConfirmationsLoading,
    data: stableParachainConfirmations,
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
    data: issueRequestsTotalCountData,
    error: issueRequestsTotalCountError
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueCountQuery(`userParachainAddress_eq: "${address}"`)
    ],
    graphqlFetcher<any>()
  );
  useErrorHandler(issueRequestsTotalCountError);
  const {
    isIdle: issueRequestsIdle,
    isLoading: issueRequestsLoading,
    data: issueRequestsData,
    error: issueRequestsError
  } = useQuery<any, Error>(
    [
      ISSUE_FETCHER,
      selectedPageIndex * TABLE_PAGE_LIMIT, // offset
      TABLE_PAGE_LIMIT, // limit
      stableBtcConfirmations,
      `userParachainAddress_eq: "${address}"` // WHERE condition
    ],
    issueFetcher,
    {
      enabled: stableBtcConfirmations !== undefined
    }
  );
  useErrorHandler(issueRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
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
        Header: `${t('issue_page.amount')} (${WRAPPED_TOKEN_SYMBOL})`,
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let value;
          if (issue.execution) value = issue.execution.amountWrapped;
          else value = issue.request.amountWrapped;
          return (
            <>
              {displayMonetaryAmount(value)}
            </>
          );
        }
      },
      {
        Header: t('issue_page.btc_transaction'),
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props: any) {
          const issueRequest: any = props.row.original;
          return (
            <>
              {issueRequest.backingPayment.btcTxId ? (
                <ExternalLink
                  href={`${BTC_TRANSACTION_API}${issueRequest.backingPayment.btcTxId}`}
                  onClick={event => {
                    event.stopPropagation();
                  }}>
                  {shortTxId(issueRequest.backingPayment.btcTxId)}
                </ExternalLink>
              ) : (
                (
                  issueRequest.status === IssueStatus.Expired ||
                  issueRequest.status === IssueStatus.Cancelled
                ) ? (
                    t('redeem_page.failed')
                  ) : (
                    `${t('pending')}...`
                  )
              )}
            </>
          );
        }
      },
      {
        Header: t('issue_page.confirmations'),
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          const value = issue.backingPayment.confirmations;
          return (
            <>
              {value === undefined ?
                t('not_applicable') :
                Math.max(value, 0)}
            </>
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
          let icon;
          let notice;
          let colorClassName;
          switch (value) {
          case IssueStatus.RequestedRefund:
          case IssueStatus.Completed: {
            icon = <FaCheck />;
            notice = t('completed');
            colorClassName = 'text-interlayConifer';
            break;
          }
          case IssueStatus.Cancelled:
          case IssueStatus.Expired: {
            icon = <FaRegTimesCircle />;
            notice = t('cancelled');
            colorClassName = 'text-interlayCinnabar';
            break;
          }
          default: {
            icon = <FaRegClock />;
            notice = t('pending');
            colorClassName = 'text-interlayCalifornia';
            break;
          }
          }

          // TODO: double-check with `src\components\UI\InterlayTable\StatusCell\index.tsx`
          return (
            <div
              className={clsx(
                'inline-flex',
                'items-center',
                'space-x-1.5',
                colorClassName
              )}>
              {icon}
              <span>
                {notice}
              </span>
            </div>
          );
        }
      }
    ],
    [t]
  );

  const anyIdle =
    btcConfirmationsIdle ||
    btcConfirmationsLoading ||
    parachainConfirmationsIdle ||
    parachainConfirmationsLoading ||
    latestActiveBlockLoading ||
    latestActiveBlockIdle ||
    issueRequestsTotalCountIdle ||
    issueRequestsTotalCountLoading ||
    issueRequestsIdle ||
    issueRequestsLoading;

  if (!anyIdle && (
    issueRequestsData === undefined ||
    issueRequestsTotalCountData === undefined ||
    stableBtcConfirmations === undefined ||
    stableParachainConfirmations === undefined ||
    latestParachainActiveBlock === undefined
  )) {
    throw new Error('Something went wrong!');
  }

  const issues = anyIdle ? [] : issueRequestsData.map(
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

  if (anyIdle) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
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
    if (extensions.length && address) {
      updateQueryParameters({
        [QUERY_PARAMETERS.ISSUE_REQUEST_ID]: requestId
      });
    } else {
      dispatch(showAccountModalAction(true));
    }
  };

  const totalIssueCount = issueRequestsTotalCountData?.data?.issuesConnection?.totalCount || 0;
  const pageCount = Math.ceil(totalIssueCount / TABLE_PAGE_LIMIT);
  const selectedIssueRequest = issues.find((issueRequest: any) => issueRequest.id === selectedIssueRequestId);

  return (
    <>
      <InterlayTableContainer
        className={clsx(
          'space-y-6',
          'container',
          'mx-auto'
        )}>
        <h2
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          {t('issue_page.issue_requests')}
        </h2>
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

              const {
                className: rowClassName,
                ...restRowProps
              } = row.getRowProps();

              return (
                // eslint-disable-next-line react/jsx-key
                <InterlayTr
                  className={clsx(
                    rowClassName,
                    'cursor-pointer'
                  )}
                  {...restRowProps}
                  onClick={handleRowClick(row.original.id)}>
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
      {selectedIssueRequest && (
        <IssueRequestModal
          open={!!selectedIssueRequest}
          onClose={handleIssueModalClose}
          request={selectedIssueRequest} />
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
