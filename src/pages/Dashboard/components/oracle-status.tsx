
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { CollateralUnit } from '@interlay/interbtc-api';
import {
  Bitcoin,
  BitcoinUnit,
  ExchangeRate,
  Currency
} from '@interlay/monetary-js';

import DashboardCard from 'pages/Dashboard/DashboardCard';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { ORACLE_CURRENCY_KEY } from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';

enum Status {
  Loading,
  Online,
  Offline,
  NoData
}

interface Props {
  linkButton?: boolean;
}

const OracleStatus = ({ linkButton }: Props): JSX.Element => {
  const { t } = useTranslation();

  // TODO: use translations for status
  const [oracleStatus, setOracleStatus] = React.useState(Status.Loading);
  const [exchangeRate, setExchangeRate] = React.useState<
    ExchangeRate<
      Bitcoin,
      BitcoinUnit,
      Currency<CollateralUnit>,
      CollateralUnit
    >
  >();

  React.useEffect(() => {
    (async () => {
      try {
        const oracleStatus = await window.bridge.interBtcIndex.getLatestSubmission(ORACLE_CURRENCY_KEY);
        setExchangeRate(oracleStatus.exchangeRate);
        const status = oracleStatus.online ? Status.Online : Status.Offline;
        setOracleStatus(status);
      } catch (error) {
        console.log('[OracleStatus useEffect] error.message => ', error.message);
        setOracleStatus(Status.NoData);
      }
    })();
  }, []);

  return (
    <DashboardCard>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <div>
          <h1
            className={clsx(
              'font-bold',
              'text-sm',
              'xl:text-base',
              'mb-1',
              'xl:mb-2'
            )}>
            {t('dashboard.oracles.oracles_are')}&nbsp;
            {oracleStatus === Status.Online ? (
              <span
                id='oracle-text'
                className='font-bold text-interlayConifer'>
                {t('dashboard.oracles.online')}
              </span>
            ) : oracleStatus === Status.Offline ? (
              <span
                id='oracle-text'
                className='font-bold text-interlayCinnabar'>
                {t('dashboard.oracles.offline')}
              </span>
            ) : (
              <span
                id='oracle-text'
                className='font-bold text-interlayPaleSky'>
                {t('dashboard.oracles.loading')}
              </span>
            )}
          </h1>
        </div>
        {linkButton && (
          <InterlayRouterLink to={PAGES.DASHBOARD_ORACLES}>
            <InterlayConiferOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW ORACLES
            </InterlayConiferOutlinedButton>
          </InterlayRouterLink>
        )}
      </div>
      <div className='mt-6 flex justify-center items-center'>
        {oracleStatus === Status.Online ? (
          <div
            className={clsx(
              'w-64',
              'h-64',
              'ring-4',
              'ring-interlayConifer',
              'rounded-full',
              'inline-flex',
              'flex-col',
              'items-center',
              'justify-center'
            )}
            id='oracle-circle'>
            <h1
              className={clsx(
                'font-bold',
                'text-3xl',
                'text-center',
                'text-interlayConifer'
              )}
              id='oracle-circle-text'>
              {t('online')}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {exchangeRate?.toHuman(5)} DOT/BTC
            </h2>
          </div>
        ) : oracleStatus === Status.Offline ? (
          <div
            className={clsx(
              'w-64',
              'h-64',
              'ring-4',
              'ring-interlayCinnabar',
              'rounded-full',
              'inline-flex',
              'flex-col',
              'items-center',
              'justify-center'
            )}
            id='oracle-circle'>
            <h1
              className={clsx(
                'font-bold',
                'text-3xl',
                'text-center',
                'text-interlayCinnabar'
              )}
              id='oracle-circle-text'>
              {t('offline')}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {exchangeRate?.toHuman(5)} DOT/BTC
            </h2>
          </div>
        ) : oracleStatus === Status.NoData ? (
          <div
            className={clsx(
              'w-64',
              'h-64',
              'ring-4',
              'ring-interlayPaleSky',
              'rounded-full',
              'inline-flex',
              'flex-col',
              'items-center',
              'justify-center'
            )}
            id='oracle-circle'>
            <h1
              className={clsx(
                'font-bold',
                'text-3xl',
                'text-center',
                'text-interlayPaleSky'
              )}
              id='oracle-circle-text'>
              {t('no_data')}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {exchangeRate?.toHuman(5)} DOT/BTC
            </h2>
          </div>
        ) : (
          <div
            className={clsx(
              'w-64',
              'h-64',
              'ring-4',
              'ring-interlayPaleSky',
              'rounded-full',
              'inline-flex',
              'flex-col',
              'items-center',
              'justify-center'
            )}
            id='oracle-circle'>
            <h1
              className={clsx(
                'font-bold',
                'text-3xl',
                'text-center',
                'text-interlayPaleSky'
              )}
              id='oracle-circle-text'>
              {t('loading')}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {exchangeRate?.toHuman(5)} DOT/BTC
            </h2>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default OracleStatus;
