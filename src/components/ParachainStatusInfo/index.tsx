import { useTranslation } from 'react-i18next';

import { ParachainStatus } from 'common/types/util.types';

interface Props {
  status: ParachainStatus
}

const ParachainStatusInfo = ({ status }: Props) => {
  const { t } = useTranslation();

  switch (status) {
  case ParachainStatus.Loading:
    return (
      <div className='wizard-input-info'>
        <p
          className='mb-4'
          style={{ fontSize: '16px' }}>
          {t('polkabtc_bridge_loading')}
        </p>
      </div>
    );
  case ParachainStatus.Running:
    return <div />;
    // Covers the cases of Shutdown and Error
  default:
    return (
      <div className='wizard-input-error'>
        <p
          style={{
            fontSize: '20px',
            marginBottom: 4
          }}>
          {t('issue_redeem_disabled')}
        </p>
        <p
          className='mb-4'
          style={{ fontSize: '16px' }}>
          {t('polkabtc_bridge_recovery_mode')}
        </p>
      </div>
    );
  }
};

export default ParachainStatusInfo;
