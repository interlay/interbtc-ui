import { useState, useEffect, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  reverseEndiannessHex,
  stripHexPrefix
} from '@interlay/interbtc';

import useInterbtcIndex from '../../../common/hooks/use-interbtc-index';
import { defaultTableDisplayParams, formatDateTimePrecise } from '../../../common/utils/utils';
import { RelayedBlock } from '../../../common/types/util.types';
import DashboardTable, { StyledLinkData } from '../../../common/components/dashboard-table/dashboard-table';
import { BTC_BLOCK_API } from 'config/bitcoin';
import BtcRelay from '../components/btc-relay';
import { BlockColumns } from '@interlay/interbtc-index-client';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

export default function RelayDashboard(): ReactElement {
  const statsApi = useInterbtcIndex();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [blocks, setBlocks] = useState(new Array<RelayedBlock>());
  const [totalRelayedBlocks, setTotalRelayedBlocks] = useState(0);
  const [tableParams, setTableParams] = useState(defaultTableDisplayParams<BlockColumns>());

  const fetchBlocks = useMemo(
    () => async () => {
      try {
        const [
          blocks,
          totalRelayedBlocksCount
        ] = await Promise.all([
          statsApi.getBlocks(tableParams),
          statsApi.getTotalRelayedBlocksCount()
        ]);
        setBlocks(blocks);
        setTotalRelayedBlocks(Number(totalRelayedBlocksCount));
      } catch (error) {
        console.log('[RelayDashboard fetchBlocks] error.message => ', error.message);
      }
    },
    [tableParams, statsApi]
  );

  const tableHeadings = [
    <h1
      className='opacity-30'
      key={1}>
      {t('dashboard.relay.block_height')}
    </h1>,
    <h1
      className='opacity-30'
      key={2}>
      {t('dashboard.relay.block_hash')}
    </h1>,
    <h1
      className='opacity-30'
      key={3}>
      {t('dashboard.relay.timestamp')}
    </h1>
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
        'fade-in-animation',
        'space-y-10',
        'container',
        'm-auto'
      )}>
      <div>
        <PageTitle
          mainTitle={t('dashboard.relay.btc_relay')}
          subTitle={<TimerIncrement />} />
        <hr className='border-interlayCalifornia' />
      </div>
      <div className='grid grid-cols-2 gap-7'>
        <BtcRelay displayBlockstreamData={true} />
      </div>
      <div>
        <p
          className='mb-4'
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.relay.blocks')}
        </p>
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
    </MainContainer>
  );
}
