
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
import { VaultData } from '@interlay/polkabtc-stats'; // TODO: should do tree-shaking

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorHandler from 'components/ErrorHandler';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import DefaultColumnFilter from 'components/UI/InterlayTable/DefaultColumnFilter';
import NumberRangeColumnFilter from 'components/UI/InterlayTable/NumberRangeColumnFilter';
import SortBy, { SortByContainer } from 'components/UI/InterlayTable/SortBy';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
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

// TODO: should be paginated
const VaultScoresTable = ({
  challengeTime
}: Props): JSX.Element => {
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const statsApi = usePolkabtcStats();
  const [data, setData] = React.useState<PatchedVaultData[]>([]);
  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [error, setError] = React.useState<Error | null>(null);
  const { t } = useTranslation();

  // TODO: should add an abort-controller
  React.useEffect(() => {
    // TODO: should follow `<AuthenticatedApp />` vs. `<UnauthenticatedApp />` approach
    // - (Re: https://kentcdodds.com/blog/authentication-in-react-applications)
    if (!polkaBtcLoaded) return;
    if (!statsApi) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const response = await statsApi.getChallengeVaults(challengeTime);
        const sortedVaults = response.data.sort((a, b) => b.lifetime_sla - a.lifetime_sla);
        const transformedVaults = sortedVaults.map(vault => ({
          ...vault,
          lifetime_sla: Number(vault.lifetime_sla).toFixed(2)
        }));
        setStatus(STATUSES.RESOLVED);

        setData(transformedVaults);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [
    polkaBtcLoaded,
    challengeTime,
    statsApi
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
        accessor: 'request_issue_count',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.execute_issue_count'),
        accessor: 'execute_issue_count',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.request_redeem_count'),
        accessor: 'request_redeem_count',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.execute_redeem_count'),
        accessor: 'execute_redeem_count',
        classNames: [
          'text-right'
        ]
      },
      {
        Header: t('leaderboard.lifetime_sla'),
        accessor: 'lifetime_sla',
        Filter: NumberRangeColumnFilter,
        filter: 'between',
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
        <EllipsisLoader dotClassName='bg-interlayTreePoppy-400' />
      </div>
    );
  }

  if (status === STATUSES.REJECTED && error) {
    return (
      <ErrorHandler error={error} />
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

export default VaultScoresTable;
