import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import ErrorFallback from '@/components/ErrorFallback';
import Panel from '@/components/Panel';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import cumulativeVolumesFetcher, {
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from '@/services/fetchers/cumulative-volumes-fetcher';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import redeemCountQuery from '@/services/queries/redeem-count-query';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import Stats, { StatsDd, StatsDt } from '../../../Stats';
import RedeemedChart from './RedeemedChart';

const nowAtFirstLoad = new Date();

const UpperContent = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const btcUsdPrice = getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd;

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
  } = useQuery<VolumeDataPoint[], Error>(
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
              {totalRedeemedAmount.toString()}
              &nbsp;BTC
            </StatsDd>
            <StatsDd>
              {btcUsdPrice === undefined
                ? '—'
                : (btcUsdPrice * Number(totalRedeemedAmount.toString())).toLocaleString()}
            </StatsDd>
            <StatsDt className={`!${getColorShade('green')}`}>{t('dashboard.redeem.total_redeems')}</StatsDt>
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
