import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Stats, { StatsDt, StatsDd, StatsRouterLink } from '../../../Stats';
import DashboardCard from '../../../cards/DashboardCard';
import IssuedChart from 'pages/Dashboard/IssuedChart';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { displayMonetaryAmount, getUsdAmount } from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';
import { useGetPrices } from 'utils/hooks/api/use-get-prices';
import { getTokenPrice } from 'utils/helpers/prices';

const WrappedTokenCard = (): JSX.Element => {
  const { totalWrappedTokenAmount } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const prices = useGetPrices();

  const renderContent = () => {
    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>{t('dashboard.issue.issued')}</StatsDt>
              <StatsDd>
                {t('dashboard.issue.total_interbtc', {
                  amount: displayMonetaryAmount(totalWrappedTokenAmount),
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })}
              </StatsDd>
              <StatsDd>${getUsdAmount(totalWrappedTokenAmount, getTokenPrice(prices, 'BTC')?.usd)}</StatsDd>
            </>
          }
          rightPart={
            <>
              <StatsRouterLink to={PAGES.DASHBOARD_ISSUE_REQUESTS}>View all issued</StatsRouterLink>
              <StatsRouterLink to={PAGES.DASHBOARD_REDEEM_REQUESTS}>View all redeemed</StatsRouterLink>
            </>
          }
        />
        <IssuedChart />
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default WrappedTokenCard;
