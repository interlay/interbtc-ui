import { useParams } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import { newAccountId } from '@interlay/interbtc-api';

import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { URL_PARAMETERS } from 'utils/constants/links';
import { useGetVaultStatus } from 'utils/hooks/api/use-get-vault-status';

const VaultOverview = (): JSX.Element => {
  // TODO: this way of deconstructing url params needs to be simplified
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();
  const vaultStatus = useGetVaultStatus({ accountId: newAccountId(window.bridge.api, accountAddress) });

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
