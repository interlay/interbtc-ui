// ray test touch <<
import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreType } from '../../types/util.types';
import * as constants from '../../../constants';
import { reverseHashEndianness } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_BLOCK_API } from 'config/bitcoin';
import CardList, {
  CardListItem,
  CardListItemHeader,
  CardListItemContent,
  CardListContainerProps,
  CardListContainer,
  CardListHeader
} from 'components/CardList';
import clsx from 'clsx';

interface BlockInfo {
  height: string;
  hash: string;
}

export default function NetworkActivity({
  className,
  ...rest
}: CardListContainerProps): ReactElement {
  const [relayStatus, setStatus] = useState('Online');
  const [fork, setFork] = useState(false);
  const [noData, setNoData] = useState(false);
  const [heightDiff, setHeightDiff] = useState(0);
  const [parachainInfo, setParachainInfo] = useState<BlockInfo>({ height: '', hash: '' });
  const [coreInfo, setCoreInfo] = useState<BlockInfo>({ height: '', hash: '' });
  const bridgeLoaded = useSelector((state: StoreType) => state.general.bridgeLoaded);
  const { t } = useTranslation();

  useEffect(() => {
    /**
     * Checks for BTC-Relay status.
     * TODO: check parachain for invalid state
     * TODO: check parachain for ongoing fork
     */

    const getRelayStatus = (): string => {
      let status = 'Online';
      if (noData) {
        status = 'Unknown header';
      }
      if (fork) {
        status = 'Fork';
      }
      if (heightDiff > constants.BTC_RELAY_DELAY_CRITICAL) {
        status = `${constants.BTC_RELAY_DELAY_CRITICAL} blocks behind`;
      }
      return status;
    };

    const fetchData = async () => {
      if (!bridgeLoaded) return;

      // Returns a little endian encoded block hash
      // Converting to big endian for display
      const bestParachainBlock = reverseHashEndianness(await window.bridge.interBtcApi.btcRelay.getLatestBlock());
      const bestParachainHeight = Number(await window.bridge.interBtcApi.btcRelay.getLatestBlockHeight());

      let bestBitcoinBlock = '-';
      let bestBitcoinHeight = 0;

      try {
        // Returns a big endian encoded block hash
        bestBitcoinBlock = await window.bridge.interBtcApi.electrsAPI.getLatestBlock();
        bestBitcoinHeight = await window.bridge.interBtcApi.electrsAPI.getLatestBlockHeight();
      } catch (error) {
        // network error
      }

      // Check for NO_DATA, forks and height difference
      setNoData(bestBitcoinBlock !== bestParachainBlock && bestBitcoinHeight < bestParachainHeight);

      // TODO: get fork info from parachain. Not possible to check in UI.
      setFork(false);

      setHeightDiff(bestBitcoinHeight - bestParachainHeight);

      setStatus(getRelayStatus());

      setParachainInfo({
        hash: bestParachainBlock,
        height: bestParachainHeight.toString()
      });

      setCoreInfo({
        hash: bestBitcoinBlock,
        height: bestBitcoinHeight.toString()
      });
    };

    fetchData();
  }, [bridgeLoaded, noData, fork, heightDiff]);

  const getValueColor = (status: string): string => {
    if (status === 'Online') {
      return 'text-green-600';
    }
    if (status === 'Fork') {
      return 'text-orange-600';
    }
    return 'text-red-600';
  };

  const getHeightColor = (): string => {
    if (Math.abs(heightDiff) > constants.BTC_RELAY_DELAY_CRITICAL) {
      return 'text-red-500';
    }
    if (Math.abs(heightDiff) > constants.BTC_RELAY_DELAY_WARNING) {
      return 'text-orange-600';
    }
    return 'text-green-600';
  };

  const NETWORK_ACTIVITY_ITEMS = [
    {
      title: t('dashboard.relay.btc_relay'),
      value: relayStatus,
      color: 'text-gray-400',
      valueColor: getValueColor(relayStatus)
    },
    {
      title: t('dashboard.relay.parachain_block_height'),
      value: parachainInfo.height,
      link: BTC_BLOCK_API + parachainInfo.hash,
      color: 'text-gray-400',
      valueColor: getHeightColor()
    },
    {
      title: t('dashboard.relay.core_block_height'),
      value: coreInfo.height,
      link: BTC_BLOCK_API + coreInfo.hash,
      color: 'text-gray-400',
      valueColor: getHeightColor()
    }
  ];

  return (
    <CardListContainer
      className={className}
      {...rest}>
      <CardListHeader>Network Activity</CardListHeader>
      <CardList
        className={clsx(
          'lg:grid-cols-3',
          'gap-5'
        )}>
        {NETWORK_ACTIVITY_ITEMS.map(networkItem => (
          <CardListItem
            key={networkItem.title}>
            <CardListItemHeader className={networkItem.color}>
              {networkItem.title}
            </CardListItemHeader>
            <CardListItemContent
              className={clsx(
                'text-2xl',
                'font-medium',
                networkItem.valueColor)}>
              {networkItem.link ? (
                <InterlayLink
                  href={networkItem.link}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {/* TODO: update to arrow svg instead of underline after global path is setup  */}
                  <div className='underline'>
                    {networkItem.value}
                  </div>
                </InterlayLink>
              ) :
                <>
                  {networkItem.value}
                </>
              }
            </CardListItemContent>
          </CardListItem>
        ))}
      </CardList>
    </CardListContainer>
  );
}
// ray test touch >>
