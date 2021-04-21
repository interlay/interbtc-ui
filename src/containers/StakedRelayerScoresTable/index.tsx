
// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
import clsx from 'clsx';
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
import NumberRangeColumnFilter from 'components/UI/InterlayTable/NumberRangeColumnFilter';
import SortBy, { SortByContainer } from 'components/UI/InterlayTable/SortBy';
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

const StakedRelayerScoresTable = ({
  challengeTime
}: Props): JSX.Element => {
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
        accessor: 'id',
        Filter: DefaultColumnFilter,
        classNames: [
          'text-left'
        ]
      },
      {
        Header: `${t('leaderboard.stake')} (DOT)`,
        accessor: 'stake',
        classNames: [
          'text-right'
        ],
        style: {
          minWidth: 120
        }
      },
      {
        Header: t('leaderboard.block_count'),
        accessor: 'block_count',
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

export default StakedRelayerScoresTable;
