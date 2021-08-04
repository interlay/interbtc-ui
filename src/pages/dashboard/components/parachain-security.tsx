import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { ParachainStatus, StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import clsx from 'clsx';

type ParachainSecurityProps = {
  linkButton?: boolean;
};

const ParachainSecurity = ({ linkButton }: ParachainSecurityProps): React.ReactElement => {
  const { t } = useTranslation();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);

  const parachainState = () => {
    switch (parachainStatus) {
    case ParachainStatus.Running:
      return (
        <span
          id='parachain-text'
          className='font-bold text-interlayConifer'>
          {t('dashboard.parachain.secure')}
        </span>

      );
    case ParachainStatus.Loading:
      return (
        <span
          id='parachain-text'
          className='font-bold text-interlayPaleSky'>
          {t('loading')}
        </span>

      );
    case ParachainStatus.Error:
    case ParachainStatus.Shutdown:
      return (
        <span
          id='parachain-text'
          className='font-bold text-interlayCalifornia'>
          {t('dashboard.parachain.halted')}
        </span>
      );
    default:
      return (
        <span
          id='parachain-text'
          className='font-bold text-interlayPaleSky'>
          {t('no_data')}
        </span>
      );
    }
  };

  return (
    <DashboardCard>
      {/* TODO: move this to the right */}
      <div className='h-64 grid place-items-center'>
        <div>
          <h1
            className={clsx(
              'h1-xl',
              'text-3xl',
              'text-left'
            )}>
            {t('dashboard.parachain.parachain_is')}&nbsp;
            {parachainState()}
          </h1>
          {linkButton && (
            <InterlayRouterLink to={PAGES.DASHBOARD_PARACHAIN}>
              <InterlayConiferOutlinedButton endIcon={<FaExternalLinkAlt />}>
                STATUS UPDATES
              </InterlayConiferOutlinedButton>
            </InterlayRouterLink>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default ParachainSecurity;
