
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { H256 } from '@polkadot/types/interfaces';
import clsx from 'clsx';
import {
  stripHexPrefix,
  ReplaceRequestExt
} from '@interlay/interbtc-api';

import ErrorFallback from 'components/ErrorFallback';
import EllipsisLoader from 'components/EllipsisLoader';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
import {
  shortAddress,
  displayMonetaryAmount
} from 'common/utils/utils';

const ReplaceTable = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    bridgeLoaded,
    address
  } = useSelector((state: StoreType) => state.general);

  const vaultId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);
  const {
    isIdle: replaceRequestsIdle,
    isLoading: replaceRequestsLoading,
    data: replaceRequests,
    error: replaceRequestsError
  } = useQuery<Map<H256, ReplaceRequestExt>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'replace',
      'mapReplaceRequests',
      vaultId
    ],
    genericFetcher<Map<H256, ReplaceRequestExt>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(replaceRequestsError);

  if (
    replaceRequestsIdle ||
    replaceRequestsLoading
  ) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
      </div>
    );
  }
  if (replaceRequests === undefined) {
    throw new Error('Something went wrong!');
  }

  // ray test touch <<
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
      {replaceRequests.size > 0 ? (
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
                    <td>{displayMonetaryAmount(redeem.amount)}</td>
                    <td>{displayMonetaryAmount(redeem.collateral)}</td>
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
  // ray test touch >>
};

export default withErrorBoundary(ReplaceTable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
