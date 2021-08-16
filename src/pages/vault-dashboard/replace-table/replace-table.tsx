
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { StoreType } from 'common/types/util.types';
import { addReplaceRequestsAction } from 'common/actions/vault.actions';
import { shortAddress } from 'common/utils/utils';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { stripHexPrefix } from '@interlay/interbtc';

const ReplaceTable = (): JSX.Element => {
  const {
    polkaBtcLoaded,
    address
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const replaceRequests = useSelector((state: StoreType) => state.vault.requests);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!dispatch) return;
    if (!address) return;

    (async () => {
      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const requests = await window.polkaBTC.vaults.mapReplaceRequests(vaultId);
        if (!requests) return;

        dispatch(addReplaceRequestsAction(requests));
      } catch (error) {
        console.log('[ReplaceTable] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    dispatch,
    address
  ]);

  return (
    <div style={{ margin: '40px 0px' }}>
      <div>
        <p
          className='mb-4'
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('vault.replace_requests')}
        </p>
      </div>
      {replaceRequests && replaceRequests.size > 0 ? (
        <>
          <Table
            hover
            responsive
            size='md'>
            <thead>
              <tr>
                <th>{t('id')}</th>
                <th>{t('vault.creation_block')}</th>
                <th>{t('vault.old_vault')}</th>
                <th>{t('vault.new_vault')}</th>
                <th>{t('btc_address')}</th>
                <th>interBTC</th>
                <th>{t('griefing_collateral')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {[...replaceRequests.entries()].map(([id, redeem], index) => {
                return (
                  <tr key={index}>
                    <td>{stripHexPrefix(id.toString())}</td>
                    <td>{redeem.btcHeight}</td>
                    <td>{shortAddress(redeem.oldVault.toString())}</td>
                    <td>{shortAddress(redeem.newVault.toString())}</td>
                    <td>{shortAddress(redeem.btcAddress)}</td>
                    <td>{redeem.amount.toHuman()}</td>
                    <td>{redeem.collateral.toHuman()}</td>
                    <td>{redeem.status.isPending ?
                      t('pending') :
                      redeem.status.isCompleted ?
                        t('completed') :
                        redeem.status.isCancelled ?
                          t('cancelled') :
                          t('loading_ellipsis')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <>{t('empty_data')}</>
      )}
    </div>
  );
};

export default ReplaceTable;
