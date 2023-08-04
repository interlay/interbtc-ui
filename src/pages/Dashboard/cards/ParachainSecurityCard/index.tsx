import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import Ring64, { Ring64Title, Ring64Value } from '@/legacy-components/Ring64';
import { PAGES } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';
import { useGetParachainStatus } from '@/utils/hooks/api/system/use-get-parachain-status';

import Stats, { StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

interface Props {
  hasLinks?: boolean;
}

const ParachainSecurityCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { data: parachainStatus, isLoading } = useGetParachainStatus();

  const getParachainStatusText = () => {
    if (!parachainStatus && !isLoading) {
      return t('no_data');
    }

    if (!parachainStatus || isLoading) {
      return t('loading');
    }

    if (parachainStatus.isError || parachainStatus.isShutdown) {
      return t('dashboard.parachain.halted');
    }

    return t('dashboard.parachain.secure');
  };

  return (
    <DashboardCard>
      <Stats
        rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_PARACHAIN}>Status updates</StatsRouterLink>}</>}
      />
      <Ring64
        className={clsx(
          'mx-auto',
          { 'ring-interlayPaleSky': isLoading },
          { [getColorShade('green', 'ring')]: parachainStatus?.isRunning },
          {
            [getColorShade('yellow', 'ring')]: parachainStatus?.isError || parachainStatus?.isShutdown
          }
        )}
      >
        <Ring64Title
          className={clsx(
            { 'text-interlayPaleSky': isLoading },
            { [getColorShade('green')]: parachainStatus?.isRunning },
            {
              [getColorShade('yellow')]: parachainStatus?.isError || parachainStatus?.isShutdown
            }
          )}
        >
          {getParachainStatusText()}
        </Ring64Title>
        <Ring64Value>
          {t('dashboard.parachain.parachain_is', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </Ring64Value>
      </Ring64>
    </DashboardCard>
  );
};

export default ParachainSecurityCard;
