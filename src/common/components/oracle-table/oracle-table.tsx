import { ReactElement, useEffect, useState } from 'react';
import { StoreType } from '../../types/util.types';
import { useSelector } from 'react-redux';
import { formatDateTime } from '../../utils/utils';
import BN from 'bn.js';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import DashboardTable, { StatusComponent, StatusCategories } from '../dashboard-table/dashboard-table';

interface OracleInfo {
  id: string;
  source: string;
  feed: string;
  lastUpdate: string;
  exchangeRate: Big;
  online: boolean;
}

type OracleTableProps = {
  planckLocked: string;
};

export default function OracleTable(props: OracleTableProps): ReactElement {
  const [oracles, setOracles] = useState<Array<OracleInfo>>([]);
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const oracle = await window.polkaBTC.oracle.getInfo();
        setOracles(
          oracle.names.map((name, i) => ({
            id: i.toString(),
            source: name,
            feed: oracle.feed,
            lastUpdate: formatDateTime(oracle.lastUpdate),
            exchangeRate: oracle.exchangeRate,
            online: oracle.online && Date.now() - oracle.lastUpdate.getTime() < 3600 * 1000
          }))
        );
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [polkaBtcLoaded]);

  const tableHeadings = [
    <h1>{t('source')}</h1>,
    <h1>{t('feed')}</h1>,
    <h1>{t('last_update')}</h1>,
    <h1>{t('exchange_rate')}</h1>,
    <h1>{t('status')}</h1>
  ];

  const oracleTableRow = (oracle: OracleInfo): ReactElement[] => [
    <p>{oracle.source}</p>,
    <p>{oracle.feed}</p>,
    <p>{oracle.lastUpdate}</p>,
    <p> 1 BTC = {oracle.exchangeRate.toFixed(5)} DOT</p>,
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
