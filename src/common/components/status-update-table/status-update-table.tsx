import React, { ReactElement, useEffect, useState } from 'react';
import { StoreType } from '../../types/util.types';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { StatusUpdate } from '../../types/util.types';
import MessageModal from '../../../pages/staked-relayer/message-modal/message-modal';
import BitcoinBlockHash from '../bitcoin-links/block-hash';
import { reverseHashEndianness } from '../../utils/utils';
import { useTranslation } from 'react-i18next';

const ADD_DATA_ERROR = 'Add NO_DATA error';
const REMOVE_DATA_ERROR = 'Remove NO_DATA error';

interface Option<T> {
  isNone: boolean;
  unwrap(): T;
}

interface ErrorCode {
  toString(): string;
}

function displayBlockHash(option: Option<Uint8Array>): string {
  return option.isNone ? 'None' : reverseHashEndianness(option.unwrap());
}

function displayProposedChanges(addError: Option<ErrorCode>, removeError: Option<ErrorCode>): string {
  return addError.isNone ?
    removeError.isNone ?
      '-' :
      removeError.unwrap().toString() :
    addError.unwrap().toString();
}

type StatusUpdateTableProps = {
  dotLocked: string;
  planckLocked?: string;
  stakedRelayerAddress?: string;
  readOnly?: boolean;
};

export default function StatusUpdateTable(props: StatusUpdateTableProps): ReactElement {
  const [parachainStatus, setStatus] = useState('Running');
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
  const [statusUpdates, setStatusUpdates] = useState<Array<StatusUpdate>>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const handleClose = () => {
    setShowMessageModal(false);
  };
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate>();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!polkaBtcLoaded) return;

      // TODO: replace with state item
      const result = await window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
      setStatus(result.isRunning ? 'Running' : result.isError ? 'Error' : 'Shutdown');
    };

    const fetchUpdates = async () => {
      if (!polkaBtcLoaded) return;

      const statusUpdates = await (props.readOnly ?
        window.polkaBTC.stakedRelayer.getAllActiveStatusUpdates() :
        window.polkaBTC.stakedRelayer.getAllStatusUpdates());

      // sort in descending order by id (newest shown first)
      statusUpdates.sort((right, left) => {
        return left.id.eq(right.id) ? 0 : left.id.gt(right.id) ? 1 : -1;
      });

      setStatusUpdates(
        statusUpdates.map(status => {
          const { id, statusUpdate } = status;

          return {
            id,
            timestamp: statusUpdate.end.toString(),
            proposedStatus: statusUpdate.new_status_code.toString(),
            currentStatus: statusUpdate.old_status_code.toString(),
            proposedChanges: displayProposedChanges(statusUpdate.add_error, statusUpdate.remove_error),
            blockHash: displayBlockHash(statusUpdate.btc_block_hash),
            aye_vote_stake: statusUpdate.tally.aye.total_stake.toString(),
            nay_vote_stake: statusUpdate.tally.nay.total_stake.toString(),
            result: statusUpdate.proposal_status.toString(),
            proposer: statusUpdate.proposer.toString(),
            message: statusUpdate.message.toString()
          };
        })
      );
    };

    fetchStatus();
    fetchUpdates();
  }, [polkaBtcLoaded, props.stakedRelayerAddress, props.readOnly]);

  const openMessageModal = (statusUpdate: StatusUpdate) => {
    setShowMessageModal(true);
    setStatusUpdate(statusUpdate);
  };

  const getResultColor = (result: string): string => {
    switch (result) {
    case 'Accepted':
      return 'green-text';
    case 'Rejected':
      return 'red-text';
    default:
      return '';
    }
  };

  const getCircle = (status: string): string => {
    switch (status) {
    case 'Running':
      return 'green-circle';
    case 'Error':
      return 'yellow-circle';
    default:
      return 'red-circle';
    }
  };

  const getProposedChangesColor = (changes: string): string => {
    switch (changes) {
    case ADD_DATA_ERROR:
      return 'orange-text';
    case REMOVE_DATA_ERROR:
      return 'green-text';
    default:
      return 'red-text';
    }
  };

  return (
    <div
      style={{ margin: '40px 0px' }}
      className='btc-parachain-table'>
      <MessageModal
        show={showMessageModal}
        onClose={handleClose}
        statusUpdate={statusUpdate!} />
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('dashboard.parachain.parachain')}
        </p>
        <div className='header'>
          {t('status_colon')} &nbsp; <div className={getCircle(parachainStatus)}></div> &nbsp;{' '}
          {parachainStatus}
        </div>
        <Table
          hover
          responsive
          size='md'>
          <thead>
            <tr>
              <th>{t('id')}</th>
              <th>{t('expiration')}</th>
              <th>{t('proposed_status')}</th>
              <th>{t('current_status')}</th>
              <th>{t('proposed_changes')}</th>
              <th>{t('btc_block_hash')}</th>
              <th>{t('votes_yes_no')}</th>
              <th>{t('result')}</th>
            </tr>
          </thead>
          {statusUpdates && statusUpdates.length ? (
            <tbody>
              {statusUpdates.map((statusUpdate, index) => {
                return (
                  <tr key={index}>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => openMessageModal(statusUpdate)}>
                      {statusUpdate.id.toString()}
                    </td>
                    <td>{statusUpdate.timestamp}</td>
                    <td
                      className={
                        statusUpdate.proposedStatus === 'Running' ? 'green-text' : 'orange-text'
                      }>
                      {statusUpdate.proposedStatus}
                    </td>
                    <td>{statusUpdate.currentStatus}</td>
                    <td className={getProposedChangesColor(statusUpdate.proposedChanges)}>
                      {statusUpdate.proposedChanges}
                    </td>
                    <td className='break-words'>
                      <BitcoinBlockHash blockHash={statusUpdate.blockHash} />
                    </td>
                    <td>
                      <React.Fragment>
                        <p>
                          <span className='green-text'>{statusUpdate.aye_vote_stake}</span>
                          <span> : </span>
                          <span className='red-text'>{statusUpdate.nay_vote_stake}</span>
                        </p>
                      </React.Fragment>
                    </td>
                    <td className={getResultColor(statusUpdate.result)}>{statusUpdate.result}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={8}>{t('no_pending_status')}</td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
}
