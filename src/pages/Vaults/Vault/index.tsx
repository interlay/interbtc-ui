
import * as React from 'react';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  BitcoinAmount,
  BitcoinUnit
} from '@interlay/monetary-js';
import {
  newAccountId,
  VaultExt,
  tickerToCurrencyIdLiteral,
  CollateralIdLiteral
} from '@interlay/interbtc-api';

import UpdateCollateralModal, { CollateralUpdateStatus } from './UpdateCollateralModal';
import RequestReplacementModal from './RequestReplacementModal';
import RequestRedeemModal from './RequestRedeemModal';
import ReplaceTable from './ReplaceTable';
import VaultIssueRequestsTable from './VaultIssueRequestsTable';
import VaultRedeemRequestsTable from './VaultRedeemRequestsTable';
import StatPanel from './StatPanel';
import VaultStatusStatPanel from './VaultStatusStatPanel';
import ClaimRewardsButton from './ClaimRewardsButton';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import SectionTitle from 'parts/SectionTitle';
import BoldParagraph from 'components/BoldParagraph';
import ErrorFallback from 'components/ErrorFallback';
import
InterlayDenimOrKintsugiSupernovaContainedButton
  from 'components/buttons/InterlayDenimOrKintsugiSupernovaContainedButton';
import InterlayCaliforniaContainedButton from 'components/buttons/InterlayCaliforniaContainedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import {
  WRAPPED_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount
} from 'config/relay-chains';
import { URL_PARAMETERS } from 'utils/constants/links';
import {
  WRAPPED_TOKEN_ID_LITERAL
} from 'utils/constants/currency';
import {
  safeRoundTwoDecimals,
  displayMonetaryAmount
} from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';
import {
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateAPYAction
} from 'common/actions/vault.actions';

