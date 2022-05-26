
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { AccountId } from '@polkadot/types/interfaces';
import { VaultExt } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import StatPanel from '../StatPanel';
import ErrorFallback from 'components/ErrorFallback';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import { getVaultStatusLabel } from 'utils/helpers/vaults';
import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { BTCToCollateralTokenRate } from 'types/currency';
import { StoreType } from 'common/types/util.types';

interface Props {
  // TODO: should remove `undefined` later on when the loading is properly handled
  vaultAccountId: AccountId | undefined;
}

const VaultStatusStatPanel = ({
  vaultAccountId
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: vaultExtIdle,
    isLoading: vaultExtLoading,
    data: vaultExt,
    error: vaultExtError
  } = useQuery<VaultExt<BitcoinUnit>, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'get',
      vaultAccountId,
      COLLATERAL_TOKEN_ID_LITERAL
    ],
    genericFetcher<VaultExt<BitcoinUnit>>(),
    {
      enabled: !!bridgeLoaded && !!vaultAccountId
    }
  );
  useErrorHandler(vaultExtError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'system',
      'getCurrentActiveBlockNumber'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: liquidationCollateralThresholdIdle,
    isLoading: liquidationCollateralThresholdLoading,
    data: liquidationCollateralThreshold,
    error: liquidationCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getLiquidationCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(liquidationCollateralThresholdError);

  const {
    isIdle: secureCollateralThresholdIdle,
    isLoading: secureCollateralThresholdLoading,
    data: secureCollateralThreshold,
    error: secureCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getSecureCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(secureCollateralThresholdError);

  const {
    isIdle: btcToCollateralTokenRateIdle,
    isLoading: btcToCollateralTokenRateLoading,
    data: btcToCollateralTokenRate,
    error: btcToCollateralTokenRateError
  } = useQuery<
    BTCToCollateralTokenRate,
    Error
  >(
    [
      GENERIC_FETCHER,
      'oracle',
      'getExchangeRate',
      COLLATERAL_TOKEN
    ],
    genericFetcher<BTCToCollateralTokenRate>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(btcToCollateralTokenRateError);

  let statusLabel: string;
  if (
    vaultExtIdle ||
    vaultExtLoading ||
    currentActiveBlockNumberIdle ||
    currentActiveBlockNumberLoading ||
    liquidationCollateralThresholdIdle ||
    liquidationCollateralThresholdLoading ||
    secureCollateralThresholdIdle ||
    secureCollateralThresholdLoading ||
    btcToCollateralTokenRateIdle ||
    btcToCollateralTokenRateLoading
  ) {
    statusLabel = '-';
  } else {
    if (
      vaultExt === undefined ||
      currentActiveBlockNumber === undefined ||
      liquidationCollateralThreshold === undefined ||
      secureCollateralThreshold === undefined ||
      btcToCollateralTokenRate === undefined
    ) {
      throw new Error('Something went wrong!');
    }

    statusLabel = getVaultStatusLabel(
      vaultExt,
      currentActiveBlockNumber,
      liquidationCollateralThreshold,
      secureCollateralThreshold,
      btcToCollateralTokenRate,
      t
    );
  }

  return (
    <StatPanel
      label={t('vault.status')}
      value={statusLabel} />
  );
};

export default withErrorBoundary(VaultStatusStatPanel, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
