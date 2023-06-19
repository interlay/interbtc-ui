import { CurrencyExt, IssueStatus } from '@interlay/interbtc-api';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useTable } from 'react-table';

import { formatDateTimePrecise, shortAddress } from '@/common/utils/utils';
import { BTC_EXPLORER_ADDRESS_API } from '@/config/blockstream-explorer-links';
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
import { useIssueRequests } from '@/services/hooks/issue-requests';
import { issuesCountQuery } from '@/services/queries/issues';
import { TXType } from '@/types/general.d';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { getCurrencyEqualityCondition } from '@/utils/helpers/currencies';
import useQueryParams from '@/utils/hooks/use-query-params';
import useUpdateQueryParameters from '@/utils/hooks/use-update-query-parameters';

interface Props {
  vaultAddress: string;
  collateralToken: CurrencyExt;
}

const VaultIssueRequestsTable = ({ vaultAddress, collateralToken }: Props): JSX.Element | null => {
  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;
  const updateQueryParameters = useUpdateQueryParameters();
  const { t } = useTranslation();

  const collateralTokenCondition = getCurrencyEqualityCondition(collateralToken);

  const {
    isIdle: issueRequestsTotalCountIdle,
    isLoading: issueRequestsTotalCountLoading,
    data: issueRequestsTotalCount,
    error: issueRequestsTotalCountError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issuesCountQuery(`vault: {accountId_eq: "${vaultAddress}", collateralToken: {${collateralTokenCondition}}}`) // TODO: add condition for asset_eq when the page is refactored for accepting ForeignAsset currencies too (cf. e.g. issued graph in dashboard for example)
    ],
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
    `vault: {accountId_eq: "${vaultAddress}", collateralToken: {${collateralTokenCondition}}}`, // `WHERE` condition // TODO: add asset_eq, see comment above
    ISSUE_REDEEM_REQUEST_REFETCH_INTERVAL
  );
  useErrorHandler(issueRequestsError);

  const columns = React.useMemo(
    () => [
      {
        Header: t('id'),
        accessor: 'id',
        classNames: ['text-center'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <AddressWithCopyUI address={value} />;
        }
      },
      {
        Header: t('date_created'),
        classNames: ['text-left'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          return <>{formatDateTimePrecise(new Date(issue.request.timestamp))}</>;
        }
      },
      {
        Header: t('view_details'),
        classNames: ['text-left'],
        // TODO: should type properly (`Relay`)
        Cell: ({ row: { original: issue } }: any) => {
          return <ViewRequestDetailsLink id={issue.id} txType={TXType.Issue} />;
        }
      },
      {
        Header: t('vault.creation_block'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          return <>{issue.request.height.absolute}</>;
        }
      },
      {
        Header: t('last_update'),
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
        Header: t('last_update_block'),
        classNames: ['text-right'],
        // TODO: should type properly (`Relay`)
        Cell: function FormattedCell({ row: { original: issue } }: any) {
          let height;
          if (issue.execution) {
            height = issue.execution.height.absolute;
          } else if (issue.cancellation) {
            height = issue.cancellation.height.absolute;
          } else {
            height = issue.request.height.absolute;
          }

          return <>{height}</>;
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
        Header: t('issue_page.amount'),
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
        Header: t('griefing_collateral'),
        accessor: 'griefingCollateral',
        classNames: ['text-right'],
        Cell: function FormattedCell({ value }: { value: any }) {
          return <>{value.toHuman(5)}</>;
        }
      },
      {
        Header: t('issue_page.vault_btc_address'),
        accessor: 'vaultBackingAddress',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: string }) {
          return <ExternalLink href={`${BTC_EXPLORER_ADDRESS_API}${value}`}>{shortAddress(value)}</ExternalLink>;
        }
      },
      {
        Header: t('status'),
        accessor: 'status',
        classNames: ['text-left'],
        Cell: function FormattedCell({ value }: { value: IssueStatus }) {
          return (
            <StatusCell
              status={{
                completed: value === IssueStatus.Completed,
                cancelled: value === IssueStatus.Cancelled,
                isExpired: value === IssueStatus.Expired,
                reimbursed: false
              }}
            />
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
      [QUERY_PARAMETERS.PAGE]: (newSelectedPageIndex + 1).toString()
    });
  };

  const totalSuccessfulIssueCount = issueRequestsTotalCount.data.issuesConnection.totalCount || 0;
  const pageCount = Math.ceil(totalSuccessfulIssueCount / TABLE_PAGE_LIMIT);

  return (
    <InterlayTableContainer className='space-y-6'>
      <SectionTitle>{t('issue_requests')}</SectionTitle>
      <InterlayTable {...getTableProps()} className='bg-white'>
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
                  ])}
                >
                  {column.render('Header')}
                </InterlayTh>
              ))}
            </InterlayTr>
          ))}
        </InterlayThead>
        <InterlayTbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);

            return (
              // eslint-disable-next-line react/jsx-key
              <InterlayTr {...row.getRowProps()}>
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
    </InterlayTableContainer>
  );
};

export default withErrorBoundary(VaultIssueRequestsTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
