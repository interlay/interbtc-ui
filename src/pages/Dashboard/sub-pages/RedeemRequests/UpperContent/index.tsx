
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import clsx from 'clsx';
import { BitcoinAmount } from '@interlay/monetary-js';

import RedeemedChart from './RedeemedChart';
import Stats, {
  StatsDt,
  StatsDd
} from '../../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import Panel from 'components/Panel';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const UpperContent = (): JSX.Element => {
  const {
    bridgeLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalSuccessfulRedeemsIdle,
    isLoading: totalSuccessfulRedeemsLoading,
    data: totalSuccessfulRedeems,
    error: totalSuccessfulRedeemsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalSuccessfulRedeems'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalSuccessfulRedeemsError);

  const {
    isIdle: totalRedeemedAmountIdle,
    isLoading: totalRedeemedAmountLoading,
    data: totalRedeemedAmount,
    error: totalRedeemedAmountError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalRedeemedAmount'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalRedeemedAmountError);

  // TODO: should use skeleton loaders
  if (totalSuccessfulRedeemsIdle || totalSuccessfulRedeemsLoading) {
    return <>Loading...</>;
  }
  if (totalRedeemedAmountIdle || totalRedeemedAmountLoading) {
    return <>Loading...</>;
  }
  if (totalRedeemedAmount === undefined) {
    throw new Error('Something went wrong!');
  }

  // TODO: add this again when the network is stable
  // const redeemSuccessRate = totalSuccessfulRedeems / totalRedeemRequests;

  return (
    <Panel
      className={clsx(
        'grid',
        'sm:grid-cols-2',
        'gap-5',
        'px-4',
        'py-5'
      )}>
      <Stats
        leftPart={
          <>
            <StatsDt
              className={clsx(
                { '!text-interlayDenim':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
                { 'dark:!text-kintsugiMidnight':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}>
              {t('dashboard.redeem.total_redeemed')}
            </StatsDt>
            <StatsDd>
              {BitcoinAmount.from.Satoshi(totalRedeemedAmount).str.BTC()}
              &nbsp;BTC
            </StatsDd>
            <StatsDd>
              {/* eslint-disable-next-line max-len */}
              ${(prices.bitcoin.usd * Number(BitcoinAmount.from.Satoshi(totalRedeemedAmount).str.BTC())).toLocaleString()}
            </StatsDd>
            <StatsDt className='!text-interlayConifer'>
              {t('dashboard.redeem.total_redeems')}
            </StatsDt>
            <StatsDd>
              {totalSuccessfulRedeems}
            </StatsDd>
            {/* TODO: add this again when the network is stable */}
            {/* <StatsDt className='!text-interlayConifer'>
              {t('dashboard.redeem.success_rate')}
            </StatsDt>
            <StatsDd>
              {totalRedeemRequests ? (redeemSuccessRate * 100).toFixed(2) + '%' : t('no_data')}
            </StatsDd> */}
          </>
        } />
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
