import { useEffect, useState, ReactElement } from 'react';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { BTCAmount } from '@interlay/monetary-js';
import { StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import { displayMonetaryAmount, safeRoundTwoDecimals } from '../../../common/utils/utils';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import clsx from 'clsx';

type CollateralizationProps = {
  linkButton?: boolean;
};

export default function Collateralization({ linkButton }: CollateralizationProps): ReactElement {
  const { t } = useTranslation();

  const [systemCollateralization, setSystemCollateralization] = useState('0');
  const [issuablePolkaBTC, setIssuablePolkaBTC] = useState(BTCAmount.zero);
  const [secureCollateralThreshold, setSecureCollateralThreshold] = useState('150');
  const [failed, setFailed] = useState(false);
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

  useEffect(() => {
    const fetchSystemCollateralization = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const systemCollateralization = await window.polkaBTC.vaults.getSystemCollateralization();
        setSystemCollateralization(systemCollateralization?.mul(100).toString() || '0');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    };
    const fetchIssuableTokens = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const issuablePolkaBTC = await window.polkaBTC.vaults.getTotalIssuableAmount();
        setIssuablePolkaBTC(issuablePolkaBTC);
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    };
    const fetchSecureCollateralThreshold = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const secureCollateralThreshold = await window.polkaBTC.vaults.getSecureCollateralThreshold();
        setSecureCollateralThreshold(secureCollateralThreshold?.mul(100).toString() || '150');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    };
    fetchSystemCollateralization();
    fetchIssuableTokens();
    fetchSecureCollateralThreshold();
  });

  return (
    <DashboardCard>
      <div className='card-top-content'>
        <div className='values-container'>
          {!failed && (
            <>
              <h1 className='text-interlayDenim'>{t('dashboard.vault.collateralization')}</h1>
              <h2>{safeRoundTwoDecimals(systemCollateralization)}%</h2>
              <h2>
                {t('dashboard.vault.secure_threshold', {
                  threshold: safeRoundTwoDecimals(secureCollateralThreshold)
                })}
              </h2>
            </>
          )}
        </div>
        {linkButton && (
          <InterlayRouterLink to={PAGES.DASHBOARD_VAULTS}>
            <InterlayDenimOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW VAULTS
            </InterlayDenimOutlinedButton>
          </InterlayRouterLink>
        )}
      </div>
      <div
        className={clsx(
          'mx-auto',
          'w-60',
          'h-60',
          'rounded-full',
          'flex',
          'justify-center',
          'items-center',
          'border-2',
          'border-interlayDenim'
        )}>
        <h1
          className={clsx(
            'h1-xl',
            'text-2xl',
            'text-interlayDenim',
            'text-center'
          )}>
          {failed ? (
            <>{t('no_data')}</>
          ) : (
            issuablePolkaBTC.eq(BTCAmount.zero) ? (
              <>{t('loading')}</>
            ) : (
              <>
                <span className='inline-block'>{`${displayMonetaryAmount(issuablePolkaBTC)} interBTC`}</span>
                <span className='inline-block'>{t('dashboard.vault.capacity')}</span>
              </>
            )
          )}
        </h1>
      </div>
    </DashboardCard>
  );
}
