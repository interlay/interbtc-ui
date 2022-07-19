import {
  CollateralCurrency,
  CollateralIdLiteral,
  CurrencyIdLiteral,
  newAccountId,
  VaultExt,
  VaultStatusExt
} from '@interlay/interbtc-api';
import { BitcoinAmount, BitcoinUnit } from '@interlay/monetary-js';
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
import InterlayCaliforniaContainedButton from '@/components/buttons/InterlayCaliforniaContainedButton';
import InterlayDefaultContainedButton from '@/components/buttons/InterlayDefaultContainedButton';
import InterlayDenimOrKintsugiSupernovaContainedButton from '@/components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import ErrorFallback from '@/components/ErrorFallback';
import InterlayTooltip from '@/components/UI/InterlayTooltip';
import { GOVERNANCE_TOKEN_SYMBOL, GovernanceTokenMonetaryAmount, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import SectionTitle from '@/parts/SectionTitle';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { WRAPPED_TOKEN_ID_LITERAL } from '@/utils/constants/currency';
import { URL_PARAMETERS } from '@/utils/constants/links';
import { getCurrency } from '@/utils/helpers/currencies';

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
  const [capacity, setCapacity] = React.useState(BitcoinAmount.zero);
  const [feesEarnedInterBTC, setFeesEarnedInterBTC] = React.useState(BitcoinAmount.zero);

  const { vaultClientLoaded, bridgeLoaded, address } = useSelector((state: StoreType) => state.general);
  const { collateralization, collateral, lockedBTC, apy } = useSelector((state: StoreType) => state.vault);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    [URL_PARAMETERS.VAULT.ACCOUNT]: selectedVaultAccountAddress,
    [URL_PARAMETERS.VAULT.COLLATERAL]: vaultCollateral
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

  // ray test touch <<
  const vaultAccountId = React.useMemo(() => {
    // eslint-disable-next-line max-len
    // TODO: should correct loading procedure according to https://kentcdodds.com/blog/application-state-management-with-react
    if (!bridgeLoaded) return;

    return newAccountId(window.bridge.api, selectedVaultAccountAddress);
  }, [bridgeLoaded, selectedVaultAccountAddress]);
  // ray test touch >>

  const collateralCurrencyValues = React.useMemo(() => getCurrency(vaultCollateral as CurrencyIdLiteral), [
    vaultCollateral
  ]);

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      if (!vaultAccountId) return;
      if (!collateralCurrencyValues) return;

      try {
        // TODO: should update using `react-query`
        const [feesPolkaBTC, lockedAmountBTC, collateralization, apyScore, issuableAmount] = await Promise.allSettled([
          window.bridge.vaults.getWrappedReward(
            vaultAccountId,
            collateralCurrencyValues.id as CollateralIdLiteral,
            WRAPPED_TOKEN_ID_LITERAL
          ),
          window.bridge.vaults.getIssuedAmount(vaultAccountId, collateralCurrencyValues.id),
          window.bridge.vaults.getVaultCollateralization(
            vaultAccountId,
            collateralCurrencyValues.id as CollateralIdLiteral
          ),
          window.bridge.vaults.getAPY(vaultAccountId, collateralCurrencyValues.id),
          window.bridge.issue.getVaultIssuableAmount(vaultAccountId, collateralCurrencyValues.id)
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
      } catch (error) {
        console.log('[Vault React.useEffect] error.message => ', error.message);
      }
    })();
  }, [collateralCurrencyValues, bridgeLoaded, dispatch, vaultAccountId]);

  const { data: governanceTokenReward, error: governanceTokenRewardError } = useQuery<
    GovernanceTokenMonetaryAmount,
    Error
  >(
    [
      GENERIC_FETCHER,
      'vaults',
      'getGovernanceReward',
      vaultAccountId,
      collateralCurrencyValues?.id,
      GOVERNANCE_TOKEN_SYMBOL
    ],
    genericFetcher<GovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(governanceTokenRewardError);

  const { data: vaultExt, error: vaultExtError } = useQuery<VaultExt<BitcoinUnit>, Error>(
    [GENERIC_FETCHER, 'vaults', 'get', vaultAccountId, collateralCurrencyValues?.id],
    genericFetcher<VaultExt<BitcoinUnit>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(vaultExtError);
  React.useEffect(() => {
    if (vaultExt === undefined) return;
    if (!dispatch) return;

    dispatch(updateCollateralAction(vaultExt.backingCollateral));
  }, [vaultExt, dispatch]);

  const vaultItems = React.useMemo(() => {
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
          collateralTokenSymbol: collateralCurrencyValues?.id
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
    collateralCurrencyValues,
    collateral,
    lockedBTC,
    capacity,
    apy
  ]);

  const hasLockedBTC = lockedBTC.gt(BitcoinAmount.zero);

  const isIssuingDisabled = vaultExt?.status !== VaultStatusExt.Active || capacity.lte(BitcoinAmount.zero);

  const issueButtonTooltip = (() => {
    if (vaultExt?.status !== VaultStatusExt.Active) {
      return t('vault.tooltip_issuing_deactivated');
    }
    if (capacity.lte(BitcoinAmount.zero)) {
      return t('vault.tooltip_issue_capacity_zero');
    }
    return t('vault.issue_vault');
  })();

  return (
    <>
      <MainContainer className='fade-in-animation'>
        <VaultsHeader title={t('vault.vault_dashboard')} accountAddress={selectedVaultAccountAddress} />
        <div className='space-y-6'>
          <SectionTitle>Vault Stats</SectionTitle>
          <div className={clsx('grid', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-5', '2xl:gap-6')}>
            {vaultItems.map((item) => (
              <StatPanel key={item.title} label={item.title} value={item.value} />
            ))}
            {vaultAccountId && <VaultStatusStatPanel collateralId={collateralCurrencyValues?.id} vaultAccountId={vaultAccountId} />}
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
            {vaultAccountId && collateralCurrencyValues && (
              <ClaimRewardsButton vaultAccountId={vaultAccountId} collateralToken={collateralCurrencyValues} />
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
        <VaultIssueRequestsTable
          vaultAddress={selectedVaultAccountAddress}
          collateralId={collateralCurrencyValues?.id}
        />
        <VaultRedeemRequestsTable
          vaultAddress={selectedVaultAccountAddress}
          collateralId={collateralCurrencyValues?.id}
        />
        <ReplaceTable vaultAddress={selectedVaultAccountAddress} collateralId={collateralCurrencyValues?.id} />
      </MainContainer>
      {collateralCurrencyValues && collateralUpdateStatus !== CollateralUpdateStatus.Close && vaultAccountId && (
        <UpdateCollateralModal
          open={
            collateralUpdateStatus === CollateralUpdateStatus.Deposit ||
            collateralUpdateStatus === CollateralUpdateStatus.Withdraw
          }
          onClose={handleUpdateCollateralModalClose}
          collateralUpdateStatus={collateralUpdateStatus}
          vaultAddress={selectedVaultAccountAddress}
          vaultAccountId={vaultAccountId}
          hasLockedBTC={hasLockedBTC}
          collateralCurrency={collateralCurrencyValues}
        />
      )}
      <RequestReplacementModal
        onClose={handleRequestReplaceModalClose}
        open={requestReplaceModalOpen}
        collateralCurrency={collateralCurrencyValues}
        vaultAddress={selectedVaultAccountAddress}
      />
      <RequestRedeemModal
        onClose={handleRequestRedeemModalClose}
        collateralCurrency={collateralCurrencyValues?.currency as CollateralCurrency}
        open={requestRedeemModalOpen}
        vaultAddress={selectedVaultAccountAddress}
      />
      <RequestIssueModal
        onClose={handleRequestIssueModalClose}
        open={requestIssueModalOpen}
        collateralIdLiteral={collateralCurrencyValues?.id}
        vaultAddress={selectedVaultAccountAddress}
      />
    </>
  );
};

export default withErrorBoundary(Vault, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
