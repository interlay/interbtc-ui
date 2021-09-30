import {
  useState,
  useEffect
} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  IssueColumns,
  RedeemColumns
} from '@interlay/interbtc-index-client';
import { BitcoinAmount } from '@interlay/monetary-js';

import UpdateCollateralModal, { CollateralUpdateStatus } from './update-collateral/update-collateral';
import RequestReplacementModal from './request-replacement/request-replacement';
import ReplaceTable from './ReplaceTable';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import VaultIssueRequestsTable from 'containers/VaultIssueRequestsTable';
import VaultRedeemRequestsTable from 'containers/VaultRedeemRequestsTable';
import CardList, {
  CardListItem,
  CardListItemHeader,
  CardListItemContent,
  CardListHeader,
  CardListContainer
} from 'components/CardList';
import BoldParagraph from 'components/BoldParagraph';
import InterlayDenimContainedButton from 'components/buttons/InterlayDenimContainedButton';
import InterlayCaliforniaContainedButton from 'components/buttons/InterlayCaliforniaContainedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
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

const VaultDashboard = (): JSX.Element => {
  const [updateCollateralModalStatus, setUpdateCollateralModalStatus] = useState(CollateralUpdateStatus.Hidden);
  const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
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
  const [capacity, setCapacity] = useState(BitcoinAmount.zero);
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState(BitcoinAmount.zero);
  const [totalIssueRequests, setTotalIssueRequests] = useState(0);
  const [totalRedeemRequests, setTotalRedeemRequests] = useState(0);

  const dispatch = useDispatch();
  const stats = useInterbtcIndex();
  const { t } = useTranslation();

  const closeUpdateCollateralModal = () => setUpdateCollateralModalStatus(CollateralUpdateStatus.Hidden);
  const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

  useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      if (!vaultClientLoaded) return;
      if (!address) return;

      try {
        const vaultId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);
        const [
          vault,
          feesPolkaBTC,
          lockedAmountBTC,
          collateralization,
          apyScore,
          issuableAmount,
          totalIssueRequests,
          totalRedeemRequests
        ] = await Promise.allSettled([
          window.bridge.interBtcApi.vaults.get(vaultId),
          window.bridge.interBtcApi.pools.getFeesWrapped(address),
          window.bridge.interBtcApi.vaults.getIssuedAmount(vaultId),
          window.bridge.interBtcApi.vaults.getVaultCollateralization(vaultId),
          window.bridge.interBtcApi.vaults.getAPY(vaultId),
          window.bridge.interBtcApi.vaults.getIssuableAmount(vaultId),
          stats.getFilteredTotalIssues({ filterIssueColumns: [{ column: IssueColumns.VaultId, value: address }] }),
          stats.getFilteredTotalRedeems({ filterRedeemColumns: [{ column: RedeemColumns.VaultId, value: address }] })
        ]);

        if (vault.status === 'fulfilled') {
          const collateralDot = vault.value.backingCollateral;
          dispatch(updateCollateralAction(collateralDot));
        }

        if (feesPolkaBTC.status === 'fulfilled') {
          setFeesEarnedPolkaBTC(feesPolkaBTC.value);
        }

        if (totalIssueRequests.status === 'fulfilled') {
          setTotalIssueRequests(totalIssueRequests.value);
        }

        if (totalRedeemRequests.status === 'fulfilled') {
          setTotalRedeemRequests(totalRedeemRequests.value);
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
        console.log('[VaultDashboard useEffect] error.message => ', error.message);
      }
    })();
  }, [
    bridgeLoaded,
    vaultClientLoaded,
    dispatch,
    address,
    stats
  ]);

  const VAULT_ITEMS = [
    {
      title: t('collateralization'),
      value: `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`,
      color: 'text-interlayDenim-800'
    },
    {
      title: t('vault.fees_earned_interbtc'),
      value: displayMonetaryAmount(feesEarnedPolkaBTC),
      color: 'text-interlayDenim-800'
    },
    {
      title: t('vault.locked_dot'),
      value: displayMonetaryAmount(collateral),
      color: 'text-interlayDenim-800'
    },
    {
      title: t('locked_btc'),
      value: displayMonetaryAmount(lockedBTC),
      color: 'text-interlayCalifornia-700'
    }, {
      title: t('vault.remaining_capacity'),
      value: displayMonetaryAmount(capacity),
      color: 'text-interlayDenim-800'
    },
    {
      title: t('apy'),
      value: `~${safeRoundTwoDecimals(apy)}%`,
      color: 'text-interlayDenim-800'
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
            {address}
          </BoldParagraph>
        </div>
        <CardListContainer>
          <CardListHeader>Vault Stats</CardListHeader>
          <CardList
            className={clsx(
              'md:grid-cols-3',
              'lg:grid-cols-4',
              'gap-5',
              '2xl:gap-6')}>
            {VAULT_ITEMS.map(vaultItem => (
              <CardListItem key={vaultItem.title}>
                <CardListItemHeader className={vaultItem.color}>
                  {vaultItem.title}
                </CardListItemHeader>
                <CardListItemContent
                  className={clsx(
                    'text-2xl',
                    'font-medium')}>
                  {vaultItem.value}
                </CardListItemContent>
              </CardListItem>
            ))}
          </CardList>
        </CardListContainer>
        <div
          className={clsx(
            'grid',
            'grid-cols-3',
            'gap-10'
          )}>
          <InterlayDenimContainedButton
            // TODO: should not use inlined functions
            onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
            {t('vault.deposit_collateral')}
          </InterlayDenimContainedButton>
          <InterlayDefaultContainedButton
            onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
            {t('vault.withdraw_collateral')}
          </InterlayDefaultContainedButton>
          {lockedBTC.gt(BitcoinAmount.zero) && (
            <InterlayCaliforniaContainedButton
              onClick={() => setShowRequestReplacementModal(true)}>
              {t('vault.replace_vault')}
            </InterlayCaliforniaContainedButton>
          )}
        </div>
        <VaultIssueRequestsTable
          totalIssueRequests={totalIssueRequests}
          vaultAddress={address} />
        <VaultRedeemRequestsTable
          totalRedeemRequests={totalRedeemRequests}
          vaultAddress={address} />
        <ReplaceTable />
      </MainContainer>
      <UpdateCollateralModal
        onClose={closeUpdateCollateralModal}
        status={updateCollateralModalStatus} />
      <RequestReplacementModal
        onClose={closeRequestReplacementModal}
        show={showRequestReplacementModal} />
    </>
  );
};

export default VaultDashboard;
