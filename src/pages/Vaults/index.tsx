// import { useEffect } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { newAccountId } from '@interlay/interbtc-api';

import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { StoreType } from 'common/types/util.types';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { useGetVaultStatus } from 'utils/hooks/api/use-get-vault-status';

const VaultOverview = (): JSX.Element => {
  const {
    address
  } = useSelector((state: StoreType) => state.general);

  const vaultStatus = useGetVaultStatus({ accountId: newAccountId(window.bridge.api, address) });
  console.log(vaultStatus);

  return (
    <MainContainer>
      {/* TODO: render loading spinner */}
      {vaultStatus.length ? vaultStatus.filter(vault => vault !== undefined).map(vault =>
        <VaultCard
          key={vault.apy}
          // TODO: make these values dynamic when we support KINT
          collateral='ksm'
          wrappedAsset='btc'
          pendingRequests={vault?.issues}
          apy={safeRoundTwoDecimals(vault?.apy)}
          collateralScore={safeRoundTwoDecimals(vault?.collateralScore?.toString(), '∞')} />
      ) : null}
    </MainContainer>);
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
