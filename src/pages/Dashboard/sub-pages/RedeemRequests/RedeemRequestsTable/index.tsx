import { RedeemStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';

import { formatDateTimePrecise, formatNumber, shortAddress, shortTxId } from '@/common/utils/utils';
import { BTC_EXPLORER_ADDRESS_API, BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import { ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL } from '@/config/parachain';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ExternalLink from '@/legacy-components/ExternalLink';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
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
import SectionTitle from '@/parts/SectionTitle';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import { useRedeemRequests } from '@/services/hooks/redeem-requests';
import redeemCountQuery from '@/services/queries/redeem-count-query';
import { TXType } from '@/types/general.d';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import useQueryParams from '@/utils/hooks/use-query-params';
import useUpdateQueryParameters from '@/utils/hooks/use-update-query-parameters';

const RedeemRequestsTable = (): JSX.Element => {
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
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          return <>{formatDateTimePrecise(new Date(redeem.request.timestamp))}</>;
        }
      },
      {
        Header: t('last_update'),
        classNames: ['text-left'],
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

          return <>{formatDateTimePrecise(new Date(date))}</>;
        }
      },
      {
        Header: t('view_details'),
        classNames: ['text-left'],
        // TODO: should type properly (`Relay`)
        Cell: ({ row: { original: redeem } }: any) => {
          return <ViewRequestDetailsLink id={redeem.id} txType={TXType.Redeem} />;
        }
      },
      {
        Header: t('parachain_block'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          let height;
          if (redeem.execution) {
            height = redeem.execution.height.absolute;
          } else if (redeem.cancellation) {
            height = redeem.cancellation.height.absolute;
          } else {
            height = redeem.request.height.absolute;
          }

          return <>{formatNumber(height)}</>;
        }
      },
      {
        Header: t('redeem_page.amount'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeem } }: any) {
          return <>{redeem.request.requestedAmountBacking.toHuman(8)}</>;
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
        Header: t('redeem_page.output_BTC_address'),
        accessor: 'userBackingAddress',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <ExternalLink href={`${BTC_EXPLORER_ADDRESS_API}${value}`}>{shortAddress(value)}</ExternalLink>;
        }
      },
      {
        Header: t('issue_page.btc_transaction'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: redeemRequest } }: any) {
          return (
            <>
              {redeemRequest.backingPayment.btcTxId ? (
                <ExternalLink
                  href={`${BTC_EXPLORER_TRANSACTION_API}${redeemRequest.backingPayment.btcTxId}`}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {shortTxId(redeemRequest.backingPayment.btcTxId)}
                </ExternalLink>
              ) : redeemRequest.status === RedeemStatus.Expired ||
                redeemRequest.status === RedeemStatus.Retried ||
                redeemRequest.status === RedeemStatus.Reimbursed ? (
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
        Cell: function FormattedCell({ value }: { value: RedeemStatus }) {
          return (
            <StatusCell
              status={{
                completed: value === RedeemStatus.Completed,
                cancelled: value === RedeemStatus.Retried,
                isExpired: value === RedeemStatus.Expired,
                reimbursed: value === RedeemStatus.Reimbursed
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
    isIdle: redeemsCountIdle,
    isLoading: redeemsCountLoading,
    data: redeemsCount,
    error: redeemsCountError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>([GRAPHQL_FETCHER, redeemCountQuery()], graphqlFetcher<GraphqlReturn<any>>());
  useErrorHandler(redeemsCountError);

  const {
    isIdle: redeemRequestsIdle,
    isLoading: redeemRequestsLoading,
    data: redeemRequests,
    error: redeemRequestsError
  } = useRedeemRequests(
    selectedPageIndex * TABLE_PAGE_LIMIT,
    TABLE_PAGE_LIMIT,
    undefined,
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(redeemRequestsError);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: redeemRequests ?? []
  });

  const renderContent = () => {
    if (redeemRequestsIdle || redeemRequestsLoading || redeemsCountIdle || redeemsCountLoading) {
      return <PrimaryColorEllipsisLoader />;
    }
    if (redeemsCount === undefined) {
      throw new Error('Something went wrong!');
    }

    const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
      updateQueryParameters({
        [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
      });
    };

    const totalRedeemCount = redeemsCount.data.redeemsConnection.totalCount || 0;
    const pageCount = Math.ceil(totalRedeemCount / TABLE_PAGE_LIMIT);

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

export default withErrorBoundary(RedeemRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
