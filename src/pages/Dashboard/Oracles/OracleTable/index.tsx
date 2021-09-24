// ray test touch <<
import {
  ReactElement,
  useEffect,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { CollateralBtcOracleStatus } from '@interlay/interbtc/build/oracleTypes';

import { ORACLE_CURRENCY_KEY } from 'config/relay-chains';
import DashboardTable, { StatusComponent, StatusCategories } from 'common/components/dashboard-table/dashboard-table';
import { formatDateTime } from 'common/utils/utils';

const OracleTable = (): JSX.Element => {
  const [oracles, setOracles] = useState<Array<CollateralBtcOracleStatus>>([]);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const oracleStatuses = await window.bridge.interBtcIndex.getLatestSubmissionForEachOracle(ORACLE_CURRENCY_KEY);
        setOracles(oracleStatuses);
      } catch (error) {
        console.log('[OracleTable] error.message => ', error.message);
      }
    })();
  }, []);

  const tableHeadings = [
    <h1
      className='opacity-30'
      key={1}>
      {t('source')}
    </h1>,
    <h1
      className='opacity-30'
      key={2}>
      {t('feed')}
    </h1>,
    <h1
      className='opacity-30'
      key={3}>
      {t('last_update')}
    </h1>,
    <h1
      className='opacity-30'
      key={4}>
      {t('exchange_rate')}
    </h1>,
    <h1
      className='opacity-30'
      key={5}>
      {t('status')}
    </h1>
  ];

  const oracleTableRow = (oracle: CollateralBtcOracleStatus): ReactElement[] => [
    <p key={1}>{oracle.source}</p>,
    <p key={2}>{oracle.feed}</p>,
    <p key={3}>{formatDateTime(oracle.lastUpdate)}</p>,
    <p key={4}> 1 BTC = {oracle.exchangeRate.toHuman(5)} DOT</p>,
    <StatusComponent
      key={5}
      {...(oracle.online ?
        { text: t('online'), category: StatusCategories.Ok } :
        { text: t('offline'), category: StatusCategories.Bad })} />
  ];

  return (
    <div
      style={{ margin: '40px 0px' }}>
      <div>
        <p
          className='mb-4'
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
};

export default OracleTable;
// ray test touch >>
