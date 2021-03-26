import { ReactElement, useEffect, useState } from 'react';
import BN from 'bn.js';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import { OracleStatus } from '@interlay/polkabtc-stats';

import DashboardTable, { StatusComponent, StatusCategories } from '../dashboard-table/dashboard-table';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';

type OracleTableProps = {
  planckLocked: string;
};

export default function OracleTable(props: OracleTableProps): ReactElement {
  const statsApi = usePolkabtcStats();
  const [oracles, setOracles] = useState<Array<OracleStatus>>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oracleStatuses = await statsApi.getLatestSubmissionForEachOracle();
        setOracles(oracleStatuses.data);
      } catch (error) {
        console.log('[OracleTable] error.message => ', error.message);
      }
    };

    fetchData();
  }, [statsApi]);

  const tableHeadings = [
    <h1>{t('source')}</h1>,
    <h1>{t('feed')}</h1>,
    <h1>{t('last_update')}</h1>,
    <h1>{t('exchange_rate')}</h1>,
    <h1>{t('status')}</h1>
  ];

  const oracleTableRow = (oracle: OracleStatus): ReactElement[] => [
    <p>{oracle.source}</p>,
    <p>{oracle.feed}</p>,
    <p>{oracle.lastUpdate}</p>,
    <p> 1 BTC = {new Big(oracle.exchangeRate).toFixed(5)} DOT</p>,
    <StatusComponent
      {...(oracle.online ?
        { text: t('online'), category: StatusCategories.Ok } :
        { text: t('offline'), category: StatusCategories.Bad })} />
  ];

  return (
    <div
      style={{ margin: '40px 0px' }}
      className={(new BN(props.planckLocked) <= new BN(0) ? 'oracle-space' : '')}>
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.oracles.oracles')}
        </p>
      </div>
      <DashboardTable
        pageData={oracles}
        headings={tableHeadings}
        dataPointDisplayer={oracleTableRow}
        noDataEl={<td colSpan={4}>{t('no_oracles')}</td>} />
    </div>
  );
}
