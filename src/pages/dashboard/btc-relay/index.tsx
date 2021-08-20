// ray test touch <<
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  reverseEndiannessHex,
  stripHexPrefix
} from '@interlay/interbtc';
import { BlockColumns } from '@interlay/interbtc-index-client';

import BtcRelay from '../components/btc-relay';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import DashboardTable, { StyledLinkData } from 'common/components/dashboard-table/dashboard-table';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { BTC_BLOCK_API } from 'config/bitcoin';
import { defaultTableDisplayParams, formatDateTimePrecise } from 'common/utils/utils';
import { RelayedBlock } from 'common/types/util.types';

const BTCRelay = (): JSX.Element => {
  const statsApi = useInterbtcIndex();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [blocks, setBlocks] = React.useState(new Array<RelayedBlock>());
  const [totalRelayedBlocks, setTotalRelayedBlocks] = React.useState(0);
  const [tableParams, setTableParams] = React.useState(defaultTableDisplayParams<BlockColumns>());

  React.useEffect(() => {
    if (!tableParams) return;
    if (!statsApi) return;

    (async () => {
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
        console.log('[RelayDashboard] error.message => ', error.message);
      }
    })();
  }, [
    tableParams,
    statsApi
  ]);

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

  const tableBlockRow = React.useMemo(
    () => (block: RelayedBlock): React.ReactElement[] => [
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

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.relay.btc_relay')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayCalifornia',
            'mt-2'
          )} />
      </div>
      <div className='grid grid-cols-2 gap-7'>
        <BtcRelay displayBlockstreamData />
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
};

export default BTCRelay;
// ray test touch >>
