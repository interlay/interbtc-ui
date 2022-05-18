import { useParams } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import FullLoadingSpinner from 'components/FullLoadingSpinner';
import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { URL_PARAMETERS } from 'utils/constants/links';
import { useGetVaultOverview } from 'utils/hooks/api/use-get-vault-overview';
import { VaultsHeader } from './VaultsHeader';
import { Vaults } from './vaults.style';

const VaultOverview = (): JSX.Element => {
  // TODO: can this way of deconstructing url params needs be simplified?
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();
  const vaults = useGetVaultOverview({ address: accountAddress });
  const { t } = useTranslation();

  return (
    <MainContainer>
      <VaultsHeader
        title={t('vault.vault_overview')}
        accountAddress={accountAddress} />
      <Vaults>
        {vaults.length ? vaults.map(vault =>
          <VaultCard
            key={vault.collateral?.id}
            collateralSymbol={vault.collateral?.symbol}
            wrappedSymbol={vault.collateral?.symbol}
            pendingRequests={vault.issues}
            apy={safeRoundTwoDecimals(vault.apy)}
            collateralScore={safeRoundTwoDecimals(vault.collateralization, '∞')}
            link={`${accountAddress}/${vault.collateral?.id}/${vault.wrapped?.id}`} />
        ) : <FullLoadingSpinner />}
      </Vaults>
    </MainContainer>);
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
