
// @ts-nocheck
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// TODO: should type properly (Re:https://github.com/tannerlinsley/react-table/blob/master/TYPESCRIPT.md)
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter
} from 'react-table';
// TODO: should do tree-shaking
import { VaultData } from '@interlay/polkabtc-stats';

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorMessage from 'components/ErrorMessage';
import InterlayTable, {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
} from 'components/UI/InterlayTable';
import DefaultColumnFilter from 'components/UI/InterlayTable/DefaultColumnFilter';
import GlobalFilter from 'components/UI/InterlayTable/GlobalFilter';
import NumberRangeColumnFilter from 'components/UI/InterlayTable/NumberRangeColumnFilter';
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

const defaultColumn = {
  Filter: DefaultColumnFilter
};

// TODO: should be paginated
const VaultScoresTable = ({
  challengeTime
}: Props) => {
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const statsApi = usePolkabtcStats();
  const [data, setData] = React.useState<(PatchedVaultData)[]>([]);
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
        const vaults = (await statsApi.getVaults(challengeTime)).data;
        // TODO: should be done by table sort feature
        const sortedVaults = vaults.sort((a, b) => b.lifetime_sla - a.lifetime_sla);
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
        minWidth: 480
      },
      {
        Header: `${t('leaderboard.collateral')} (DOT)`,
        accessor: 'collateral',
        disableFilters: true,
        minWidth: 180
      },
      {
        Header: t('leaderboard.request_issue_count'),
        accessor: 'request_issue_count',
        disableFilters: true,
        minWidth: 180
      },
      {
        Header: t('leaderboard.execute_issue_count'),
        accessor: 'execute_issue_count',
        disableFilters: true,
        minWidth: 180
      },
      {
        Header: t('leaderboard.request_redeem_count'),
        accessor: 'request_redeem_count',
        disableFilters: true,
        minWidth: 180
      },
      {
        Header: t('leaderboard.execute_redeem_count'),
        accessor: 'execute_redeem_count',
        disableFilters: true,
        minWidth: 180
      },
      {
        Header: t('leaderboard.lifetime_sla'),
        accessor: 'lifetime_sla',
        Filter: NumberRangeColumnFilter,
        filter: 'between',
        minWidth: 180
      }
    ],
    [t]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div className='flex justify-center'>
        <EllipsisLoader dotClassName='bg-interlayYellow-light' />
      </div>
    );
  }

  if (status === STATUSES.REJECTED) {
    return (
      <ErrorMessage message={error?.message} />
    );
  }

  if (status === STATUSES.RESOLVED) {
    // TODO: should optimize re-renders https://kentcdodds.com/blog/optimize-react-re-renders
    return (
      <InterlayTableContainer>
        <InterlayTable {...getTableProps()}>
          <InterlayThead>
            {headerGroups.map(headerGroup => (
              <InterlayTr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <InterlayTh
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ minWidth: column.minWidth }}>
                    {column.render('Header')}
                    {column.isSorted && (
                      // ray test touch <
                      <span className='ml-1'>
                        {column.isSortedDesc ? '▼' : '▲'}
                      </span>
                      // ray test touch >
                    )}
                    {column.canFilter && <div>{column.render('Filter')}</div>}
                  </InterlayTh>
                ))}
              </InterlayTr>
            ))}
            <InterlayTr>
              <InterlayTh
                colSpan={visibleColumns.length}
                // ray test touch <
                style={{
                  textAlign: 'left'
                }}>
                {/* ray test touch > */}
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter} />
              </InterlayTh>
            </InterlayTr>
          </InterlayThead>
          <InterlayTbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);

              return (
                <InterlayTr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <InterlayTd {...cell.getCellProps()}>{cell.render('Cell')}</InterlayTd>;
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
