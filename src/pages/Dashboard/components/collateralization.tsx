
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BitcoinAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import DashboardCard from 'pages/Dashboard/DashboardCard';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  displayMonetaryAmount,
  safeRoundTwoDecimals
} from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

const TEMP_DISABLE_COLLATERALIZATION_DISPLAY = true; // TODO: remove once lib reimplements collateralization

interface Props {
  linkButton?: boolean;
}

const Collateralization = ({ linkButton }: Props): JSX.Element => {
  const { t } = useTranslation();
  const bridgeLoaded = useSelector((state: StoreType) => state.general.bridgeLoaded);

  const [systemCollateralization, setSystemCollateralization] = React.useState('0');
  const [issuableWrappedToken, setIssuableWrappedToken] = React.useState(BitcoinAmount.zero);
  const [secureCollateralThreshold, setSecureCollateralThreshold] = React.useState('150');
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded || TEMP_DISABLE_COLLATERALIZATION_DISPLAY) return;

      try {
        const systemCollateralization = await window.bridge.interBtcApi.vaults.getSystemCollateralization();
        setSystemCollateralization(systemCollateralization?.mul(100).toString() || '0');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    })();

    (async () => {
      if (!bridgeLoaded) return;

      try {
        const theIssuableWrappedToken = await window.bridge.interBtcApi.vaults.getTotalIssuableAmount();
        setIssuableWrappedToken(theIssuableWrappedToken);
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    })();

    (async () => {
      if (!bridgeLoaded) return;

      try {
        const secureCollateralThreshold =
          await window.bridge.interBtcApi.vaults.getSecureCollateralThreshold(COLLATERAL_TOKEN);
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
          {!(failed || TEMP_DISABLE_COLLATERALIZATION_DISPLAY) && (
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
            issuableWrappedToken.eq(BitcoinAmount.zero) ? (
              <>{t('loading')}</>
            ) : (
              <>
                <span className='inline-block'>{`${displayMonetaryAmount(issuableWrappedToken)} interBTC`}</span>
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
