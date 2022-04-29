import { withErrorBoundary } from 'react-error-boundary';

import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import useGetVaults from 'utils/hooks/api/use-get-vaults';
import { useEffect } from 'react';

const VaultOverview = (): JSX.Element => {
  const vaults = useGetVaults();

  useEffect(() => {
    console.log(vaults);
  }, [vaults]);

  return (
    <MainContainer>
      <VaultCard
        collateral='lksm'
        wrappedAsset='btc'
        pendingRequests={3}
        apy={15}
        collateralScore={84} />
    </MainContainer>);
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
