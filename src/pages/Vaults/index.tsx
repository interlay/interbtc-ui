import { useParams } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import FullLoadingSpinner from 'components/FullLoadingSpinner';
import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { URL_PARAMETERS } from 'utils/constants/links';
import { useGetVaultOverview } from 'utils/hooks/api/use-get-vault-overview';

const VaultOverview = (): JSX.Element => {
  // TODO: this way of deconstructing url params needs to be simplified
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();
  const vaults = useGetVaultOverview({ address: accountAddress });

  return (
    <MainContainer>
      {vaults.length ? vaults.filter(vault => vault !== undefined).map(vault =>
        <VaultCard
          key={vault.apy}
          collateral={vault.collateralToken}
          wrappedAsset={CurrencyIdLiteral.KBTC}
          pendingRequests={vault.issues}
          apy={safeRoundTwoDecimals(vault.apy)}
          collateralScore={safeRoundTwoDecimals(vault.collateralization?.toString(), '∞')}
          link={`${accountAddress}/${vault.collateralToken}/${vault.wrappedToken}`} />
      ) : <FullLoadingSpinner />}
    </MainContainer>);
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
