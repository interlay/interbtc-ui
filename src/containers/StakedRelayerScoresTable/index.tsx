
// TODO: should type properly
// @ts-nocheck
import {
  useMemo,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter
} from 'react-table';
import { RelayerData } from '@interlay/polkabtc-stats';

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
 * - Should exclude Interlay owned relayers.
 * - Should sort relayers with highest lifetime sla.
 */

interface Props {
  challengeTime: number;
}

interface PatchedRelayerData extends Omit<RelayerData, 'lifetime_sla'> {
  // eslint-disable-next-line camelcase
  lifetime_sla: string;
}

const defaultColumn = {
  Filter: DefaultColumnFilter
};

const StakedRelayerScoresTable = ({
  challengeTime
}: Props) => {
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const statsApi = usePolkabtcStats();
  const [data, setData] = useState<(PatchedRelayerData)[]>([]);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!statsApi) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const stakedRelayers = (await statsApi.getRelayers(challengeTime)).data;
        const sortedStakedRelayers = stakedRelayers.sort((a, b) => b.lifetime_sla - a.lifetime_sla);
        const transformedStakedRelayers = sortedStakedRelayers.map(stakedRelayer => ({
          ...stakedRelayer,
          lifetime_sla: Number(stakedRelayer.lifetime_sla).toFixed(2)
        }));
        setStatus(STATUSES.RESOLVED);

        setData(transformedStakedRelayers);
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

  const columns = useMemo(
    () => [
      {
        Header: t('leaderboard.account_id'),
        accessor: 'id'
      },
      {
        Header: `${t('leaderboard.stake')} (DOT)`,
        accessor: 'stake',
        disableFilters: true
      },
      {
        Header: t('leaderboard.block_count'),
        accessor: 'block_count',
        disableFilters: true
      },
      {
        Header: t('leaderboard.lifetime_sla'),
        accessor: 'lifetime_sla',
        Filter: NumberRangeColumnFilter,
        filter: 'between'
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
    return (
      <InterlayTableContainer>
        <InterlayTable
          {...getTableProps()}>
          <InterlayThead>
            {headerGroups.map(headerGroup => (
              <InterlayTr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <InterlayTh {...column.getHeaderProps(column.getSortByToggleProps())}>
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

export default StakedRelayerScoresTable;
