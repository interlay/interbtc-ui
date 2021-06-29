import { useState, useEffect, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';
import { defaultTableDisplayParams, formatDateTimePrecise } from '../../../common/utils/utils';
import { RelayedBlock } from '../../../common/types/util.types';
import DashboardTable, { StyledLinkData } from '../../../common/components/dashboard-table/dashboard-table';
import { BTC_BLOCK_API } from 'config/bitcoin';
import BtcRelay from '../components/btc-relay';
import { reverseEndiannessHex, stripHexPrefix } from '@interlay/polkabtc';
import { BlockColumns } from '@interlay/interbtc-stats-client';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

export default function RelayDashboard(): ReactElement {
  const statsApi = usePolkabtcStats();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [blocks, setBlocks] = useState(new Array<RelayedBlock>());
  const [totalRelayedBlocks, setTotalRelayedBlocks] = useState(0);
  const [tableParams, setTableParams] = useState(defaultTableDisplayParams<BlockColumns>());

  const fetchBlocks = useMemo(
    () => async () => {
      try {
        const [blocks, totalRelayedBlocks] = await Promise.all([
          statsApi.getBlocks(tableParams),
          statsApi.getTotalRelayedBlocksCount()
        ]);
        setBlocks(blocks);
        setTotalRelayedBlocks(Number(totalRelayedBlocks));
      } catch (error) {
        console.log('Error fetching btc-relay data.');
        console.log('error.message => ', error.message);
      }
    },
    [tableParams, statsApi]
  );

  const tableHeadings = [
    <h1 key={1}>{t('dashboard.relay.block_height')}</h1>,
    <h1 key={2}>{t('dashboard.relay.block_hash')}</h1>,
    <h1 key={3}>{t('dashboard.relay.timestamp')}</h1>
  ];

  const tableBlockRow = useMemo(
    () => (block: RelayedBlock): ReactElement[] => [
      <p key={1}>{block.height}</p>,
      <StyledLinkData
        key={2}
        data={block.hash}
        target={BTC_BLOCK_API + block.hash}
        newTab={true} />,
      <p key={3}>{formatDateTimePrecise(new Date(block.relayTs))}</p>
    ],
    []
  );

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks, tableParams]);

  return (
    <MainContainer
      className={clsx(
        'flex',
        'justify-center',
        'fade-in-animation'
      )}>
      <div className='w-3/4'>
        <div>
          <PageTitle
            mainTitle={t('dashboard.relay.btc_relay')}
            subTitle={<TimerIncrement />} />
          <hr className='border-interlayOrangePeel' />
          <div className='dashboard-graphs-container'>
            <div className='relay-grid-container'>
              <BtcRelay displayBlockstreamData={true} />
            </div>
          </div>
          <div style={{ margin: '40px 0px' }}>
            <div>
              <p
                className='mb-4'
                style={{
                  fontWeight: 700,
                  fontSize: '26px'
                }}>
                {t('dashboard.relay.blocks')}
              </p>
            </div>
            <DashboardTable
              richTable={true}
              pageData={blocks.map(b => ({
                ...b,
                hash: reverseEndiannessHex(stripHexPrefix(b.hash)),
                id: b.hash
              }))}
              totalPages={Math.ceil(totalRelayedBlocks / tableParams.perPage)}
              tableParams={tableParams}
              setTableParams={setTableParams}
              headings={tableHeadings}
              dataPointDisplayer={tableBlockRow} />
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
