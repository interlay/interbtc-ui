
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
import { BitcoinAmount } from '@interlay/monetary-js';
import {
  CollateralIdLiteral,
  newAccountId,
  tickerToCurrencyIdLiteral,
  WrappedIdLiteral
} from '@interlay/interbtc-api';

import UpdateCollateralModal, { CollateralUpdateStatus } from './UpdateCollateralModal';
import RequestReplacementModal from './RequestReplacementModal';
import ReplaceTable from './ReplaceTable';
import VaultIssueRequestsTable from './VaultIssueRequestsTable';
import VaultRedeemRequestsTable from './VaultRedeemRequestsTable';
import StatusPanel from './StatusPanel';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import SectionTitle from 'parts/SectionTitle';
import BoldParagraph from 'components/BoldParagraph';
import ErrorFallback from 'components/ErrorFallback';
import
InterlayDenimOrKintsugiMidnightContainedButton
  from 'components/buttons/InterlayDenimOrKintsugiMidnightContainedButton';
import InterlayCaliforniaContainedButton from 'components/buttons/InterlayCaliforniaContainedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import {
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount
} from 'config/relay-chains';
import { URL_PARAMETERS } from 'utils/constants/links';
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

const COLLATERAL_ID_LITERAL = tickerToCurrencyIdLiteral(COLLATERAL_TOKEN.ticker) as CollateralIdLiteral;
const WRAPPED_ID_LITERAL = tickerToCurrencyIdLiteral(WRAPPED_TOKEN.ticker) as WrappedIdLiteral;

const Vault = (): JSX.Element => {
  const [collateralUpdateStatus, setCollateralUpdateStatus] = React.useState(CollateralUpdateStatus.Close);
  const [requestReplacementModalOpen, setRequestReplacementModalOpen] = React.useState(false);
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
  const [capacity, setCapacity] = React.useState(BitcoinAmount.zero);
  const [feesEarnedInterBTC, setFeesEarnedInterBTC] = React.useState(BitcoinAmount.zero);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { [URL_PARAMETERS.VAULT_ACCOUNT_ADDRESS]: selectedVaultAccountAddress } = useParams<Record<string, string>>();

  const handleUpdateCollateralModalClose = () => {
    setCollateralUpdateStatus(CollateralUpdateStatus.Close);
  };
  const handleDepositCollateralModalOpen = () => {
    setCollateralUpdateStatus(CollateralUpdateStatus.Deposit);
  };
  const handleWithdrawCollateralModalOpen = () => {
    setCollateralUpdateStatus(CollateralUpdateStatus.Withdraw);
  };
  const handleRequestReplacementModalClose = () => {
    setRequestReplacementModalOpen(false);
  };
  const handleRequestReplacementModalOpen = () => {
    setRequestReplacementModalOpen(true);
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

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      if (!vaultAccountId) return;

      try {
        // TODO: should update using `react-query`
        const [
          vault,
          feesPolkaBTC,
          lockedAmountBTC,
          collateralization,
          apyScore,
          issuableAmount
        ] = await Promise.allSettled([
          window.bridge.vaults.get(vaultAccountId, COLLATERAL_ID_LITERAL),
          window.bridge.vaults.getWrappedReward(
            vaultAccountId,
            COLLATERAL_ID_LITERAL,
            WRAPPED_ID_LITERAL
          ),
          window.bridge.vaults.getIssuedAmount(vaultAccountId, COLLATERAL_ID_LITERAL),
          window.bridge.vaults.getVaultCollateralization(vaultAccountId, COLLATERAL_ID_LITERAL),
          window.bridge.vaults.getAPY(vaultAccountId, COLLATERAL_ID_LITERAL),
          window.bridge.issue.getVaultIssuableAmount(vaultAccountId, COLLATERAL_ID_LITERAL)
        ]);

        if (vault.status === 'fulfilled') {
          const collateralDot = vault.value.backingCollateral;
          dispatch(updateCollateralAction(collateralDot));
        }

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
    bridgeLoaded,
    dispatch,
    vaultAccountId
  ]);

  const {
    data: governanceReward,
    error: governanceRewardError
  } = useQuery<GovernanceTokenMonetaryAmount, Error>(
    [
      GENERIC_FETCHER,
      'vaults',
      'getGovernanceReward',
      vaultAccountId,
      COLLATERAL_ID_LITERAL,
      GOVERNANCE_TOKEN_SYMBOL
    ],
    genericFetcher<GovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(governanceRewardError);

  const vaultItems = React.useMemo(() => {
    const governanceRewardLabel =
      governanceReward === undefined ?
        '-' :
        displayMonetaryAmount(governanceReward);

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
          collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
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
    apy,
    capacity,
    collateral,
    collateralization,
    feesEarnedInterBTC,
    lockedBTC,
    t,
    governanceReward
  ]);

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
              <StatusPanel
                key={item.title}
                label={item.title}
                value={item.value} />
            ))}
          </div>
        </div>
        {/* Check interaction with the vault */}
        {vaultClientLoaded && address === selectedVaultAccountAddress && (
          <div
            className={clsx(
              'grid',
              'grid-cols-3',
              'gap-10'
            )}>
            <InterlayDenimOrKintsugiMidnightContainedButton
              onClick={handleDepositCollateralModalOpen}>
              {t('vault.deposit_collateral')}
            </InterlayDenimOrKintsugiMidnightContainedButton>
            <InterlayDefaultContainedButton
              onClick={handleWithdrawCollateralModalOpen}>
              {t('vault.withdraw_collateral')}
            </InterlayDefaultContainedButton>
            {lockedBTC.gt(BitcoinAmount.zero) && (
              <InterlayCaliforniaContainedButton
                onClick={handleRequestReplacementModalOpen}>
                {t('vault.replace_vault')}
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
          hasLockedBTC={lockedBTC.gt(BitcoinAmount.zero)} />
      )}
      <RequestReplacementModal
        onClose={handleRequestReplacementModalClose}
        open={requestReplacementModalOpen}
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
