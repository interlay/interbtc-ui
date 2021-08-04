import { useState, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';

import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';

enum Status {
  Loading,
  Online,
  Offline,
  NoData
}

type OracleStatusProps = {
  linkButton?: boolean;
};

const OracleStatus = ({ linkButton }: OracleStatusProps): ReactElement => {
  const statsApi = useInterbtcIndex();
  const { t } = useTranslation();
  // TODO: use translations for status
  const [oracleStatus, setOracleStatus] = useState(Status.Loading);
  const [exchangeRate, setExchangeRate] = useState('0');

  useEffect(() => {
    (async () => {
      try {
        const oracleStatus = (await statsApi.getLatestSubmission());
        const exchangeRate = new Big(oracleStatus.exchangeRate);
        setExchangeRate(exchangeRate.toFixed(2));
        const status = oracleStatus.online ? Status.Online : Status.Offline;
        setOracleStatus(status);
      } catch (error) {
        console.log('[OracleStatus useEffect] error.message => ', error.message);
        setOracleStatus(Status.NoData);
      }
    })();
  }, [statsApi]);

  return (
    <DashboardCard>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <div>
          <h1 className='font-bold'>
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
                'h1-xl',
                'text-3xl',
                'text-center',
                'text-interlayConifer'
              )}
              id='oracle-circle-text'>
              {t('online')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
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
                'h1-xl',
                'text-3xl',
                'text-center',
                'text-interlayCinnabar'
              )}
              id='oracle-circle-text'>
              {t('offline')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
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
                'h1-xl',
                'text-3xl',
                'text-center',
                'text-interlayPaleSky'
              )}
              id='oracle-circle-text'>
              {t('no_data')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
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
                'h1-xl',
                'text-3xl',
                'text-center',
                'text-interlayPaleSky'
              )}
              id='oracle-circle-text'>
              {t('loading')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default OracleStatus;
