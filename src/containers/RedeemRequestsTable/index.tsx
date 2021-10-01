// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from 'react-table';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { BitcoinNetwork } from '@interlay/interbtc-index-client';
import {
  Redeem,
  RedeemStatus
} from '@interlay/interbtc-api';

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
import StatusCell from 'components/UI/InterlayTable/StatusCell';
import InterlayLink from 'components/UI/InterlayLink';
import useQueryParams from 'utils/hooks/use-query-params';
import useUpdateQueryParameters from 'utils/hooks/use-update-query-parameters';
import {
  shortAddress,
  formatDateTimePrecise
} from 'common/utils/utils';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import { BTC_ADDRESS_API } from 'config/bitcoin';
import * as constants from '../../constants';
import STATUSES from 'utils/constants/statuses';
import { BitcoinAmount } from '@interlay/monetary-js';

interface Props {
  totalRedeemRequests: number;
}

const RedeemRequestsTable = ({
  totalRedeemRequests
}: Props): JSX.Element | null => {
  const queryParams = useQueryParams();
  const bridgeLoaded = useSelector((state: StoreType) => state.general);
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
            <InterlayLink
              className={clsx(
                'text-interlayDenim',
                'space-x-1.5',
                'inline-flex',
                'items-center'
              )}
              href={`${BTC_ADDRESS_API}${value}`}
              target='_blank'
              rel='noopener noreferrer'>
              <span>{shortAddress(value)}</span>
              <FaExternalLinkAlt />
            </InterlayLink>
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

  const handlePageChange = ({ selected: newSelectedPageIndex }: { selected: number }) => {
    updateQueryParameters({
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const selectedPageIndex = selectedPage - 1;
  const pageCount = Math.ceil(totalRedeemRequests / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className='space-y-6'>
      <h2
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {t('issue_page.recent_requests')}
      </h2>
      {(status === STATUSES.IDLE || status === STATUSES.PENDING) && (
        <div
          className={clsx(
            'flex',
            'justify-center'
          )}>
          <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
        </div>
      )}
      {status === STATUSES.RESOLVED && (
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

              return (
                // eslint-disable-next-line react/jsx-key
                <InterlayTr {...row.getRowProps()}>
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
      )}
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
  );
};

export default withErrorBoundary(RedeemRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
