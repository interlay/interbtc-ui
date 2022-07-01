import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import VaultsTable from './VaultsTable';
import LockedCollateralCard from './LockedCollateralCard';
import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import TimerIncrement from 'parts/TimerIncrement';
import PageTitle from 'parts/PageTitle';
import Hr1 from 'components/hrs/Hr1';
import {
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  CollateralToken
} from 'config/relay-chains';
import { StoreType } from 'common/types/util.types';

const Vaults = (): JSX.Element => {
  const { t } = useTranslation();
  const { prices } = useSelector((state: StoreType) => state.general);

  const relayChainNativeTokenPriceInUSD = prices.relayChainNativeToken?.usd;
  const governanceTokenPriceInUSD = prices.governanceToken?.usd;

  const collaterals = React.useMemo(
    () => [
      {
        collateralToken: RELAY_CHAIN_NATIVE_TOKEN,
        collateralTokenSymbol: RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
        collateralTokenPriceInUSD: relayChainNativeTokenPriceInUSD
      },
      {
        collateralToken: GOVERNANCE_TOKEN as CollateralToken,
        collateralTokenSymbol: GOVERNANCE_TOKEN_SYMBOL,
        collateralTokenPriceInUSD: governanceTokenPriceInUSD
      }
    ],
    [relayChainNativeTokenPriceInUSD, governanceTokenPriceInUSD]
  );

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.vault.vaults')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <div className={clsx('grid', 'grid-cols-3', 'gap-7')}>
        <ActiveVaultsCard />
        <CollateralizationCard />
        {collaterals.map((item) => (
          <LockedCollateralCard
            key={item.collateralTokenSymbol}
            collateralToken={item.collateralToken}
            collateralTokenSymbol={item.collateralTokenSymbol}
            collateralTokenPriceInUSD={item.collateralTokenPriceInUSD}
          />
        ))}
      </div>
      <VaultsTable />
    </>
  );
};

export default Vaults;
