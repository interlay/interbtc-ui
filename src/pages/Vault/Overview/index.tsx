// import { useEffect } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { newAccountId } from '@interlay/interbtc-api';

import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { StoreType } from 'common/types/util.types';
import { useGetVaultStatus } from 'utils/hooks/api/use-get-vault-status';

const VaultOverview = (): JSX.Element => {
  const {
    address
  } = useSelector((state: StoreType) => state.general);

  useGetVaultStatus({ accountId: newAccountId(window.bridge.api, address) });

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
