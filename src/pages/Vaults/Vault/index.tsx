import { CollateralIdLiteral, VaultExt, VaultStatusExt } from '@interlay/interbtc-api';
import { BitcoinAmount } from '@interlay/monetary-js';
import clsx from 'clsx';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  updateAPYAction,
  updateCollateralAction,
  updateCollateralizationAction,
  updateLockedBTCAction
} from '@/common/actions/vault.actions';
import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, safeRoundTwoDecimals } from '@/common/utils/utils';
import { Dl } from '@/component-library';
import InterlayCaliforniaContainedButton from '@/components/buttons/InterlayCaliforniaContainedButton';
import InterlayDefaultContainedButton from '@/components/buttons/InterlayDefaultContainedButton';
import InterlayDenimOrKintsugiSupernovaContainedButton from '@/components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import ErrorFallback from '@/components/ErrorFallback';
import Panel from '@/components/Panel';
import InterlayTooltip from '@/components/UI/InterlayTooltip';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import SectionTitle from '@/parts/SectionTitle';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getCurrency } from '@/utils/helpers/currencies';
import useAccountId from '@/utils/hooks/use-account-id';

import { VaultsHeader } from '../VaultsHeader';
import ClaimRewardsButton from './ClaimRewardsButton';
import ReplaceTable from './ReplaceTable';
import RequestIssueModal from './RequestIssueModal';
import RequestRedeemModal from './RequestRedeemModal';
import RequestReplacementModal from './RequestReplacementModal';
import StatPanel from './StatPanel';
import UpdateCollateralModal, { CollateralUpdateStatus } from './UpdateCollateralModal';
import VaultIssueRequestsTable from './VaultIssueRequestsTable';
import VaultRedeemRequestsTable from './VaultRedeemRequestsTable';
import VaultStatusStatPanel from './VaultStatusStatPanel';

