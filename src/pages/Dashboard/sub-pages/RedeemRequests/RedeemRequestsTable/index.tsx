
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import clsx from 'clsx';
import { BitcoinNetwork } from '@interlay/interbtc-index-client';
import {
  Redeem,
  RedeemStatus
} from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';

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
import StatusCell from 'components/UI/InterlayTable/StatusCell';
import { BTC_ADDRESS_API } from 'config/bitcoin';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import {
  shortAddress,
  formatDateTimePrecise
} from 'common/utils/utils';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import STATUSES from 'utils/constants/statuses';
import * as constants from '../../../../../constants';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const RedeemRequestsTable = (): JSX.Element => {
  const queryParams = useQueryParams();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const [data, setData] = React.useState<Redeem[]>([]);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!selectedPage) return;
    if (!handleError) return;
    if (!bridgeLoaded) return;

    const selectedPageIndex = selectedPage - 1;

    try {
      (async () => {
        setStatus(STATUSES.PENDING);
        const response = await window.bridge.interBtcIndex.getRedeems({
          page: selectedPageIndex,
          perPage: TABLE_PAGE_LIMIT,
          network: constants.BITCOIN_NETWORK as BitcoinNetwork
        });
        setStatus(STATUSES.RESOLVED);
        setData(response);
      })();
    } catch (error) {
      setStatus(STATUSES.REJECTED);
      handleError(error);
    }
  }, [
    bridgeLoaded,
    selectedPage,
    handleError
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('date'),
        accessor: 'creationTimestamp',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: number; }) {
          return (
            <>
              {formatDateTimePrecise(new Date(Number(value)))}
            </>
          );
        }
      },
      {
        Header: t('redeem_page.amount'),
        accessor: 'amountBTC',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: {
          value: BitcoinAmount;
        }) {
          return (
            <>
              {value.toHuman()}
            </>
          );
        }
      },
      {
        Header: t('parachain_block'),
        accessor: 'creationBlock',
        classNames: [
          'text-right'
        ]
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
        Header: t('redeem_page.output_BTC_address'),
        accessor: 'userBTCAddress',
        classNames: [
          'text-left'
        ],
        Cell: function FormattedCell({ value }: { value: string; }) {
          return (
            <ExternalLink href={`${BTC_ADDRESS_API}${value}`}>
              {shortAddress(value)}
            </ExternalLink>
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
          return (
            <StatusCell
              status={{
                completed: value === RedeemStatus.Completed,
                cancelled: value === RedeemStatus.Retried,
                isExpired: value === RedeemStatus.Expired,
                reimbursed: value === RedeemStatus.Reimbursed
              }} />
          );
        }
      }
    ],
    [t]
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

  const {
    isIdle: totalRedeemRequestsIdle,
    isLoading: totalRedeemRequestsLoading,
    data: totalRedeemRequests,
    error: totalRedeemRequestsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalRedeems'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalRedeemRequestsError);

  const renderContent = () => {
    if (
      (status === STATUSES.IDLE || status === STATUSES.PENDING) ||
      (totalRedeemRequestsIdle || totalRedeemRequestsLoading)
    ) {
      return <PrimaryColorEllipsisLoader />;
    }
    if (totalRedeemRequests === undefined) {
      throw new Error('Something went wrong!');
    }

    if (status === STATUSES.RESOLVED) {
      const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number; }) => {
        updateQueryParameters({
          [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
        });
      };

      const selectedPageIndex = selectedPage - 1;
      const pageCount = Math.ceil(totalRedeemRequests / TABLE_PAGE_LIMIT);

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
        </>
      );
    }

    throw new Error('Something went wrong!');
  };

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>
        {t('issue_page.recent_requests')}
      </SectionTitle>
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
