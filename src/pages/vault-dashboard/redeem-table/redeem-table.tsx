import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { addVaultRedeemsAction } from '../../../common/actions/redeem.actions';
import { redeemRequestToVaultRedeem, shortAddress } from '../../../common/utils/utils';
import BitcoinAddress from '../../../common/components/bitcoin-links/address';
import { VaultRedeem } from '../../../common/types/redeem.types';
import { FaCheck, FaHourglass } from 'react-icons/fa';
import { Badge, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ID_TYPE_NAME } from '../../../constants';

export default function RedeemTable(): ReactElement {
  const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
  const redeems = useSelector((state: StoreType) => state.redeem.vaultRedeems);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const redeemMap = await window.polkaBTC.vaults.mapRedeemRequests(vaultId);

        if (!redeemMap) return;
        dispatch(addVaultRedeemsAction(redeemRequestToVaultRedeem(redeemMap)));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [polkaBtcLoaded, dispatch, address]);

  const showStatus = (request: VaultRedeem) => {
    if (request.completed) {
      return <FaCheck></FaCheck>;
    }
    if (request.cancelled) {
      return <Badge variant='secondary'>{t('cancelled')}</Badge>;
    }
    return <FaHourglass></FaHourglass>;
  };

  return (
    <div style={{ margin: '40px 0px' }}>
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: '26px'
          }}>
          {t('redeem_requests')}
        </p>
      </div>
      {redeems && redeems.length > 0 ? (
        <React.Fragment>
          <Table
            hover
            responsive
            size='md'>
            <thead>
              <tr>
                <th>{t('id')}</th>
                <th>{t('vault.creation_block')}</th>
                <th>{t('user')}</th>
                <th>{t('btc_address')}</th>
                <th>PolkaBTC</th>
                <th>DOT</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {redeems.map((redeem, index) => {
                return (
                  <tr key={index}>
                    <td>{redeem.id}</td>
                    <td>{redeem.timestamp}</td>
                    <td>{shortAddress(redeem.user)}</td>
                    <td>
                      <BitcoinAddress
                        btcAddress={redeem.btcAddress}
                        shorten />
                    </td>
                    <td>{redeem.polkaBTC}</td>
                    <td>{redeem.unlockedDOT}</td>
                    <td>{showStatus(redeem)}</td>
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
