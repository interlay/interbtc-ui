import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import DashboardCard from '../DashboardCard';
import Stats, { StatsRouterLink } from '../../Stats';
import Ring64, { Ring64Title, Ring64Value } from 'components/Ring64';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import { ParachainStatus, StoreType } from 'common/types/util.types';

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
          { 'ring-interlayConifer': parachainStatus === ParachainStatus.Running },
          {
            'ring-interlayCalifornia':
              parachainStatus === ParachainStatus.Error || parachainStatus === ParachainStatus.Shutdown
          }
        )}
      >
        <Ring64Title
          className={clsx(
            { 'text-interlayPaleSky': parachainStatus === ParachainStatus.Loading },
            { 'text-interlayConifer': parachainStatus === ParachainStatus.Running },
            {
              'text-interlayCalifornia':
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
