import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { StoreType } from '@/common/types/util.types';
import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Grid, GridItem } from '@/component-library';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import { useSubstrateSecureState } from '@/lib/substrate';
import MainContainer from '@/parts/MainContainer';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA } from '@/utils/constants/relay-chain-names';
import { useGetVaultData } from '@/utils/hooks/api/vaults/use-get-vault-data';

import { CreateVaults, InfoBox, VaultCard, VaultsHeader } from './components';

const VaultOverview = (): JSX.Element => {
  const { [URL_PARAMETERS.VAULT.ACCOUNT]: accountAddress } = useParams<Record<string, string>>();

  const vaultOverview = useGetVaultData({ address: accountAddress });

  const { vaultClientLoaded } = useSelector((state: StoreType) => state.general);

  const { selectedAccount } = useSubstrateSecureState();

  const { t } = useTranslation();

  if (!vaultOverview) {
    return (
      <MainContainer>
        <VaultsHeader title={t('vault.vault_overview')} accountAddress={accountAddress} />
        <PrimaryColorEllipsisLoader />
      </MainContainer>
    );
  }

  // TODO: remove redux dependency after account handling
  const isReadOnlyOverview = !vaultClientLoaded || selectedAccount?.address !== accountAddress;

  return (
    <MainContainer>
      {process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA && <ChainNotProducingBlocks />}
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
              collateralTokenTicker={vault.collateralId}
              wrappedSymbol={vault.wrappedId}
              pendingRequests={formatNumber(vault.pendingRequests)}
              apy={formatPercentage(vault.apy.toNumber())}
              collateralScore={vault.collateralization ? formatPercentage(vault.collateralization.toNumber()) : '∞'}
              link={`${accountAddress}/${vault.collateralId}/${vault.wrappedId}`}
              atRisk={vault.vaultAtRisk}
            />
          </GridItem>
        ))}
      </Grid>
      {!isReadOnlyOverview && <CreateVaults vaults={vaultOverview.vaults} />}
    </MainContainer>
  );
};

export default withErrorBoundary(VaultOverview, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
