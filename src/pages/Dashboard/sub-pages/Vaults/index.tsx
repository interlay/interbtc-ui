import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import {
  CollateralToken,
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
} from '@/config/relay-chains';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';
import { KUSAMA } from '@/utils/constants/relay-chain-names';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import LockedCollateralCard from './LockedCollateralCard';
import VaultsTable from './VaultsTable';

const Vaults = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

  const relayChainNativeTokenPriceInUSD = getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd;
  const governanceTokenPriceInUSD = getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd;

  // TODO: Refactor to use vault config as a source for supported collateral currencies
  const collaterals = React.useMemo(
    () => [
      {
        collateralToken: RELAY_CHAIN_NATIVE_TOKEN,
        collateralTokenSymbol: RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
        collateralTokenPriceInUSD: relayChainNativeTokenPriceInUSD
      },
      ...(process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA
        ? [
            {
              collateralToken: GOVERNANCE_TOKEN as CollateralToken,
              collateralTokenSymbol: GOVERNANCE_TOKEN_SYMBOL,
              collateralTokenPriceInUSD: governanceTokenPriceInUSD
            }
          ]
        : [])
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
