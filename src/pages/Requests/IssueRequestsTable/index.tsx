// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
  FaRegClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Issue,
  IssueStatus
} from '@interlay/interbtc';

import IssueRequestModal from './IssueRequestModal';
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
import InterlayLink from 'components/UI/InterlayLink';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { REQUEST_TABLE_PAGE_LIMIT } from 'utils/constants/general';
import {
  formatDateTimePrecise,
  shortTxId
} from 'common/utils/utils';
import userIssueRequestsFetcher, { USER_ISSUE_REQUESTS_FETCHER } from 'services/user-issue-requests-fetcher';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';

// ray test touch <<
const TOTAL_ISSUE_REQUESTS = 100; // TODO: hardcoded
// ray test touch >>

const IssueRequestsTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const query = useQueryParams();
  const selectedIssueRequestId = query.get(QUERY_PARAMETERS.ISSUE_REQUEST_ID);
  const selectedPage = Number(query.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  const {
    address,
    extensions,
    polkaBtcLoaded
  } = useSelector((state: StoreType) => state.general);
  const {
    isLoading,
    data: issueRequests,
    error
  } = useQuery<Array<Issue>, Error>(
    [
      USER_ISSUE_REQUESTS_FETCHER,
      address,
      selectedPageIndex,
      REQUEST_TABLE_PAGE_LIMIT
    ],
    userIssueRequestsFetcher,
    {
      enabled: !!address && !!polkaBtcLoaded,
      refetchInterval: 10000
    }
  );
  useErrorHandler(error);

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
        accessor: 'creationTimestamp',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: number }) {
          return (
            <>
              {value ? formatDateTimePrecise(new Date(Number(value))) : t('pending')}
            </>
          );
        }
      },
      {
        Header: `${t('issue_page.amount')} (InterBTC)`,
        accessor: 'amountInterBTC',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props: any) {
          return (
            <>
              {(props.row.original.executedAmountBTC && props.row.original.executedAmountBTC !== '0') ?
                props.row.original.executedAmountBTC :
                props.row.original.amountInterBTC
              }
            </>
          );
        }
      },
      {
        Header: t('issue_page.btc_transaction'),
        accessor: 'btcTxId',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props: any) {
          const issueRequest: Issue = props.row.original;
          return (
            <>
              {issueRequest.btcTxId ? (
                <InterlayLink
                  className={clsx(
                    'text-interlayDenim',
                    'space-x-1.5',
                    'inline-flex',
                    'items-center'
                  )}
                  href={`${BTC_TRANSACTION_API}${issueRequest.btcTxId}`}
                  onClick={event => {
                    event.stopPropagation();
                  }}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <span>{shortTxId(issueRequest.btcTxId)}</span>
                  <FaExternalLinkAlt />
                </InterlayLink>
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
        accessor: 'confirmations',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: {value: number}) {
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
        Cell: function FormattedCell({ value }: {value: IssueStatus}) {
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

  const data = issueRequests ?? [];

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

  if (isLoading) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
      </div>
    );
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
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

  const pageCount = Math.ceil(TOTAL_ISSUE_REQUESTS / REQUEST_TABLE_PAGE_LIMIT);
  const selectedIssueRequest = data.find(issueRequest => issueRequest.id === selectedIssueRequestId);

  return (
    <>
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
              'font-bold'
            )}>
            {t('issue_page.issue_requests')}
          </h2>
          <p>
            {t('issue_page.click_on_issue_request')}
          </p>
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
