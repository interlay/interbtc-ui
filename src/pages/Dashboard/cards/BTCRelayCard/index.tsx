import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import Ring64, { Ring64Title, Ring64Value } from '@/components/Ring64';
import { PAGES } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

enum Status {
  Loading,
  Ok,
  Failure
}

interface Props {
  hasLinks?: boolean;
}

const BTCRelayCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();
  // TODO: compute status using blockstream data
  const { btcRelayHeight, bitcoinHeight } = useSelector((state: StoreType) => state.general);

  const outdatedRelayThreshold = 12;
  const state =
    bitcoinHeight === 0
      ? Status.Loading
      : bitcoinHeight - btcRelayHeight >= outdatedRelayThreshold
      ? Status.Failure
      : Status.Ok;
  const statusText =
    state === Status.Loading
      ? t('loading')
      : state === Status.Ok
      ? t('dashboard.synchronized')
      : t('dashboard.not_synchronized');
  const graphText =
    state === Status.Loading ? t('loading') : state === Status.Ok ? t('dashboard.synced') : t('dashboard.out_of_sync');

  return (
    <DashboardCard>
      <Stats
        leftPart={
          <>
            <StatsDt>{t('dashboard.relay.relay_is')}</StatsDt>
            <StatsDd>
              <span
                className={clsx(
                  'font-bold',
                  { 'text-interlayPaleSky': state === Status.Loading },
                  { [getColorShade('green')]: state === Status.Ok },
                  { [getColorShade('red')]: state !== Status.Loading && state !== Status.Ok }
                )}
              >
                {statusText}
              </span>
            </StatsDd>
          </>
        }
        rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_RELAY}>View BTC Relay</StatsRouterLink>}</>}
      />
      <Ring64
        className={clsx(
          'mx-auto',
          { 'ring-interlayPaleSky': state === Status.Loading },
          { [getColorShade('green', 'ring')]: state === Status.Ok },
          { [getColorShade('red', 'ring')]: state !== Status.Loading && state !== Status.Ok }
        )}
      >
        <Ring64Title
          className={clsx(
            { 'text-interlayPaleSky': state === Status.Loading },
            { [getColorShade('green')]: state === Status.Ok },
            { [getColorShade('red')]: state !== Status.Loading && state !== Status.Ok }
          )}
        >
          {graphText}
        </Ring64Title>
        <Ring64Value>{t('dashboard.relay.block_number', { number: btcRelayHeight })}</Ring64Value>
      </Ring64>
    </DashboardCard>
  );
};

export default BTCRelayCard;
