
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
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Redeem,
  RedeemStatus
} from '@interlay/interbtc-api';

import RedeemRequestModal from './RedeemRequestModal';
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
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import {
  shortTxId,
  formatDateTimePrecise,
  displayMonetaryAmount
} from 'common/utils/utils';
import userRedeemRequestsFetcher, { USER_REDEEM_REQUESTS_FETCHER } from 'services/user-redeem-requests-fetcher';
import userRedeemRequestsTotalCountFetcher, {
  USER_REDEEM_REQUESTS_TOTAL_COUNT_FETCHER
} from 'services/user-redeem-requests-total-count-fetcher';
import { StoreType } from 'common/types/util.types';

const RedeemRequestsTable = (): JSX.Element => {
  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const selectedRedeemRequestId = queryParams.get(QUERY_PARAMETERS.REDEEM_REQUEST_ID);
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.REDEEM_REQUESTS_PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();

  const {
    address,
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);
  const {
    isIdle: redeemRequestsTotalCountIdle,
    isLoading: redeemRequestsTotalCountLoading,
    data: redeemRequestsTotalCount,
    error: redeemRequestsTotalCountError
  } = useQuery<number, Error>(
    [
      USER_REDEEM_REQUESTS_TOTAL_COUNT_FETCHER,
      address
    ],
    userRedeemRequestsTotalCountFetcher,
    {
      enabled: !!address && !!bridgeLoaded,
      refetchInterval: 10000
    }
  );
  useErrorHandler(redeemRequestsTotalCountError);
  const {
    isIdle: redeemRequestsIdle,
    isLoading: redeemRequestsLoading,
    data: redeemRequests,
    error: redeemRequestsError
  } = useQuery<Array<Redeem>, Error>(
    [
      USER_REDEEM_REQUESTS_FETCHER,
      address,
      selectedPageIndex,
      TABLE_PAGE_LIMIT
    ],
    userRedeemRequestsFetcher,
    {
      enabled: !!address && !!bridgeLoaded,
      refetchInterval: 10000
    }
  );
  useErrorHandler(redeemRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
        accessor: 'creationTimestamp',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: number; }) {
          return (
            <>
              {value ? formatDateTimePrecise(new Date(Number(value))) : t('pending')}
            </>
          );
        }
      },
      {
        Header: `${t('redeem_page.amount')} (interBTC)`,
        accessor: 'amountBTC',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell(props: any) {
          const redeemRequest: Redeem = props.row.original;
          const redeemedWrappedTokenAmount =
            redeemRequest.amountBTC.add(redeemRequest.bridgeFee).add(redeemRequest.btcTransferFee);

          return (
            <>{displayMonetaryAmount(redeemedWrappedTokenAmount)}</>
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
          const redeemRequest: Redeem = props.row.original;
          return (
            <>
              {
                (
                  redeemRequest.status === RedeemStatus.Expired ||
                  redeemRequest.status === RedeemStatus.Retried ||
                  redeemRequest.status === RedeemStatus.Reimbursed
                ) ? (
                    t('redeem_page.failed')
                  ) : (
                    <>
                      {/* TODO: could componentize */}
                      {redeemRequest.btcTxId ? (
                        <InterlayLink
                          className={clsx(
                            'text-interlayDenim',
                            'space-x-1.5',
                            'inline-flex',
                            'items-center'
                          )}
                          href={`${BTC_TRANSACTION_API}${redeemRequest.btcTxId}`}
                          onClick={event => {
                            event.stopPropagation();
                          }}
                          target='_blank'
                          rel='noopener noreferrer'>
                          <span>{shortTxId(redeemRequest.btcTxId)}</span>
                          <FaExternalLinkAlt />
                        </InterlayLink>
                      ) : (
                        `${t('pending')}...`
                      )}
                    </>
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
        Cell: function FormattedCell({ value }: { value: number; }) {
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
        Cell: function FormattedCell({ value }: { value: RedeemStatus; }) {
          let icon;
          let notice;
          let colorClassName;
          switch (value) {
          case RedeemStatus.Reimbursed: {
            icon = <FaCheck />; // TODO: should update according to the design
            notice = t('redeem_page.reimbursed');
            colorClassName = 'text-interlayConifer'; // TODO: should update according to the design
            break;
          }
          case RedeemStatus.Expired: {
            icon = <FaRegTimesCircle />;
            notice = t('redeem_page.recover');
            colorClassName = 'text-interlayCinnabar';
            break;
          }
          case RedeemStatus.Retried: {
            icon = <FaCheck />;
            notice = t('redeem_page.retried');
            colorClassName = 'text-interlayConifer';
            break;
          }
          case RedeemStatus.Completed: {
            icon = <FaCheck />;
            notice = t('completed');
            colorClassName = 'text-interlayConifer';
            break;
          }
          default: {
            icon = <FaRegClock />;
            notice = t('pending');
            colorClassName = 'text-interlayCalifornia';
            break;
          }
          }

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

  const data = redeemRequests ?? [];

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
    redeemRequestsIdle ||
    redeemRequestsLoading ||
    redeemRequestsTotalCountIdle ||
    redeemRequestsTotalCountLoading
  ) {
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
      [QUERY_PARAMETERS.REDEEM_REQUESTS_PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const handleRedeemModalClose = () => {
    updateQueryParameters({
      [QUERY_PARAMETERS.REDEEM_REQUEST_ID]: ''
    });
  };

  const handleRowClick = (requestId: string) => () => {
    updateQueryParameters({
      [QUERY_PARAMETERS.REDEEM_REQUEST_ID]: requestId
    });
  };

  const pageCount = Math.ceil(redeemRequestsTotalCount / TABLE_PAGE_LIMIT);
  const selectedRedeemRequest = data.find(redeemRequest => redeemRequest.id === selectedRedeemRequestId);

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
          {t('redeem_requests')}
        </h2>
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
      {selectedRedeemRequest && (
        <RedeemRequestModal
          open={!!selectedRedeemRequest}
          onClose={handleRedeemModalClose}
          request={selectedRedeemRequest} />
      )}
    </>
  );
};

export default withErrorBoundary(RedeemRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
