import { useState, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';

import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getAccents } from '../dashboardcolors';

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
  const statsApi = usePolkabtcStats();
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
      <div className='card-top-content'>
        <div className='values-container'>
          <h1 className='font-bold'>
            {t('dashboard.oracles.oracles_are')}&nbsp;
            {oracleStatus === Status.Online ? (
              <span
                style={{ color: getAccents('d_green').color }}
                id='oracle-text'
                className='font-bold'>
                {t('dashboard.oracles.online')}
              </span>
            ) : oracleStatus === Status.Offline ? (
              <span
                style={{ color: getAccents('d_red').color }}
                id='oracle-text'
                className='font-bold'>
                {t('dashboard.oracles.offline')}
              </span>
            ) : (
              <span
                style={{ color: getAccents('d_grey').color }}
                id='oracle-text'
                className='font-bold'>
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
      <div className='circle-container'>
        {oracleStatus === Status.Online ? (
          <div
            className='status-circle'
            style={{ borderColor: getAccents('d_green').color }}
            id='oracle-circle'>
            <h1
              className={clsx(
                'h1-xl',
                'text-3xl',
                'text-center'
              )}
              style={{ color: getAccents('d_green').color }}
              id='oracle-circle-text'>
              {t('online')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
          </div>
        ) : oracleStatus === Status.Offline ? (
          <div
            className='status-circle'
            style={{ borderColor: getAccents('d_red').color }}
            id='oracle-circle'>
            <h1
              className={clsx(
                'h1-xl',
                'text-3xl',
                'text-center'
              )}
              style={{ color: getAccents('d_red').color }}
              id='oracle-circle-text'>
              {t('offline')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
          </div>
        ) : oracleStatus === Status.NoData ? (
          <div
            className='status-circle'
            style={{ borderColor: getAccents('d_grey').color }}
            id='oracle-circle'>
            <h1
              className={clsx(
                'h1-xl',
                'text-3xl',
                'text-center'
              )}
              style={{ color: getAccents('d_grey').color }}
              id='oracle-circle-text'>
              {t('no_data')}
            </h1>
            <h2>{exchangeRate} DOT/BTC</h2>
          </div>
        ) : (
          <div
            className='status-circle'
            style={{ borderColor: getAccents('d_grey').color }}
            id='oracle-circle'>
            <h1
              className={clsx(
                'h1-xl',
                'text-3xl',
                'text-center'
              )}
              style={{ color: getAccents('d_grey').color }}
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
