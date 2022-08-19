import { CollateralCurrencyExt, VaultExt, VaultStatusExt } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import ErrorFallback from '@/components/ErrorFallback';
import InterlayTooltip from '@/components/UI/InterlayTooltip';
import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import useCurrentActiveBlockNumber from '@/services/hooks/use-current-active-block-number';
import { BTCToCollateralTokenRate } from '@/types/currency';
import { getVaultStatusLabel } from '@/utils/helpers/vaults';

import StatPanel from '../StatPanel';

interface Props {
  vaultAccountId: AccountId;
  collateralToken: CollateralCurrencyExt;
}

const VaultStatusStatPanel = ({ vaultAccountId, collateralToken }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { isIdle: vaultExtIdle, isLoading: vaultExtLoading, data: vaultExt, error: vaultExtError } = useQuery<
    VaultExt,
    Error
  >([GENERIC_FETCHER, 'vaults', 'get', vaultAccountId, collateralToken], genericFetcher<VaultExt>(), {
    enabled: !!bridgeLoaded && !!vaultAccountId && !!collateralToken
  });
  useErrorHandler(vaultExtError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber,
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  const {
    isIdle: liquidationCollateralThresholdIdle,
    isLoading: liquidationCollateralThresholdLoading,
    data: liquidationCollateralThreshold,
    error: liquidationCollateralThresholdError
  } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getLiquidationCollateralThreshold', RELAY_CHAIN_NATIVE_TOKEN],
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
    [GENERIC_FETCHER, 'vaults', 'getSecureCollateralThreshold', RELAY_CHAIN_NATIVE_TOKEN],
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
  } = useQuery<BTCToCollateralTokenRate, Error>(
    [GENERIC_FETCHER, 'oracle', 'getExchangeRate', RELAY_CHAIN_NATIVE_TOKEN],
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

  const statPanel = <StatPanel label={t('vault.status')} value={statusLabel} />;

  // Render with tooltip if vault is inactive.
  if (vaultExt?.status === VaultStatusExt.Inactive) {
    return <InterlayTooltip label={t('dashboard.vault.issuing_disabled_tooltip')}>{statPanel}</InterlayTooltip>;
  }

  return statPanel;
};

export default withErrorBoundary(VaultStatusStatPanel, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
