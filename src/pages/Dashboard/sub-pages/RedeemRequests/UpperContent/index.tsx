import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import clsx from 'clsx';
import { BitcoinUnit } from '@interlay/monetary-js';

import RedeemedChart from './RedeemedChart';
import Stats, { StatsDt, StatsDd } from '../../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import Panel from 'components/Panel';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { StoreType } from 'common/types/util.types';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import redeemCountQuery from 'services/queries/redeem-count-query';
import cumulativeVolumesFetcher, {
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from 'services/fetchers/cumulative-volumes-fetcher';
import { WRAPPED_TOKEN } from 'config/relay-chains';

const nowAtFirstLoad = new Date();

const UpperContent = (): JSX.Element => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalSuccessfulRedeemsIdle,
    isLoading: totalSuccessfulRedeemsLoading,
    data: totalSuccessfulRedeems,
    error: totalSuccessfulRedeemsError
  } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, redeemCountQuery('status_eq: Completed')],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(totalSuccessfulRedeemsError);

  const {
    isIdle: cumulativeRedeemsPerDayIdle,
    isLoading: cumulativeRedeemsPerDayLoading,
    data: cumulativeRedeemsPerDay,
    error: cumulativeRedeemsPerDayError
    // TODO: should type properly (`Relay`)
  } = useQuery<VolumeDataPoint<BitcoinUnit>[], Error>(
    [CUMULATIVE_VOLUMES_FETCHER, VolumeType.Redeemed, [nowAtFirstLoad], WRAPPED_TOKEN],
    cumulativeVolumesFetcher
  );
  useErrorHandler(cumulativeRedeemsPerDayError);

  // TODO: should use skeleton loaders
  if (
    totalSuccessfulRedeemsIdle ||
    totalSuccessfulRedeemsLoading ||
    cumulativeRedeemsPerDayIdle ||
    cumulativeRedeemsPerDayLoading
  ) {
    return <>Loading...</>;
  }
  if (cumulativeRedeemsPerDay === undefined) {
    throw new Error('Something went wrong!');
  }
  if (totalSuccessfulRedeems === undefined) {
    throw new Error('Something went wrong!');
  }
  const totalSuccessfulRedeemCount = totalSuccessfulRedeems.data.redeemsConnection.totalCount;
  const totalRedeemedAmount = cumulativeRedeemsPerDay[0].amount;

  // TODO: add this again when the network is stable
  // const redeemSuccessRate = totalSuccessfulRedeems / totalRedeemRequests;

  return (
    <Panel className={clsx('grid', 'sm:grid-cols-2', 'gap-5', 'px-4', 'py-5')}>
      <Stats
        leftPart={
          <>
            <StatsDt
              className={clsx(
                { '!text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:!text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('dashboard.redeem.total_redeemed')}
            </StatsDt>
            <StatsDd>
              {totalRedeemedAmount.str.BTC()}
              &nbsp;BTC
            </StatsDd>
            <StatsDd>
              {/* eslint-disable-next-line max-len */}$
              {prices.bitcoin === undefined
                ? '—'
                : (prices.bitcoin.usd * Number(totalRedeemedAmount.str.BTC())).toLocaleString()}
            </StatsDd>
            <StatsDt className='!text-interlayConifer'>{t('dashboard.redeem.total_redeems')}</StatsDt>
            <StatsDd>{totalSuccessfulRedeemCount}</StatsDd>
            {/* TODO: add this again when the network is stable */}
            {/* <StatsDt className='!text-interlayConifer'>
              {t('dashboard.redeem.success_rate')}
            </StatsDt>
            <StatsDd>
              {totalRedeemRequests ? (redeemSuccessRate * 100).toFixed(2) + '%' : t('no_data')}
            </StatsDd> */}
          </>
        }
      />
      <RedeemedChart />
    </Panel>
  );
};

export default withErrorBoundary(UpperContent, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
