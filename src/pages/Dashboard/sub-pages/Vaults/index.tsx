import { CollateralIdLiteral } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import { VAULT_COLLATERAL_TOKENS } from '@/config/vaults';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import LockedCollateralCard from './LockedCollateralCard';
import VaultsTable from './VaultsTable';

const Vaults = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.vault.vaults')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <div className={clsx('grid', 'grid-cols-3', 'gap-7')}>
        <ActiveVaultsCard />
        <CollateralizationCard />
        {VAULT_COLLATERAL_TOKENS.map((item) => (
          <LockedCollateralCard
            key={item.ticker}
            collateralToken={item}
            collateralTokenSymbol={item.ticker}
            collateralTokenPriceInUSD={getTokenPrice(prices, item.ticker as CollateralIdLiteral)?.usd}
          />
        ))}
      </div>
      <VaultsTable />
    </>
  );
};

export default Vaults;
