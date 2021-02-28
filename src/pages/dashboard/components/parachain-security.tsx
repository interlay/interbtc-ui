import React, { useState, useEffect } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboardcolors';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line no-unused-vars
enum Status {
  // eslint-disable-next-line no-unused-vars
  Loading,
  // eslint-disable-next-line no-unused-vars
  Secure,
  // eslint-disable-next-line no-unused-vars
  NotSecure,
  // eslint-disable-next-line no-unused-vars
  NoData,
}

type ParachainSecurityProps = {
  linkButton?: boolean;
};

const ParachainSecurity = ({ linkButton }: ParachainSecurityProps): React.ReactElement => {
  const { t } = useTranslation();
  const [parachainStatus, setParachainStatus] = useState(Status.Loading);
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

  useEffect(() => {
    const fetchOracleData = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const parachainStatus = await window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();

        if (parachainStatus.isRunning) {
          setParachainStatus(Status.Secure);
        } else if (parachainStatus.isError) {
          setParachainStatus(Status.NotSecure);
        }
      } catch (e) {
        console.log(e);
        setParachainStatus(Status.NoData);
      }
    };
    fetchOracleData();
  }, [polkaBtcLoaded]);
  return (
    <div className='card'>
      <div className='values-container'></div>
      {/* TODO: move this to the right */}
      <div className='parachain-content-container'>
        <div>
          <h1 className='h1-xl-text-left'>
            {t('dashboard.parachain.parachain_is')}&nbsp;
            {parachainStatus === Status.Secure ? (
              <span
                style={{ color: getAccents('d_green').color }}
                id='parachain-text'
                className='bold-font'>
                {t('dashboard.parachain.secure')}
              </span>
            ) : parachainStatus === Status.NotSecure ? (
              <span
                style={{ color: getAccents('d_yellow').color }}
                id='parachain-text'
                className='bold-font'>
                {t('dashboard.parachain.halted')}
              </span>
            ) : parachainStatus === Status.NoData ? (
              <span
                style={{ color: getAccents('d_grey').color }}
                id='parachain-text'
                className='bold-font'>
                {t('no_data')}
              </span>
            ) : (
              <span
                style={{ color: getAccents('d_grey').color }}
                id='parachain-text'
                className='bold-font'>
                {t('loading')}
              </span>
            )}
          </h1>
          {linkButton && (
            <div
              className='button-container'
              style={{ marginTop: '20px' }}>
              <ButtonComponent
                buttonName='Status Updates'
                propsButtonColor='d_green'
                buttonId='parachain-security'
                buttonLink='/dashboard/parachain' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParachainSecurity;
