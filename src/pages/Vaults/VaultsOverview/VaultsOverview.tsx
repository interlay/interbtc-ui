import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { StoreType } from '@/common/types/util.types';
import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Grid, GridItem, InfoBox, VaultCard } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { useGetVaultData } from '@/utils/hooks/api/vaults/use-get-vault-data';

import { CreateVaults, VaultsHeader } from './components';

const VaultOverview = (): JSX.Element => {
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();
  const vaultOverview = useGetVaultData({ address: accountAddress });
  const { vaultClientLoaded, address } = useSelector((state: StoreType) => state.general);

  const { t } = useTranslation();

  if (!vaultOverview) {
    return (
      <MainContainer>
        <VaultsHeader title={t('vault.vault_overview')} accountAddress={accountAddress} />
        <PrimaryColorEllipsisLoader />
      </MainContainer>
    );
  }

  const isReadOnlyVault = !vaultClientLoaded || address !== accountAddress;

  return (
    <MainContainer>
      <VaultsHeader title={t('vault.vault_overview')} accountAddress={accountAddress} />
      <Grid>
        <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 2, start: 1 }}>
          <InfoBox
            title='My vaults at risk'
            text={vaultOverview.totals ? formatNumber(vaultOverview.totals.totalAtRisk) : ''}
          />
        </GridItem>
        <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 5, start: 3 }}>
          <InfoBox
            title='My locked collateral'
            text={vaultOverview.totals ? formatUSD(vaultOverview.totals.totalLockedCollateral) : ''}
          />
        </GridItem>
        <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 5, start: 8 }}>
          <InfoBox
            title='My total claimable rewards'
            text={vaultOverview.totals ? formatUSD(vaultOverview.totals.totalUsdRewards) : ''}
          />
        </GridItem>
        {vaultOverview.vaults?.map((vault) => (
          <GridItem key={vault.collateralId} mobile={{ span: 4 }} desktop={{ span: 3 }}>
            <VaultCard
              collateralSymbol={vault.collateralId}
              wrappedSymbol={vault.wrappedId}
              pendingRequests={formatNumber(vault.pendingRequests)}
              apy={formatPercentage(vault.apy.toNumber() / 100)}
              collateralScore={vault.collateralization ? formatPercentage(vault.collateralization.toNumber()) : '∞'}
              link={`${accountAddress}/${vault.collateralId}/${vault.wrappedId}`}
              atRisk={vault.vaultAtRisk}
            />
          </GridItem>
        ))}
      </Grid>
      {!isReadOnlyVault && <CreateVaults vaults={vaultOverview.vaults} />}
    </MainContainer>
  );
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
