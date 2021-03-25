
import {
  useMemo,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// TODO: should do tree-shaking
import { VaultData } from '@interlay/polkabtc-stats';

import InterlayTable from 'components/InterlayTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';

/**
 * TODO:
 * - Should exclude Interlay owned vaults.
 * - Should sort vaults with highest lifetime sla.
 */

interface Props {
  className?: string;
  // TODO: should be union type
  challengeCutOff: number;
}

interface PatchedVaultData extends Omit<VaultData, 'lifetime_sla'> {
  // eslint-disable-next-line camelcase
  lifetime_sla: string;
}

const VaultScoresTable = ({
  className,
  challengeCutOff
}: Props) => {
  const [data, setData] = useState<(PatchedVaultData)[]>([]);
  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);

  useEffect(() => {
    // TODO: should follow `<AuthenticatedApp />` vs. `<UnauthenticatedApp />` approach
    // - (Re: https://kentcdodds.com/blog/authentication-in-react-applications)
    if (!polkaBtcLoaded) return;
    if (!statsApi) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const vaults = (await statsApi.getVaults(challengeCutOff)).data;
        const sortedVaults = vaults.sort((a, b) => b.lifetime_sla - a.lifetime_sla);
        const transformedVaults = sortedVaults.map(vault => ({
          ...vault,
          collateral: vault.collateral,
          lifetime_sla: Number(vault.lifetime_sla).toFixed(2)
        }));

        setData(transformedVaults);
      } catch (error) {
        // TODO: should do error handling not console log
        console.log('[VaultScoresTable] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    challengeCutOff,
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
        accessor: 'collateral'
      },
      {
        Header: t('leaderboard.request_issue_count'),
        accessor: 'request_issue_count'
      },
      {
        Header: t('leaderboard.execute_issue_count'),
        accessor: 'execute_issue_count'
      },
      {
        Header: t('leaderboard.request_redeem_count'),
        accessor: 'request_redeem_count'
      },
      {
        Header: t('leaderboard.execute_redeem_count'),
        accessor: 'execute_redeem_count'
      },
      {
        Header: t('leaderboard.lifetime_sla'),
        accessor: 'lifetime_sla'
      }
    ],
    [t]
  );

  // TODO: should optimize re-renders https://kentcdodds.com/blog/optimize-react-re-renders
  return (
    <InterlayTable
      className={className}
      columns={columns}
      data={data} />
  );
};

export default VaultScoresTable;
