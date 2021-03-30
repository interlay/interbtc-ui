
import {
  useMemo,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// TODO: should do tree-shaking
import { VaultData } from '@interlay/polkabtc-stats';

import EllipsisLoader from 'components/EllipsisLoader';
import ErrorMessage from 'components/ErrorMessage';
import InterlayTable from 'components/UI/InterlayTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';
import STATUSES from 'utils/constants/statuses';

/**
 * TODO:
 * - Should exclude Interlay owned vaults.
 * - Should sort vaults with highest lifetime sla.
 */

// TODO: should type properly
function NumberRangeColumnFilter({
  column: {
    filterValue = [],
    preFilteredRows,
    setFilter,
    id
  }
}: any) {
  const [
    min,
    max
  ] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });

    return [
      min,
      max
    ];
  }, [
    id,
    preFilteredRows
  ]);

  return (
    <div
      style={{
        display: 'flex'
      }}>
      <input
        value={filterValue[0] || ''}
        type='number'
        onChange={event => {
          const val = event.target.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        onClick={event => {
          event.stopPropagation();
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem'
        }} />
      to
      <input
        value={filterValue[1] || ''}
        type='number'
        onChange={event => {
          const val = event.target.value;
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        onClick={event => {
          event.stopPropagation();
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem'
        }} />
    </div>
  );
}

interface Props {
  className?: string;
  // TODO: should be union type
  challengeTime: number;
}

interface PatchedVaultData extends Omit<VaultData, 'lifetime_sla'> {
  // eslint-disable-next-line camelcase
  lifetime_sla: string;
}

// TODO: should be paginated
const VaultScoresTable = ({
  className,
  challengeTime
}: Props) => {
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const statsApi = usePolkabtcStats();
  const [data, setData] = useState<(PatchedVaultData)[]>([]);
  const [status, setStatus] = useState(STATUSES.IDLE);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  // TODO: should add an abort-controller
  useEffect(() => {
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

  const columns = useMemo(
    () => [
      // TODO: should type properly
      {
        Header: t('leaderboard.account_id'),
        accessor: 'id'
      },
      {
        Header: `${t('leaderboard.collateral')} (DOT)`,
        accessor: 'collateral',
        Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: t('leaderboard.request_issue_count'),
        accessor: 'request_issue_count',
        Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: t('leaderboard.execute_issue_count'),
        accessor: 'execute_issue_count',
        Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: t('leaderboard.request_redeem_count'),
        accessor: 'request_redeem_count',
        Filter: NumberRangeColumnFilter,
        filter: 'between'
      },
      {
        Header: t('leaderboard.execute_redeem_count'),
        accessor: 'execute_redeem_count',
        Filter: NumberRangeColumnFilter,
        filter: 'between'
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
      <InterlayTable
        className={className}
        columns={columns}
        data={data} />
    );
  }

  return null;
};

export default VaultScoresTable;
