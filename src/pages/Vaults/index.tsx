import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { safeRoundTwoDecimals } from '@/common/utils/utils';
import { Grid, GridItem, InfoBox, VaultCard } from '@/component-library';
// import { Grid, GridItem, InfoBox, VaultCard, NewVaultsTable } from '@/component-library';
import ErrorFallback from '@/components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { useGetVaultOverview } from '@/utils/hooks/api/use-get-vault-overview';

import { VaultsHeader } from './VaultsHeader';

const VaultOverview = (): JSX.Element => {
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();

  const vaultOverview = useGetVaultOverview({ address: accountAddress });

  const { t } = useTranslation();

  return (
    <MainContainer>
      <VaultsHeader title={t('vault.vault_overview')} accountAddress={accountAddress} />
      {vaultOverview ? (
        <Grid>
          <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 2, start: 1 }}>
            <InfoBox title='My vaults at risk' text={`${vaultOverview.totals?.totalAtRisk}`} />
          </GridItem>
          <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 5, start: 3 }}>
            <InfoBox title='My locked collateral' text={`$${vaultOverview.totals?.totalLockedCollateral.toFixed(2)}`} />
          </GridItem>
          <GridItem mobile={{ span: 4, start: 1 }} desktop={{ span: 5, start: 8 }}>
            <InfoBox title='My total claimable rewards' text={`$${vaultOverview.totals?.totalUsdRewards.toFixed(2)}`} />
          </GridItem>
          {vaultOverview?.vaults?.map((vault) => (
            <GridItem key={vault.collateralId} mobile={{ span: 4 }} desktop={{ span: 3 }}>
              <VaultCard
                collateralSymbol={vault.collateralId}
                wrappedSymbol={vault.wrappedId}
                pendingRequests={vault.pendingRequests}
                apy={safeRoundTwoDecimals(vault.apy.toString())}
                collateralScore={safeRoundTwoDecimals(vault.collateralization?.mul(100).toString(), '∞')}
                link={`${accountAddress}/${vault.collateralId}/${vault.wrappedId}`}
              />
            </GridItem>
          ))}
        </Grid>
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
