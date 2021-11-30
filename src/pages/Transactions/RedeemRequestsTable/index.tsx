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
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { RedeemStatus } from '@interlay/interbtc-api';

import RedeemRequestModal from './RedeemRequestModal';
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
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import {
  shortTxId,
  formatDateTimePrecise,
  displayMonetaryAmount
} from 'common/utils/utils';
import redeemCountQuery from 'services/queries/redeem-count-query';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import graphqlFetcher, {
  GraphqlReturn,
  GRAPHQL_FETCHER
} from 'services/fetchers/graphql-fetcher';
import redeemFetcher, {
  REDEEM_FETCHER,
  getRedeemWithStatus
} from 'services/fetchers/redeem-request-fetcher';
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
    isIdle: redeemRequestsTotalCountIdle,
    isLoading: redeemRequestsTotalCountLoading,
    data: redeemRequestsTotalCount,
    error: redeemRequestsTotalCountError
  // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      redeemCountQuery(`userParachainAddress_eq: "${address}"`)
    ],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(redeemRequestsTotalCountError);

  const {
    isIdle: redeemRequestsIdle,
    isLoading: redeemRequestsLoading,
    data: redeemRequests,
    error: redeemRequestsError
  // TODO: should type properly (`Relay`)
  } = useQuery<any, Error>(
    [
      REDEEM_FETCHER,
      selectedPageIndex * TABLE_PAGE_LIMIT, // offset
      TABLE_PAGE_LIMIT, // limit
      btcConfirmations,
      `userParachainAddress_eq: "${address}"` // WHERE condition
    ],
    redeemFetcher,
    {
      enabled: btcConfirmations !== undefined
    }
  );
  useErrorHandler(redeemRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('issue_page.updated'),
        classNames: [
          'text-left'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          let date;
          if (redeem.execution) {
            date = redeem.execution.timestamp;
          } else if (redeem.cancellation) {
            date = redeem.cancellation.timestamp;
          } else {
            date = redeem.request.timestamp;
          }

          return (
            <>
              {formatDateTimePrecise(new Date(date))}
            </>
          );
        }
      },
      {
        Header: `${t('redeem_page.amount')} (${WRAPPED_TOKEN_SYMBOL})`,
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          return (
            <>
              {displayMonetaryAmount(redeem.request.requestedAmountBacking)}
            </>
          );
        }
      },
      {
        Header: t('issue_page.btc_transaction'),
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeemRequest } }: any) {
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
                      {redeemRequest.backingPayment.btcTxId ? (
                        <ExternalLink
                          href={`${BTC_TRANSACTION_API}${redeemRequest.backingPayment.btcTxId}`}
                          onClick={event => {
                            event.stopPropagation();
                          }}>
                          {shortTxId(redeemRequest.backingPayment.btcTxId)}
                        </ExternalLink>
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
        classNames: [
          'text-right'
        ],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          const value = redeem.backingPayment.confirmations;
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

  const data =
    (
      redeemRequests === undefined ||
      btcConfirmations === undefined ||
      parachainConfirmations === undefined ||
      latestParachainActiveBlock === undefined
    ) ?
      [] :
      redeemRequests.map(
        // TODO: should type properly (`Relay`)
        (redeem: any) => getRedeemWithStatus(
          redeem,
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
    redeemRequestsIdle ||
    redeemRequestsLoading ||
    redeemRequestsTotalCountIdle ||
    redeemRequestsTotalCountLoading
  ) {
    return (
      <PrimaryColorEllipsisLoader />
    );
  }
  if (redeemRequestsTotalCount === undefined) {
    throw new Error('Something went wrong!');
  }

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
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

  const totalSuccessfulRedeemCount = redeemRequestsTotalCount.data.redeemsConnection.totalCount || 0;
  const pageCount = Math.ceil(totalSuccessfulRedeemCount / TABLE_PAGE_LIMIT);
  const selectedRedeemRequest = data.find((redeemRequest: any) => redeemRequest.id === selectedRedeemRequestId);

  return (
    <>
      <InterlayTableContainer
        className={clsx(
          'space-y-6',
          'container',
          'mx-auto'
        )}>
        <SectionTitle>
          {t('redeem_requests')}
        </SectionTitle>
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
