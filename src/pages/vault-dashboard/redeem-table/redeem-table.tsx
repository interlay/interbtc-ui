import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType } from 'common/types/util.types';
import { shortAddress } from 'common/utils/utils';
import BitcoinAddress from 'common/components/bitcoin-links/address';
import { FaCheck, FaHourglass } from 'react-icons/fa';
import { Badge, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ID_TYPE_NAME } from '../../../constants';
import { RedeemRequest, RedeemRequestStatus } from 'common/types/redeem.types';
import { parachainToUIRedeemRequest } from 'common/utils/requests';

export default function RedeemTable(): ReactElement {
  const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
  const [redeemRequests, setRedeemRequests] = useState<Array<RedeemRequest>>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const [parachainHeight, issuePeriod, requiredBtcConfirmations, redeemMap] = await Promise.all([
          window.polkaBTC.system.getCurrentBlockNumber(),
          window.polkaBTC.issue.getIssuePeriod(),
          window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
          window.polkaBTC.vaults.mapRedeemRequests(vaultId)
        ]);

        if (!redeemMap) return;

        const redeemRequests: Array<RedeemRequest> = [];

        redeemMap.forEach(async (request, id) => {
          redeemRequests.push(
            await parachainToUIRedeemRequest(id, request, parachainHeight, issuePeriod, requiredBtcConfirmations)
          );
        });

        setRedeemRequests(redeemRequests);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [polkaBtcLoaded, dispatch, address]);

  const showStatus = (status: RedeemRequestStatus) => {
    switch (status) {
    case RedeemRequestStatus.Completed:
      return <FaCheck />;
    case RedeemRequestStatus.Expired:
    case RedeemRequestStatus.Reimbursed:
    case RedeemRequestStatus.Retried:
      return <Badge variant='secondary'>{t('cancelled')}</Badge>;
    default:
      return <FaHourglass />;
    }
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
      {redeemRequests && redeemRequests.length > 0 ? (
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
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {redeemRequests.map((redeem, index) => {
                return (
                  <tr key={index}>
                    <td>{redeem.id}</td>
                    <td>{redeem.timestamp}</td>
                    <td>{shortAddress(redeem.userDOTAddress)}</td>
                    <td>
                      <BitcoinAddress
                        btcAddress={redeem.userBTCAddress}
                        shorten />
                    </td>
                    <td>{redeem.amountPolkaBTC}</td>
                    <td>{showStatus(redeem.status)}</td>
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
