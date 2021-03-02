import React, { useEffect, useState, ReactElement } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboard-colors';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import { safeRoundTwoDecimals } from '../../../common/utils/utils';
import { PAGES } from 'utils/constants/links';

type CollateralizationProps = {
  linkButton?: boolean;
};

export default function Collateralization({ linkButton }: CollateralizationProps): ReactElement {
  const { t } = useTranslation();

  const [systemCollateralization, setSystemCollateralization] = useState('0');
  const [issuablePolkaBTC, setIssuablePolkaBTC] = useState('0');
  const [secureCollateralThreshold, setSecureCollateralThreshold] = useState('0');
  const [failed, setFailed] = useState(false);
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

  useEffect(() => {
    const fetchCollateralizationData = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const [systemCollateralization, issuablePolkaBTC, secureCollateralThreshold] = await Promise.all([
          window.polkaBTC.vaults.getSystemCollateralization(),
          window.polkaBTC.vaults.getIssuablePolkaBTC(),
          window.polkaBTC.vaults.getSecureCollateralThreshold()
        ]);
        setSystemCollateralization(systemCollateralization?.mul(100).toString() || '0');
        setIssuablePolkaBTC(issuablePolkaBTC?.toString() || '0');
        setSecureCollateralThreshold(secureCollateralThreshold?.mul(100).toString() || '0');
      } catch (e) {
        console.log(e);
        setFailed(true);
      }
    };
    fetchCollateralizationData();
  });

  return (
    <div className='card'>
      <div className='card-top-content'>
        <div className='values-container'>
          {!failed && (
            <>
              <h1 style={{ color: getAccents('d_blue').color }}>
                {t('dashboard.vaults.collateralization')}
              </h1>
              <h2>{safeRoundTwoDecimals(systemCollateralization)}%</h2>
              <h2>
                {t('dashboard.vaults.secure_threshold', {
                  amount: safeRoundTwoDecimals(secureCollateralThreshold)
                })}
              </h2>
            </>
          )}
        </div>
        {linkButton && (
          <div className='button-container'>
            <ButtonComponent
              buttonName='view vaults'
              propsButtonColor='d_blue'
              buttonId='collateralization'
              buttonLink={PAGES.VAULTS} />
          </div>
        )}
      </div>

      <div className='circle-container'>
        <div
          className='status-circle'
          style={{ borderColor: getAccents('d_blue').color }}
          id='relay-circle'>
          <h1
            className='h1-xl-text-center'
            style={{ color: getAccents('d_blue').color }}>
            {failed ?
              t('no_data') :
              [safeRoundTwoDecimals(issuablePolkaBTC), <br />, t('dashboard.vaults.polkabtc_capacity')]}
          </h1>
        </div>
      </div>
    </div>
  );
}
