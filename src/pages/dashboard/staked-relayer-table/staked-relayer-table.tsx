import React, { ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DashboardTable, {
  StatusComponent,
  StatusCategories
} from '../../../common/components/dashboard-table/dashboard-table';
import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';

type StakedRelayer = {
    id: string;
    stake: string;
    bonded: boolean;
    slashed: boolean;
};

export default function StakedRelayerTable(): ReactElement {
  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();
  const [relayers, setRelayers] = useState<Array<StakedRelayer>>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await statsApi.getRelayers();
        setRelayers(res.data);
      } catch (error) {
        toast.error(error.toString());
      }
    })();
  }, [statsApi]);

  const tableHeadings = [<h1>{t('account_id')}</h1>, <h1>{t('locked_dot')}</h1>, <h1>{t('status')}</h1>];

  const relayersTableRow = (relayer: StakedRelayer): ReactElement[] => [
    <p className='break-words'>{relayer.id}</p>,
    <p>{relayer.stake}</p>,
    <StatusComponent
      {...(relayer.slashed ?
        { text: t('dashboard.parachain.slashed'), category: StatusCategories.Bad } :
        relayer.bonded ?
          { text: t('ok'), category: StatusCategories.Ok } :
          { text: t('dashboard.parachain.bonding'), category: StatusCategories.Neutral })} />
  ];

  return (
    <div className='dashboard-table-container'>
      <div>
        <p className='table-heading'>{t('dashboard.parachain.relayers')}</p>
      </div>
      <DashboardTable
        pageData={relayers}
        headings={tableHeadings}
        dataPointDisplayer={relayersTableRow}
        noDataEl={<div>{t('dashboard.no-registered')}</div>} />
    </div>
  );
}