const Vault = (): JSX.Element => {
  const [collateralUpdateStatus, setCollateralUpdateStatus] = React.useState(CollateralUpdateStatus.Close);
  const [requestReplaceModalOpen, setRequestReplaceModalOpen] = React.useState(false);
  const [requestRedeemModalOpen, setRequestRedeemModalOpen] = React.useState(false);
  const [requestIssueModalOpen, setRequestIssueModalOpen] = React.useState(false);
  const [capacity, setCapacity] = React.useState(BitcoinAmount.zero());
  const [feesEarnedInterBTC, setFeesEarnedInterBTC] = React.useState(BitcoinAmount.zero());
  const [liquidationThreshold, setLiquidationThreshold] = React.useState('');
  const [premiumRedeemThreshold, setPremiumRedeemThreshold] = React.useState('');
  const [secureThreshold, setSecureThreshold] = React.useState('');

  const { vaultClientLoaded, bridgeLoaded, address } = useSelector((state: StoreType) => state.general);
  const { collateralization, collateral, lockedBTC, apy } = useSelector((state: StoreType) => state.vault);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    [URL_PARAMETERS.VAULT.ACCOUNT]: selectedVaultAccountAddress,
    [URL_PARAMETERS.VAULT.COLLATERAL]: vaultCollateralIdLiteral
  } = useParams<Record<string, string>>();

  const handleUpdateCollateralModalClose = () => {
    setCollateralUpdateStatus(CollateralUpdateStatus.Close);
  };
  const handleDepositCollateralModalOpen = () => {
    setCollateralUpdateStatus(CollateralUpdateStatus.Deposit);
  };
  const handleWithdrawCollateralModalOpen = () => {
    setCollateralUpdateStatus(CollateralUpdateStatus.Withdraw);
  };
  const handleRequestReplaceModalClose = () => {
    setRequestReplaceModalOpen(false);
  };
  const handleRequestReplaceModalOpen = () => {
    setRequestReplaceModalOpen(true);
  };
  const handleRequestRedeemModalClose = () => {
    setRequestRedeemModalOpen(false);
  };
  const handleRequestRedeemModalOpen = () => {
    setRequestRedeemModalOpen(true);
  };
  const handleRequestIssueModalClose = () => {
    setRequestIssueModalOpen(false);
  };
  const handleRequestIssueModalOpen = () => {
    setRequestIssueModalOpen(true);
  };

  const vaultAccountId = useAccountId(selectedVaultAccountAddress);

  const collateralToken = React.useMemo(() => {
    if (!vaultCollateralIdLiteral) return;

    return getCurrency(vaultCollateralIdLiteral as CollateralIdLiteral);
  }, [vaultCollateralIdLiteral]);

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      if (!vaultAccountId) return;
      if (!collateralToken) return;

      try {
        // TODO: should update using `react-query`
        const [feesPolkaBTC, lockedAmountBTC, collateralization, apyScore, issuableAmount, liquidationThreshold, premiumRedeemThreshold, secureThreshold] = await Promise.allSettled([
          window.bridge.vaults.getWrappedReward(vaultAccountId, collateralToken, WRAPPED_TOKEN),
          window.bridge.vaults.getIssuedAmount(vaultAccountId, collateralToken),
          window.bridge.vaults.getVaultCollateralization(vaultAccountId, collateralToken),
          window.bridge.vaults.getAPY(vaultAccountId, collateralToken),
          window.bridge.vaults.getIssuableTokensFromVault(vaultAccountId, collateralToken),
          window.bridge.vaults.getLiquidationCollateralThreshold(collateralToken),
          window.bridge.vaults.getPremiumRedeemThreshold(collateralToken),
          window.bridge.vaults.getSecureCollateralThreshold(collateralToken)
        ]);

        if (feesPolkaBTC.status === 'fulfilled') {
          setFeesEarnedInterBTC(feesPolkaBTC.value);
        }

        if (lockedAmountBTC.status === 'fulfilled') {
          dispatch(updateLockedBTCAction(lockedAmountBTC.value));
        }

        if (collateralization.status === 'fulfilled') {
          dispatch(updateCollateralizationAction(collateralization.value?.mul(100).toString()));
        }

        if (apyScore.status === 'fulfilled') {
          dispatch(updateAPYAction(apyScore.value.toString()));
        }

        if (issuableAmount.status === 'fulfilled') {
          setCapacity(issuableAmount.value);
        }
        if (liquidationThreshold.status === 'fulfilled') {
          setLiquidationThreshold(liquidationThreshold.value?.mul(100).toString());
        }
        if (premiumRedeemThreshold.status === 'fulfilled') {
          setPremiumRedeemThreshold(premiumRedeemThreshold.value?.mul(100).toString());
        }
        if (secureThreshold.status === 'fulfilled') {
          setSecureThreshold(secureThreshold.value?.mul(100).toString());
        }
      } catch (error) {
        console.log('[Vault React.useEffect] error.message => ', error.message);
      }
    })();
  }, [collateralToken, bridgeLoaded, dispatch, vaultAccountId]);

  const { data: governanceTokenReward, error: governanceTokenRewardError } = useQuery<
    GovernanceTokenMonetaryAmount,
    Error
  >(
    [GENERIC_FETCHER, 'vaults', 'getGovernanceReward', vaultAccountId, collateralToken, GOVERNANCE_TOKEN],
    genericFetcher<GovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded && !!collateralToken && !!vaultAccountId
    }
  );
  useErrorHandler(governanceTokenRewardError);

  const { data: vaultExt, error: vaultExtError } = useQuery<VaultExt, Error>(
    [GENERIC_FETCHER, 'vaults', 'get', vaultAccountId, collateralToken],
    genericFetcher<VaultExt>(),
    {
      enabled: !!bridgeLoaded && !!collateralToken && !!vaultAccountId
    }
  );
  useErrorHandler(vaultExtError);
  React.useEffect(() => {
    if (vaultExt === undefined) return;
    if (!dispatch) return;

    dispatch(updateCollateralAction(vaultExt.backingCollateral));
  }, [vaultExt, dispatch]);

  const vaultItems = React.useMemo(() => {
    if (!collateralToken) return [];

    const governanceRewardLabel =
      governanceTokenReward === undefined ? '-' : displayMonetaryAmount(governanceTokenReward);

    return [
      {
        title: t('collateralization'),
        value:
          collateralization === '∞' ? collateralization : `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`
      },
      {
        title: t('vault.fees_earned_interbtc', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        }),
        value: displayMonetaryAmount(feesEarnedInterBTC)
      },
      {
        title: t('vault.locked_collateral', {
          // TODO: when updating kint and adding the vault collateral as config,
          // this will need to be changed to use the symbol not the id literal.
          collateralTokenSymbol: collateralToken.ticker
        }),
        value: displayMonetaryAmount(collateral)
      },
      {
        title: t('locked_btc'),
        value: displayMonetaryAmount(lockedBTC),
        color: 'text-interlayCalifornia-700'
      },
      {
        title: t('vault.remaining_capacity', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        }),
        value: displayMonetaryAmount(capacity)
      },
      {
        title: t('apy'),
        value: `≈${safeRoundTwoDecimals(apy)}%`
      },
      {
        title: t('vault.rewards_earned_governance_token_symbol', {
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
        }),
        value: governanceRewardLabel
      }
    ];
  }, [
    governanceTokenReward,
    t,
    collateralization,
    feesEarnedInterBTC,
    collateralToken,
    collateral,
    lockedBTC,
    capacity,
    apy
  ]);

  const hasLockedBTC = lockedBTC.gt(BitcoinAmount.zero());

  const isIssuingDisabled = vaultExt?.status !== VaultStatusExt.Active || capacity.lte(BitcoinAmount.zero());

  const issueButtonTooltip = (() => {
    if (vaultExt?.status !== VaultStatusExt.Active) {
      return t('vault.tooltip_issuing_deactivated');
    }
    if (capacity.lte(BitcoinAmount.zero())) {
      return t('vault.tooltip_issue_capacity_zero');
    }
    return t('vault.issue_vault');
  })();

  return (
    <>
      <MainContainer className='fade-in-animation'>
        <VaultsHeader title={t('vault.vault_dashboard')} accountAddress={selectedVaultAccountAddress} />
        <div className='space-y-6'>
          <SectionTitle>
            Vault Stats: {collateralToken?.ticker}/{WRAPPED_TOKEN_SYMBOL}{' '}
          </SectionTitle>
          <Panel className={clsx('inline-block', 'px-4', 'py-2')}>
            <Dl
              listItems={[
                { term: 'Liquidation threshold', definition: `${liquidationThreshold}%` },
                { term: 'Premium redeem threshold', definition: `${premiumRedeemThreshold}%` },
                { term: 'Ideal threshold', definition: `${secureThreshold}%` }
              ]}
            />
          </Panel>
          <div className={clsx('grid', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-5', '2xl:gap-6')}>
            {vaultItems.map((item) => (
              <StatPanel key={item.title} label={item.title} value={item.value} />
            ))}
            {vaultAccountId && collateralToken && (
              <VaultStatusStatPanel collateralToken={collateralToken} vaultAccountId={vaultAccountId} />
            )}
          </div>
        </div>
        {/* Check interaction with the vault */}
        {vaultClientLoaded && address === selectedVaultAccountAddress && (
          <div className={clsx('grid', hasLockedBTC ? 'grid-cols-6' : 'grid-cols-4', 'gap-5')}>
            <InterlayDenimOrKintsugiSupernovaContainedButton onClick={handleDepositCollateralModalOpen}>
              {t('vault.deposit_collateral')}
            </InterlayDenimOrKintsugiSupernovaContainedButton>
            <InterlayDefaultContainedButton onClick={handleWithdrawCollateralModalOpen}>
              {t('vault.withdraw_collateral')}
            </InterlayDefaultContainedButton>
            {vaultAccountId && collateralToken && (
              <ClaimRewardsButton vaultAccountId={vaultAccountId} collateralToken={collateralToken} />
            )}
            <InterlayTooltip label={issueButtonTooltip}>
              {/* Button wrapped in div to enable tooltip on disabled button. */}
              <div className='grid'>
                <InterlayCaliforniaContainedButton onClick={handleRequestIssueModalOpen} disabled={isIssuingDisabled}>
                  {t('vault.issue_vault')}
                </InterlayCaliforniaContainedButton>
              </div>
            </InterlayTooltip>
            {hasLockedBTC && (
              <InterlayCaliforniaContainedButton onClick={handleRequestReplaceModalOpen}>
                {t('vault.replace_vault')}
              </InterlayCaliforniaContainedButton>
            )}
            {hasLockedBTC && (
              <InterlayCaliforniaContainedButton onClick={handleRequestRedeemModalOpen}>
                {t('vault.redeem_vault')}
              </InterlayCaliforniaContainedButton>
            )}
          </div>
        )}
        {collateralToken && (
          <VaultIssueRequestsTable
            vaultAddress={selectedVaultAccountAddress}
            collateralTokenIdLiteral={collateralToken.ticker as CollateralIdLiteral}
          />
        )}
        {collateralToken && (
          <VaultRedeemRequestsTable
            vaultAddress={selectedVaultAccountAddress}
            collateralTokenIdLiteral={collateralToken.ticker as CollateralIdLiteral}
          />
        )}
        {collateralToken && (
          <ReplaceTable
            vaultAddress={selectedVaultAccountAddress}
            collateralTokenIdLiteral={collateralToken.ticker as CollateralIdLiteral}
          />
        )}
      </MainContainer>
      {collateralToken && collateralUpdateStatus !== CollateralUpdateStatus.Close && vaultAccountId && (
        <UpdateCollateralModal
          open={
            collateralUpdateStatus === CollateralUpdateStatus.Deposit ||
            collateralUpdateStatus === CollateralUpdateStatus.Withdraw
          }
          onClose={handleUpdateCollateralModalClose}
          collateralUpdateStatus={collateralUpdateStatus}
          vaultAddress={selectedVaultAccountAddress}
          hasLockedBTC={hasLockedBTC}
          collateralToken={collateralToken}
        />
      )}
      {collateralToken && (
        <RequestReplacementModal
          onClose={handleRequestReplaceModalClose}
          open={requestReplaceModalOpen}
          collateralToken={collateralToken}
          vaultAddress={selectedVaultAccountAddress}
        />
      )}
      {collateralToken && (
        <RequestRedeemModal
          onClose={handleRequestRedeemModalClose}
          collateralToken={collateralToken}
          open={requestRedeemModalOpen}
          vaultAddress={selectedVaultAccountAddress}
        />
      )}
      {collateralToken && (
        <RequestIssueModal
          onClose={handleRequestIssueModalClose}
          open={requestIssueModalOpen}
          collateralToken={collateralToken}
          vaultAddress={selectedVaultAccountAddress}
        />
      )}
    </>
  );
};

export default withErrorBoundary(Vault, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
