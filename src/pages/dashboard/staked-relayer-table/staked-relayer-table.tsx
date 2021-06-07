import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardTable, {
  StatusComponent,
  StatusCategories
} from '../../../common/components/dashboard-table/dashboard-table';
import useInterbtcStats from '../../../common/hooks/use-interbtc-stats';

type StakedRelayer = {
  id: string;
  stake: string;
  bonded: boolean;
  slashed: boolean;
};

export default function StakedRelayerTable(): ReactElement {
  const { t } = useTranslation();
  const statsApi = useInterbtcStats();
  const [relayers, setRelayers] = useState<Array<StakedRelayer>>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await statsApi.getRelayers(0);
        setRelayers(res.data);
      } catch (error) {
        console.log('Error fetching staked relayers data.');
        console.log('error.message => ', error.message);
      }
    })();
  }, [statsApi]);

  const tableHeadings = [
    <h1 key={1}>{t('account_id')}</h1>,
    <h1 key={2}>{t('locked_dot')}</h1>,
    <h1 key={3}>{t('status')}</h1>
  ];

  const relayersTableRow = (relayer: StakedRelayer): ReactElement[] => [
    <p
      key={1}
      className='break-words'>
      {relayer.id}
    </p>,
    <p key={2}>{relayer.stake}</p>,
    <StatusComponent
      key={3}
      {...(relayer.slashed ?
        { text: t('dashboard.parachain.slashed'), category: StatusCategories.Bad } :
        relayer.bonded ?
          { text: t('ok'), category: StatusCategories.Ok } :
          { text: t('dashboard.parachain.bonding'), category: StatusCategories.Neutral })} />
  ];

  return (
    <div style={{ margin: '40px 0px' }}>
      <div>
        <p
          className='mb-4'
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.parachain.relayers')}
        </p>
      </div>
      <DashboardTable
        pageData={relayers}
        headings={tableHeadings}
        dataPointDisplayer={relayersTableRow}
        noDataEl={<div>{t('dashboard.no-registered')}</div>} />
    </div>
  );
}
