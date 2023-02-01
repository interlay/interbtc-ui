import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import Ring64, { Ring64Title, Ring64Value } from '@/legacy-components/Ring64';
import { PAGES } from '@/utils/constants/links';
import { getColorShade } from '@/utils/helpers/colors';

import Stats, { StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

interface Props {
  hasLinks?: boolean;
}

const ParachainSecurityCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  const getParachainStatusText = () => {
    switch (parachainStatus) {
      case ParachainStatus.Running:
        return t('dashboard.parachain.secure');
      case ParachainStatus.Loading:
        return t('loading');
      case ParachainStatus.Error:
      case ParachainStatus.Shutdown:
        return t('dashboard.parachain.halted');
      default:
        return t('no_data');
    }
  };

  return (
    <DashboardCard>
      <Stats
        rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_PARACHAIN}>Status updates</StatsRouterLink>}</>}
      />
      <Ring64
        className={clsx(
          'mx-auto',
          { 'ring-interlayPaleSky': parachainStatus === ParachainStatus.Loading },
          { [getColorShade('green', 'ring')]: parachainStatus === ParachainStatus.Running },
          {
            [getColorShade('yellow', 'ring')]:
              parachainStatus === ParachainStatus.Error || parachainStatus === ParachainStatus.Shutdown
          }
        )}
      >
        <Ring64Title
          className={clsx(
            { 'text-interlayPaleSky': parachainStatus === ParachainStatus.Loading },
            { [getColorShade('green')]: parachainStatus === ParachainStatus.Running },
            {
              [getColorShade('yellow')]:
                parachainStatus === ParachainStatus.Error || parachainStatus === ParachainStatus.Shutdown
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
