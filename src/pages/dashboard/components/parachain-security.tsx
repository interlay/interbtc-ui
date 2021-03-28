import ButtonComponent from './button-component';
import { getAccents } from '../dashboardcolors';
import { useSelector } from 'react-redux';
import { ParachainStatus, StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

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
          style={{ color: getAccents('d_green').color }}
          id='parachain-text'
          className='font-bold'>
          {t('dashboard.parachain.secure')}
        </span>

      );
    case ParachainStatus.Loading:
      return (
        <span
          style={{ color: getAccents('d_grey').color }}
          id='parachain-text'
          className='font-bold'>
          {t('loading')}
        </span>

      );
    case ParachainStatus.Error:
    case ParachainStatus.Shutdown:
      return (
        <span
          style={{ color: getAccents('d_yellow').color }}
          id='parachain-text'
          className='font-bold'>
          {t('dashboard.parachain.halted')}
        </span>

      );
    default:
      return (
        <span
          style={{ color: getAccents('d_grey').color }}
          id='parachain-text'
          className='font-bold'>
          {t('no_data')}
        </span>

      );
    }
  };

  return (
    <DashboardCard>
      <div className='values-container'></div>
      {/* TODO: move this to the right */}
      <div className='parachain-content-container'>
        <div>
          <h1 className='h1-xl-text-left'>
            {t('dashboard.parachain.parachain_is')}&nbsp;
            {parachainState()}
          </h1>
          {linkButton && (
            <div
              className='button-container'
              style={{ marginTop: '20px' }}>
              <ButtonComponent
                buttonName='Status Updates'
                propsButtonColor='d_green'
                buttonId='parachain-security'
                buttonLink={PAGES.PARACHAIN} />
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default ParachainSecurity;
