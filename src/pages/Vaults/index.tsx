import { useParams } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import PrimaryColorEllipsisLoader from 'components/PrimaryColorEllipsisLoader';
import MainContainer from 'parts/MainContainer';
import { VaultCard } from 'componentLibrary';
import ErrorFallback from 'components/ErrorFallback';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { URL_PARAMETERS } from 'utils/constants/links';
import { getCurrencySymbol } from 'utils/helpers/currencies';
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
      <VaultsHeader title={t('vault.vault_overview')} accountAddress={accountAddress} />
      {vaults && vaults.length ? (
        <Vaults>
          {vaults.map((vault) => (
            <VaultCard
              key={vault.collateralId}
              collateralSymbol={getCurrencySymbol(vault.collateralId)}
              wrappedSymbol={getCurrencySymbol(vault.wrappedId)}
              pendingRequests={vault.issues}
              apy={safeRoundTwoDecimals(vault.apy.toString())}
              collateralScore={safeRoundTwoDecimals(vault.collateralization?.mul(100).toString(), '∞')}
              link={`${accountAddress}/${vault.collateralId}/${vault.wrappedId}`}
            />
          ))}
        </Vaults>
      ) : (
        <PrimaryColorEllipsisLoader />
      )}
    </MainContainer>
  );
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
