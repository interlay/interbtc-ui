import React, { useState, useEffect, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import './leaderboard.page.scss';
import { StoreType } from '../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import DashboardTable from '../../common/components/dashboard-table/dashboard-table';
import usePolkabtcStats from '../../common/hooks/use-polkabtc-stats';
import { RelayerData, VaultData } from '@interlay/polkabtc-stats';

export default function LeaderboardPage(): ReactElement {
  // eslint-disable-next-line no-array-constructor
  const [vaultRows, setVaultRows] = useState(new Array<VaultData>());
  // eslint-disable-next-line no-array-constructor
  const [relayerRows, setRelayerRows] = useState(new Array<RelayerData>());

  const statsApi = usePolkabtcStats();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const vaultTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.collateral')}</h1>,
    <h1>{t('leaderboard.request_issue_count')}</h1>,
    <h1>{t('leaderboard.execute_issue_count')}</h1>,
    <h1>{t('leaderboard.request_redeem_count')}</h1>,
    <h1>{t('leaderboard.execute_redeem_count')}</h1>
  ];

  // TODO:
  // - exclude Interlay owned vaults
  // - sort vaults with highest lifetime sla
  const tableVaultRow = useMemo(
    () => (row: VaultData): ReactElement[] => [
      <p>{row.id}</p>,
      <p>{row.collateral} DOT</p>,
      <p>{row.request_issue_count}</p>,
      <p>{row.execute_issue_count}</p>,
      <p>{row.request_redeem_count}</p>,
      <p>{row.execute_redeem_count}</p>
    ],
    []
  );

  const relayerTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.stake')}</h1>,
    <h1>{t('leaderboard.block_count')}</h1>
  ];

  // TODO:
  // - exclude Interlay owned relayers
  // - sort relayers with highest lifetime sla
  const tableRelayerRow = useMemo(
    () => (row: RelayerData): ReactElement[] => [<p>{row.id}</p>, <p>{row.stake} DOT</p>, <p>{row.block_count}</p>],
    []
  );

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!polkaBtcLoaded) return;
      const vaults = (await statsApi.getVaults()).data;
      setVaultRows(
        vaults.sort(
          (a, b) =>
            (b.request_issue_count + b.request_redeem_count) -
            (a.request_issue_count + a.request_redeem_count)
        )
      );
    };
    const fetchRelayerData = async () => {
      if (!polkaBtcLoaded) return;
      const relayers = (await statsApi.getRelayers()).data;
      setRelayerRows(
        relayers.sort(
          (a, b) => b.block_count - a.block_count
        )
      );
    };
    fetchVaultData();
    fetchRelayerData();
  }, [polkaBtcLoaded, statsApi, t]);

  return (
    <div className='leaderboard-page container-fluid white-background'>
      <div className='leaderboard-container dashboard-fade-in-animation dahboard-min-height'>
        <div className='stacked-wrapper'>
          <div className='row'>
            <div className='title'>{t('leaderboard.title')}</div>
          </div>

          <div className='dashboard-table-container'>
            <div>
              <p className='table-heading'>{t('leaderboard.vault_scores')}</p>
            </div>
            <DashboardTable
              pageData={vaultRows}
              headings={vaultTableHeadings}
              dataPointDisplayer={tableVaultRow}
              noDataEl={<td colSpan={6}>{t('no_registered_vaults')}</td>} />
          </div>

          <div className='dashboard-table-container'>
            <div>
              <p className='table-heading'>{t('leaderboard.relayer_scores')}</p>
            </div>
            <DashboardTable
              pageData={relayerRows}
              headings={relayerTableHeadings}
              dataPointDisplayer={tableRelayerRow}
              noDataEl={<td colSpan={6}>{t('no_registered_relayers')}</td>} />
          </div>
        </div>
      </div>
    </div>
  );
}
