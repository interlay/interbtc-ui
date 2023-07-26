import clsx from 'clsx';
import { useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { useGetCollateralCurrencies } from '@/hooks/api/use-get-collateral-currencies';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import Hr1 from '@/legacy-components/hrs/Hr1';
import PageTitle from '@/legacy-components/PageTitle';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import TimerIncrement from '@/legacy-components/TimerIncrement';
import { getTokenPrice } from '@/utils/helpers/prices';

import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import LockedCollateralCard from './LockedCollateralCard';
import VaultsTable from './VaultsTable';

const Vaults = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    data: collateralCurrencies,
    isIdle: collateralCurrenciesIdle,
    isLoading: collateralCurrenciesLoading,
    error: collateralCurrenciesError
  } = useGetCollateralCurrencies(bridgeLoaded);
  useErrorHandler(collateralCurrenciesError);

  if (collateralCurrenciesIdle || collateralCurrenciesLoading || collateralCurrencies === undefined) {
    return <PrimaryColorEllipsisLoader />;
  }

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.vault.vaults')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <div className={clsx('grid', 'grid-cols-3', 'gap-7')}>
        <ActiveVaultsCard />
        <CollateralizationCard />
        {collateralCurrencies.map((item) => (
          <LockedCollateralCard
            key={item.ticker}
            collateralToken={item}
            collateralTokenSymbol={item.ticker}
            collateralTokenPriceInUSD={getTokenPrice(prices, item.ticker)?.usd}
          />
        ))}
      </div>
      <VaultsTable />
    </>
  );
};

export default Vaults;
