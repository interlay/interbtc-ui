
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BTCAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import DashboardCard from 'pages/Dashboard/DashboardCard';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import {
  displayMonetaryAmount,
  safeRoundTwoDecimals
} from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

interface Props {
  linkButton?: boolean;
}

const Collateralization = ({ linkButton }: Props): JSX.Element => {
  const { t } = useTranslation();
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

  const [systemCollateralization, setSystemCollateralization] = React.useState('0');
  const [issuablePolkaBTC, setIssuablePolkaBTC] = React.useState(BTCAmount.zero);
  const [secureCollateralThreshold, setSecureCollateralThreshold] = React.useState('150');
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!polkaBtcLoaded) return;

      try {
        const systemCollateralization = await window.polkaBTC.interBtcApi.vaults.getSystemCollateralization();
        setSystemCollateralization(systemCollateralization?.mul(100).toString() || '0');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    })();

    (async () => {
      if (!polkaBtcLoaded) return;

      try {
        const issuablePolkaBTC = await window.polkaBTC.interBtcApi.vaults.getTotalIssuableAmount();
        setIssuablePolkaBTC(issuablePolkaBTC);
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    })();

    (async () => {
      if (!polkaBtcLoaded) return;

      try {
        const secureCollateralThreshold = await window.polkaBTC.interBtcApi.vaults.getSecureCollateralThreshold();
        setSecureCollateralThreshold(secureCollateralThreshold?.mul(100).toString() || '150');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    })();
  });

  return (
    <DashboardCard>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <div>
          {!failed && (
            <>
              <h1
                className={clsx(
                  'text-interlayDenim',
                  'text-sm',
                  'xl:text-base',
                  'mb-1',
                  'xl:mb-2'
                )}>
                {t('dashboard.vault.collateralization')}
              </h1>
              <h2
                className={clsx(
                  'text-base',
                  'font-bold',
                  'mb-1'
                )}>
                {safeRoundTwoDecimals(systemCollateralization)}%
              </h2>
              <h2
                className={clsx(
                  'text-base',
                  'font-bold',
                  'mb-1'
                )}>
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
            'font-bold',
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
};

export default Collateralization;
