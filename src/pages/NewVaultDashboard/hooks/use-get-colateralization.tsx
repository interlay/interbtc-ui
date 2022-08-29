import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';

import { CollateralActions } from '../types';

type GetCollateralization = {
  isIdle: boolean;
  isLoading: boolean;
  data: Big | undefined;
  get: (collateralPortion: MonetaryAmount<CollateralCurrencyExt>) => void;
};

const useGetColateralization = (
  vaultAddress: string,
  collateralToken: CollateralCurrencyExt,
  collateralAmount: MonetaryAmount<CollateralCurrencyExt>,
  collateralAction: CollateralActions
): GetCollateralization => {
  const [scoreValue, setScoreValue] = useState<Big>();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { isIdle, isLoading, data, error } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getVaultCollateralization', vaultAddress, collateralToken, collateralAmount],
    genericFetcher<Big>(),
    {
      enabled: bridgeLoaded
      // TODO: add hasLockedBTC
      //    && hasLockedBTC
    }
  );
  useErrorHandler(error);

  useEffect(() => {
    if (!isLoading) {
      setScoreValue(data);
    }
  }, [isLoading, data]);

  const get = (collateralPortion: MonetaryAmount<CollateralCurrencyExt>) => {
    switch (collateralAction) {
      case 'deposit': {
        collateralAmount.add(collateralPortion);
        break;
      }
      case 'withdraw': {
        collateralAmount.sub(collateralPortion);
        break;
      }
    }
  };

  return { isIdle, isLoading, data: scoreValue, get };
};

export { useGetColateralization };
