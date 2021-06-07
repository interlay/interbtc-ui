import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreType } from '../../types/util.types';
import * as constants from '../../../constants';
import { reverseHashEndianness } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import InterlayLink from 'components/UI/InterlayLink';
import { BTC_BLOCK_API } from 'config/bitcoin';

interface BlockInfo {
  source: string;
  height: string;
  hash: string;
}

export default function BitcoinTable(): ReactElement {
  const [relayStatus, setStatus] = useState('Online');
  const [fork, setFork] = useState(false);
  const [noData, setNoData] = useState(false);
  const [heightDiff, setHeightDiff] = useState(0);
  const [btcBlocks, setBlocks] = useState<Array<BlockInfo>>([]);
  const interBtcLoaded = useSelector((state: StoreType) => state.general.interBtcLoaded);
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
        status = 'More than ' + constants.BTC_RELAY_DELAY_CRITICAL + ' blocks behind.';
      }
      return status;
    };

    const fetchData = async () => {
      if (!interBtcLoaded) return;

      // Returns a little endian encoded block hash
      // Converting to big endian for display
      const bestParachainBlock = reverseHashEndianness(await window.interBTC.btcRelay.getLatestBlock());
      const bestParachainHeight = Number(await window.interBTC.btcRelay.getLatestBlockHeight());

      let bestBitcoinBlock = '-';
      let bestBitcoinHeight = 0;

      try {
        // Returns a big endian encoded block hash
        bestBitcoinBlock = await window.interBTC.electrsAPI.getLatestBlock();
        bestBitcoinHeight = await window.interBTC.electrsAPI.getLatestBlockHeight();
      } catch (error) {
        // network error
      }

      // Check for NO_DATA, forks and height difference
      setNoData(bestBitcoinBlock !== bestParachainBlock && bestBitcoinHeight < bestParachainHeight);

      // TODO: get fork info from parachain. Not possible to check in UI.
      setFork(false);

      setHeightDiff(bestBitcoinHeight - bestParachainHeight);

      setStatus(getRelayStatus());
      setBlocks([
        {
          source: 'BTC Parachain',
          hash: bestParachainBlock,
          height: bestParachainHeight.toString()
        },
        {
          source: 'Bitcoin Core',
          hash: bestBitcoinBlock,
          height: bestBitcoinHeight.toString()
        }
      ]);
    };

    fetchData();
  }, [interBtcLoaded, noData, fork, heightDiff]);

  const getCircle = (status: string): string => {
    if (status === 'Online') {
      return 'green-circle';
    }
    if (status === 'Fork') {
      return 'orange-circle';
    }
    return 'red-circle';
  };

  const getHeightColor = (): string => {
    if (Math.abs(heightDiff) > constants.BTC_RELAY_DELAY_CRITICAL) {
      return 'red-text';
    }
    if (Math.abs(heightDiff) > constants.BTC_RELAY_DELAY_WARNING) {
      return 'orange-text';
    }
    return 'green-text';
  };

  return (
    <div style={{ margin: '40px 0px' }}>
      <div>
        <p
          className='mb-4'
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.relay.btc_relay')}
        </p>
        <div className='header'>
          {t('status_colon')} &nbsp; <div className={getCircle(relayStatus)}></div> &nbsp; {relayStatus}
        </div>
      </div>
      <Table
        hover
        responsive
        size='md'>
        <thead>
          <tr>
            <th>{t('source')}</th>
            <th>{t('best_block_hash')}</th>
            <th>{t('best_block_height')}</th>
          </tr>
        </thead>
        <tbody>
          {btcBlocks.map((block, index) => {
            return (
              <tr key={index}>
                <td>{block.source}</td>
                <td>
                  <InterlayLink
                    href={BTC_BLOCK_API + block.hash}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {block.hash}
                  </InterlayLink>
                </td>
                <td className={getHeightColor()}>{block.height}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
