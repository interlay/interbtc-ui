import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '@/common/utils/utils';
import Ring64, { Ring64Title, Ring64Value } from '@/legacy-components/Ring64';
import { PAGES } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';
import { useGetBtcBlockHeight } from '@/utils/hooks/api/use-get-btc-block-height';

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
  const { data: blockHeight } = useGetBtcBlockHeight();

  const state = blockHeight ? (blockHeight.isOutdated ? Status.Failure : Status.Ok) : Status.Loading;

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
        <Ring64Value>
          {t('dashboard.relay.block_number', { number: formatNumber(blockHeight?.relay || 0) })}
        </Ring64Value>
      </Ring64>
    </DashboardCard>
  );
};

export default BTCRelayCard;
