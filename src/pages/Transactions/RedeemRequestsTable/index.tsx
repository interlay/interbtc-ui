
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
import {
  Redeem,
  RedeemStatus
} from '@interlay/interbtc-api';
import {
  RedeemColumns,
  BitcoinNetwork
} from '@interlay/interbtc-index-client';

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
import { BITCOIN_NETWORK } from '../../../constants';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
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
      GENERIC_FETCHER,
      'interBtcIndex',
      'getFilteredTotalRedeems',
      {
        filterRedeemColumns: [{
          column: RedeemColumns.Requester,
          value: address
        }]
      }
    ],
    genericFetcher<number>(),
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
      GENERIC_FETCHER,
      'interBtcIndex',
      'getFilteredRedeems',
      {
        page: selectedPageIndex,
        perPage: TABLE_PAGE_LIMIT,
        network: BITCOIN_NETWORK as BitcoinNetwork,
        filterRedeemColumns: [{
          column: RedeemColumns.Requester,
          value: address
        }] // Filter by requester == address
      }
    ],
    genericFetcher<Array<Redeem>>(),
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
        Header: `${t('redeem_page.amount')} (${WRAPPED_TOKEN_SYMBOL})`,
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
                      {redeemRequest.btcTxId ? (
                        <ExternalLink
                          href={`${BTC_TRANSACTION_API}${redeemRequest.btcTxId}`}
                          onClick={event => {
                            event.stopPropagation();
                          }}>
                          {shortTxId(redeemRequest.btcTxId)}
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
