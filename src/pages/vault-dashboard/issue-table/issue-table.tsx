import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { shortAddress } from '../../../common/utils/utils';
import BitcoinAddress from '../../../common/components/bitcoin-links/address';
import { FaCheck, FaHourglass } from 'react-icons/fa';
import { Badge, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { IssueRequest, IssueRequestStatus } from 'common/types/issue.types';
import { parachainToUIIssueRequest } from 'common/utils/requests';

export default function IssueTable(): ReactElement {
  const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
  const [issueRequests, setIssueRequests] = useState<Array<IssueRequest>>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const [parachainHeight, issuePeriod, requiredBtcConfirmations, issueMap] = await Promise.all([
          window.polkaBTC.system.getCurrentBlockNumber(),
          window.polkaBTC.issue.getIssuePeriod(),
          window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
          window.polkaBTC.vaults.mapIssueRequests(vaultId)
        ]);

        if (!issueMap) return;

        const issueRequests: Array<IssueRequest> = [];

        issueMap.forEach(async (request, id) => {
          issueRequests.push(
            await parachainToUIIssueRequest(id, request, parachainHeight, issuePeriod, requiredBtcConfirmations)
          );
        });

        setIssueRequests(issueRequests);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [polkaBtcLoaded, dispatch, address]);

  const showStatus = (status: IssueRequestStatus) => {
    if (status === IssueRequestStatus.Completed) {
      return <FaCheck />;
    }
    if (status === IssueRequestStatus.Cancelled) {
      return (
        <Badge
          className='badge-style'
          variant='secondary'>
          {t('cancelled')}
        </Badge>
      );
    }
    return <FaHourglass />;
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
          {t('issue_requests')}
        </p>
      </div>
      {issueRequests && issueRequests.length > 0 ? (
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
                <th>{t('griefing_collateral')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {issueRequests.map((issue, index) => {
                return (
                  <tr key={index}>
                    <td>{issue.id}</td>
                    <td>{issue.timestamp}</td>
                    <td>{shortAddress(issue.userDOTAddress)}</td>
                    <td>
                      <BitcoinAddress
                        btcAddress={issue.vaultBTCAddress}
                        shorten />
                    </td>
                    <td>{issue.totalAmount}</td>
                    <td>{issue.griefingCollateral}</td>
                    <td>{showStatus(issue.status)}</td>
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
