import { useParams } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import { newAccountId } from '@interlay/interbtc-api';

import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { URL_PARAMETERS } from 'utils/constants/links';
import { useGetVaultOverview } from 'utils/hooks/api/use-get-vault-overview';

const VaultOverview = (): JSX.Element => {
  // TODO: this way of deconstructing url params needs to be simplified
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();
  const vaults = useGetVaultOverview({ accountId: newAccountId(window.bridge.api, accountAddress) });

  return (
    <MainContainer>
      {vaults.length ? vaults.filter(vault => vault !== undefined).map(vault =>
        <VaultCard
          key={vault.apy}
          // TODO: make these values dynamic when we support KINT
          collateral={vault.collateralToken}
          wrappedAsset='btc'
          pendingRequests={vault?.issues}
          apy={safeRoundTwoDecimals(vault?.apy)}
          collateralScore={safeRoundTwoDecimals(vault?.collateralScore?.toString(), '∞')}
          link={`${accountAddress}/${vault.collateralToken}`} />
      ) : null}
    </MainContainer>);
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
