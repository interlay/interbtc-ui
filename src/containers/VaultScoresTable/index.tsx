// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter
// eslint-disable-next-line max-len
} from 'react-table'; // TODO: should type properly (Re:https://github.com/tannerlinsley/react-table/blob/master/TYPESCRIPT.md)
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { VaultData } from '@interlay/interbtc-index-client'; // TODO: should do tree-shaking

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorFallback from 'components/ErrorFallback';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import DefaultColumnFilter from 'components/UI/InterlayTable/DefaultColumnFilter';
import SortBy, { SortByContainer } from 'components/UI/InterlayTable/SortBy';
import usePolkabtcStats from 'common/hooks/use-interbtc-index';
import { StoreType } from 'common/types/util.types';
import STATUSES from 'utils/constants/statuses';

/**
 * TODO:
 * - Should exclude Interlay owned vaults.
 * - Should sort vaults with highest lifetime sla.
 */

interface Props {
  // TODO: should be union type
  challengeTime: number;
}

interface PatchedVaultData extends Omit<VaultData, 'lifetime_sla'> {
  // eslint-disable-next-line camelcase
  lifetime_sla: string;
}

// TODO: not used for now
// TODO: should be paginated
const VaultScoresTable = ({
  challengeTime
}: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const statsApi = usePolkabtcStats();
  const [data, setData] = React.useState<PatchedVaultData[]>([]);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const handleError = useErrorHandler();
  const { t } = useTranslation();

  // TODO: should add an abort-controller
  React.useEffect(() => {
    // TODO: should follow `<AuthenticatedApp />` vs. `<UnauthenticatedApp />` approach
    // - (Re: https://kentcdodds.com/blog/authentication-in-react-applications)
    if (!bridgeLoaded) return;
    if (!statsApi) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const response = await statsApi.getChallengeVaults({ slaSince: challengeTime });
        const sortedVaults = response.sort((a, b) => b.lifetimeSla - a.lifetimeSla);
        const transformedVaults = sortedVaults.map(vault => ({
          ...vault,
          lifetimeSla: Number(vault.lifetimeSla).toFixed(2)
        }));
        setStatus(STATUSES.RESOLVED);

        setData(transformedVaults);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    bridgeLoaded,
    challengeTime,
    statsApi,
    handleError
  ]);

  const columns = React.useMemo(
    () => [
      // TODO: should type properly
      {
        Header: t('leaderboard.account_id'),
        accessor: 'id',
        Filter: DefaultColumnFilter,
        classNames: [
          'text-left'
        ]
      },
      {
        Header: `${t('leaderboard.collateral')} (DOT)`,
        accessor: 'collateral',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.request_issue_count'),
        accessor: 'requestIssueCount',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.execute_issue_count'),
        accessor: 'executeIssueCount',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.request_redeem_count'),
        accessor: 'requestRedeemCount',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.execute_redeem_count'),
        accessor: 'executeRedeemCount',
        classNames: [
          'text-right'
        ]
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
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
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

  if (status === STATUSES.RESOLVED) {
    // TODO: should optimize re-renders https://kentcdodds.com/blog/optimize-react-re-renders
    return (
      <InterlayTableContainer>
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
                      },
                      column.getSortByToggleProps()
                    ])}>
                    <SortByContainer>
                      <span>{column.render('Header')}</span>
                      <SortBy
                        isSorted={column.isSorted}
                        isSortedDesc={column.isSortedDesc} />
                    </SortByContainer>
                    {column.canFilter && column.Filter && (
                      <div>{column.render('Filter', { placeholder: 'Search by Account ID' })}</div>
                    )}
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
      </InterlayTableContainer>
    );
  }

  return null;
};

export default withErrorBoundary(VaultScoresTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
