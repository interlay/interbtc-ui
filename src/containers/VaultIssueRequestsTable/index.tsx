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
import { BitcoinNetwork, IssueColumns } from '@interlay/interbtc-index-client';
import {
  Issue,
  IssueStatus
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
import { WrappedTokenAmount } from 'config/relay-chains';

interface Props {
  totalIssueRequests: number;
  vaultAddress: string;
}

const VaultIssueRequestsTable = ({
  totalIssueRequests,
  vaultAddress
}: Props): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const [data, setData] = React.useState<Issue[]>([]);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();
  const { t } = useTranslation();

  const issueRequestFilter = React.useMemo(
    () => [{ column: IssueColumns.VaultId, value: vaultAddress }], // filter requests by vault address
    [vaultAddress]
  );

  React.useEffect(() => {
    if (!selectedPage) return;
    if (!handleError) return;

    const selectedPageIndex = selectedPage - 1;

    try {
      (async () => {
        setStatus(STATUSES.PENDING);
        const response = await window.bridge.interBtcIndex.getFilteredIssues({
          page: selectedPageIndex,
          perPage: TABLE_PAGE_LIMIT,
          network: constants.BITCOIN_NETWORK as BitcoinNetwork, // Not sure why cast is necessary here, but TS complains
          filterIssueColumns: issueRequestFilter
        });
        setStatus(STATUSES.RESOLVED);
        setData(response);
      })();
    } catch (error) {
      setStatus(STATUSES.REJECTED);
      handleError(error);
    }
  }, [
    selectedPage,
    issueRequestFilter,
    handleError
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('id'),
        accessor: 'id',
        classNames: [
          'text-center'
        ]
      },
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
        Header: t('vault.creation_block'),
        accessor: 'creationBlock',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('user'),
        accessor: 'userParachainAddress',
        classNames: [
          'text-center'
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
        Header: t('issue_page.amount'),
        accessor: 'wrappedAmount',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }: {
          value: WrappedTokenAmount;
        }) {
          return (
            <>
              {value.toHuman()}
            </>
          );
        }
      },
      {
        Header: t('griefing_collateral'),
        accessor: 'griefingCollateral',
        classNames: [
          'text-right'
        ],
        Cell: function FormattedCell({ value }) {
          return (
            <>
              {value.toHuman()}
            </>
          );
        }
      },
      {
        Header: t('issue_page.vault_btc_address'),
        accessor: 'vaultBTCAddress',
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
        Cell: function FormattedCell({ value }: { value: IssueStatus; }) {
          return (
            <StatusCell
              status={{
                completed: value === IssueStatus.Completed,
                cancelled: value === IssueStatus.Cancelled,
                isExpired: value === IssueStatus.Expired,
                reimbursed: false
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
  const pageCount = Math.ceil(totalIssueRequests / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className='space-y-6'>
      <h2
        className={clsx(
          'text-2xl',
          'font-medium'
        )}>
        {t('issue_requests')}
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

export default withErrorBoundary(VaultIssueRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
