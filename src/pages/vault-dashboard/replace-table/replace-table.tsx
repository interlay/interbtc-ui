import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { StoreType } from 'common/types/util.types';
import { addReplaceRequestsAction } from 'common/actions/vault.actions';
import { parachainToUIReplaceRequests } from 'common/utils/requests';
import { shortAddress } from 'common/utils/utils';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

export default function ReplaceTable(): ReactElement {
  const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const replaceRequests = useSelector((state: StoreType) => state.vault.requests);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const requests = await window.polkaBTC.vaults.mapReplaceRequests(vaultId);
        if (!requests) return;

        dispatch(addReplaceRequestsAction(parachainToUIReplaceRequests(requests)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [polkaBtcLoaded, dispatch, address]);

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
      {replaceRequests && replaceRequests.length > 0 ? (
        <React.Fragment>
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
              {replaceRequests.map((redeem, index) => {
                return (
                  <tr key={index}>
                    <td>{redeem.id}</td>
                    <td>{redeem.timestamp}</td>
                    <td>{shortAddress(redeem.oldVault)}</td>
                    <td>{shortAddress(redeem.newVault)}</td>
                    <td>{shortAddress(redeem.btcAddress)}</td>
                    <td>{redeem.polkaBTC}</td>
                    <td>{redeem.lockedDOT}</td>
                    <td>{redeem.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </React.Fragment>
      ) : (
        <React.Fragment>{t('empty_data')}</React.Fragment>
      )}
    </div>
  );
}