const Vault = (): JSX.Element => {
  const [collateralUpdateStatus, setCollateralUpdateStatus] = React.useState(CollateralUpdateStatus.Close);
  const [requestReplaceModalOpen, setRequestReplaceModalOpen] = React.useState(false);
  const [requestRedeemModalOpen, setRequestRedeemModalOpen] = React.useState(false);
  const [capacity, setCapacity] = React.useState(BitcoinAmount.zero);
  const [feesEarnedInterBTC, setFeesEarnedInterBTC] = React.useState(BitcoinAmount.zero);

  const {
    vaultClientLoaded,
    bridgeLoaded,
    address
  } = useSelector((state: StoreType) => state.general);
  const {
    collateralization,
    collateral,
    lockedBTC,
    apy
  } = useSelector((state: StoreType) => state.vault);

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

  const vaultAccountId = React.useMemo(() => {
    // eslint-disable-next-line max-len
    // TODO: should correct loading procedure according to https://kentcdodds.com/blog/application-state-management-with-react
    if (!bridgeLoaded) return;

    return newAccountId(window.bridge.api, selectedVaultAccountAddress);
  }, [
    bridgeLoaded,
    selectedVaultAccountAddress
  ]);

  const vaultCollateralIdLiteral = React.useMemo(() => (
    tickerToCurrencyIdLiteral(vaultCollateral) as CollateralIdLiteral
  ), [vaultCollateral]);

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      if (!vaultAccountId) return;
      if (!vaultCollateralIdLiteral) return;

      try {
        // TODO: should update using `react-query`
        const [
          feesPolkaBTC,
          lockedAmountBTC,
          collateralization,
          apyScore,
          issuableAmount
        ] = await Promise.allSettled([
          window.bridge.vaults.getWrappedReward(
            vaultAccountId,
            vaultCollateralIdLiteral,
            WRAPPED_TOKEN_ID_LITERAL
          ),
          window.bridge.vaults.getIssuedAmount(vaultAccountId, vaultCollateralIdLiteral),
          window.bridge.vaults.getVaultCollateralization(vaultAccountId, vaultCollateralIdLiteral),
          window.bridge.vaults.getAPY(vaultAccountId, vaultCollateralIdLiteral),
          window.bridge.issue.getVaultIssuableAmount(vaultAccountId, vaultCollateralIdLiteral)
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
  }, [
    vaultCollateralIdLiteral,
    bridgeLoaded,
    dispatch,
    vaultAccountId
  ]);

  const {
    data: governanceTokenReward,
    error: governanceTokenRewardError
  } = useQuery<GovernanceTokenMonetaryAmount, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getGovernanceReward',
      vaultAccountId,
      vaultCollateralIdLiteral,
      GOVERNANCE_TOKEN_SYMBOL
    ],
    genericFetcher<GovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(governanceTokenRewardError);

  const {
    data: vaultExt,
    error: vaultExtError
  } = useQuery<VaultExt<BitcoinUnit>, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'get',
      vaultAccountId,
      vaultCollateralIdLiteral
    ],
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
  }, [
    vaultExt,
    dispatch
  ]);

  const vaultItems = React.useMemo(() => {
    const governanceRewardLabel =
      governanceTokenReward === undefined ?
        '-' :
        displayMonetaryAmount(governanceTokenReward);

    return [
      {
        title: t('collateralization'),
        value: collateralization === '∞' ?
          collateralization :
          `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`
      },
      {
        title: t('vault.fees_earned_interbtc', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        }),
        value: displayMonetaryAmount(feesEarnedInterBTC)
      },
      {
        title: t('vault.locked_dot', {
          collateralTokenSymbol: vaultCollateralIdLiteral
        }),
        value: displayMonetaryAmount(collateral)
      },
      {
        title: t('locked_btc'),
        value: displayMonetaryAmount(lockedBTC),
        color: 'text-interlayCalifornia-700'
      }, {
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
    vaultCollateralIdLiteral,
    collateral,
    lockedBTC,
    capacity,
    apy
  ]);

  const hasLockedBTC = lockedBTC.gt(BitcoinAmount.zero);

  return (
    <>
      <MainContainer className='fade-in-animation'>
        <div>
          <PageTitle
            mainTitle={t('vault.vault_dashboard')}
            subTitle={<TimerIncrement />} />
          <BoldParagraph className='text-center'>
            {selectedVaultAccountAddress}
          </BoldParagraph>
        </div>
        <div className='space-y-6'>
          <SectionTitle>Vault Stats</SectionTitle>
          <div
            className={clsx(
              'grid',
              'md:grid-cols-3',
              'lg:grid-cols-4',
              'gap-5',
              '2xl:gap-6'
            )}>
            {vaultItems.map(item => (
              <StatPanel
                key={item.title}
                label={item.title}
                value={item.value} />
            ))}
            <VaultStatusStatPanel vaultAccountId={vaultAccountId} />
          </div>
        </div>
        {/* Check interaction with the vault */}
        {vaultClientLoaded && address === selectedVaultAccountAddress && (
          <div
            className={clsx(
              'grid',
              hasLockedBTC ?
                'grid-cols-5' :
                'grid-cols-3',
              'gap-5'
            )}>
            <InterlayDenimOrKintsugiSupernovaContainedButton
              onClick={handleDepositCollateralModalOpen}>
              {t('vault.deposit_collateral')}
            </InterlayDenimOrKintsugiSupernovaContainedButton>
            <InterlayDefaultContainedButton
              onClick={handleWithdrawCollateralModalOpen}>
              {t('vault.withdraw_collateral')}
            </InterlayDefaultContainedButton>
            <ClaimRewardsButton vaultAccountId={vaultAccountId} />
            {hasLockedBTC && (
              <InterlayCaliforniaContainedButton
                onClick={handleRequestReplaceModalOpen}>
                {t('vault.replace_vault')}
              </InterlayCaliforniaContainedButton>
            )}
            {hasLockedBTC && (
              <InterlayCaliforniaContainedButton
                onClick={handleRequestRedeemModalOpen}>
                {t('vault.redeem_vault')}
              </InterlayCaliforniaContainedButton>
            )}
          </div>
        )}
        <VaultIssueRequestsTable
          vaultAddress={selectedVaultAccountAddress} />
        <VaultRedeemRequestsTable
          vaultAddress={selectedVaultAccountAddress} />
        <ReplaceTable vaultAddress={selectedVaultAccountAddress} />
      </MainContainer>
      {collateralUpdateStatus !== CollateralUpdateStatus.Close && (
        <UpdateCollateralModal
          open={
            collateralUpdateStatus === CollateralUpdateStatus.Deposit ||
            collateralUpdateStatus === CollateralUpdateStatus.Withdraw
          }
          onClose={handleUpdateCollateralModalClose}
          collateralUpdateStatus={collateralUpdateStatus}
          vaultAddress={selectedVaultAccountAddress}
          hasLockedBTC={hasLockedBTC} />
      )}
      <RequestReplacementModal
        onClose={handleRequestReplaceModalClose}
        open={requestReplaceModalOpen}
        vaultAddress={selectedVaultAccountAddress} />
      <RequestRedeemModal
        onClose={handleRequestRedeemModalClose}
        open={requestRedeemModalOpen}
        vaultAddress={selectedVaultAccountAddress} />
    </>
  );
};

export default withErrorBoundary(Vault, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
