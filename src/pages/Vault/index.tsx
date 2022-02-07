
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import SectionTitle from 'parts/SectionTitle';
import BoldParagraph from 'components/BoldParagraph';
import
InterlayDenimOrKintsugiMidnightContainedButton
  from 'components/buttons/InterlayDenimOrKintsugiMidnightContainedButton';
import InterlayCaliforniaContainedButton from 'components/buttons/InterlayCaliforniaContainedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import Panel from 'components/Panel';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { URL_PARAMETERS } from 'utils/constants/links';
import {
  safeRoundTwoDecimals,
  displayMonetaryAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import {
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateAPYAction
} from 'common/actions/vault.actions';

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
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = React.useState(BitcoinAmount.zero);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { [URL_PARAMETERS.VAULT_ADDRESS]: selectedVaultAddress } = useParams<Record<string, string>>();

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

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      if (!selectedVaultAddress) return;

      try {
        const vaultId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, selectedVaultAddress);
        const collateralIdLiteral = tickerToCurrencyIdLiteral(COLLATERAL_TOKEN.ticker) as CollateralIdLiteral;
        const wrappedIdLiteral = tickerToCurrencyIdLiteral(WRAPPED_TOKEN.ticker) as WrappedIdLiteral;
        const [
          vault,
          feesPolkaBTC,
          lockedAmountBTC,
          collateralization,
          apyScore,
          issuableAmount
        ] = await Promise.allSettled([
          window.bridge.interBtcApi.vaults.get(vaultId, collateralIdLiteral),
          window.bridge.interBtcApi.vaults.getWrappedReward(
            newAccountId(window.bridge.interBtcApi.api, selectedVaultAddress),
            collateralIdLiteral,
            wrappedIdLiteral
          ),
          window.bridge.interBtcApi.vaults.getIssuedAmount(vaultId, collateralIdLiteral),
          window.bridge.interBtcApi.vaults.getVaultCollateralization(vaultId, collateralIdLiteral),
          window.bridge.interBtcApi.vaults.getAPY(vaultId, collateralIdLiteral),
          window.bridge.interBtcApi.issue.getVaultIssuableAmount(vaultId, collateralIdLiteral)
        ]);

        if (vault.status === 'fulfilled') {
          const collateralDot = vault.value.backingCollateral;
          dispatch(updateCollateralAction(collateralDot));
        }

        if (feesPolkaBTC.status === 'fulfilled') {
          setFeesEarnedPolkaBTC(feesPolkaBTC.value);
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
        console.log('[VaultDashboard React.useEffect] error.message => ', error.message);
      }
    })();
  }, [
    bridgeLoaded,
    dispatch,
    selectedVaultAddress
  ]);

  const VAULT_ITEMS = [
    {
      title: t('collateralization'),
      value: `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`
    },
    {
      title: t('vault.fees_earned_interbtc', {
        wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
      }),
      value: displayMonetaryAmount(feesEarnedPolkaBTC)
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
    }
  ];

  return (
    <>
      <MainContainer className='fade-in-animation'>
        <div>
          <PageTitle
            mainTitle={t('vault.vault_dashboard')}
            subTitle={<TimerIncrement />} />
          <BoldParagraph className='text-center'>
            {selectedVaultAddress}
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
            {VAULT_ITEMS.map(item => (
              <Panel
                key={item.title}
                className={clsx(
                  'px-4',
                  'py-5'
                )}>
                <dt
                  className={clsx(
                    'text-sm',
                    'font-medium',
                    'truncate',
                    { 'text-interlayTextPrimaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  )}>
                  {item.title}
                </dt>
                <dd
                  className={clsx(
                    'mt-1',
                    'text-3xl',
                    'font-semibold',
                    { 'text-interlayDenim':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                    { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                  )}>
                  {item.value}
                </dd>
              </Panel>
            ))}
          </div>
        </div>
        {/* Check interaction with the vault */}
        {vaultClientLoaded && address === selectedVaultAddress && (
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
          vaultAddress={selectedVaultAddress} />
        <VaultRedeemRequestsTable
          vaultAddress={selectedVaultAddress} />
        <ReplaceTable vaultAddress={selectedVaultAddress} />
      </MainContainer>
      {collateralUpdateStatus !== CollateralUpdateStatus.Close && (
        <UpdateCollateralModal
          open={
            collateralUpdateStatus === CollateralUpdateStatus.Deposit ||
            collateralUpdateStatus === CollateralUpdateStatus.Withdraw
          }
          onClose={handleUpdateCollateralModalClose}
          collateralUpdateStatus={collateralUpdateStatus}
          vaultAddress={selectedVaultAddress} />
      )}
      <RequestReplacementModal
        onClose={handleRequestReplacementModalClose}
        open={requestReplacementModalOpen}
        vaultAddress={selectedVaultAddress} />
    </>
  );
};

export default Vault;
