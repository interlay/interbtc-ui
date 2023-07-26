import { newMonetaryAmount } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import IssuedChart from '@/pages/Dashboard/IssuedChart';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { PAGES } from '@/utils/constants/links';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetTotalLockedTokens } from '@/utils/hooks/api/tokens/use-get-total-locked-tokens';

import DashboardCard from '../../../cards/DashboardCard';
import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../../Stats';

const WrappedTokenCard = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const { data: totalLockedData } = useGetTotalLockedTokens();

  const renderContent = () => {
    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>{t('dashboard.issue.issued')}</StatsDt>
              <StatsDd>
                {t('dashboard.issue.total_interbtc', {
                  amount: totalLockedData?.wrapped.toHuman(8) || 0,
                  wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
                })}
              </StatsDd>
              <StatsDd>
                {displayMonetaryAmountInUSDFormat(
                  totalLockedData?.wrapped || newMonetaryAmount(0, WRAPPED_TOKEN),
                  getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
                )}
              </StatsDd>
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
