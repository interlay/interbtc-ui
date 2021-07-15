import {
  useState,
  useEffect
} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import clsx from 'clsx';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import { planckToDOT } from '@interlay/interbtc';
import {
  IssueColumns,
  RedeemColumns
} from '@interlay/interbtc-index-client';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
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
import UpdateCollateralModal, { CollateralUpdateStatus } from './update-collateral/update-collateral';
import RequestReplacementModal from './request-replacement/request-replacement';
import ReplaceTable from './replace-table/replace-table';
import { StoreType } from 'common/types/util.types';
import {
  safeRoundTwoDecimals,
  displayMonetaryAmount,
  safeRoundFiveDecimals
} from 'common/utils/utils';
import {
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateSLAAction,
  updateAPYAction
} from 'common/actions/vault.actions';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import './vault-dashboard.page.scss';
import VaultIssueRequestsTable from 'containers/VaultIssueRequestTable';
import VaultRedeemRequestsTable from 'containers/VaultRedeemRequestTable';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { BTCAmount, Polkadot, PolkadotAmount } from '@interlay/monetary-js';

function VaultDashboard(): JSX.Element {
  const [updateCollateralModalStatus, setUpdateCollateralModalStatus] = useState(CollateralUpdateStatus.Hidden);
  const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
  const {
    vaultClientLoaded,
    polkaBtcLoaded,
    address
  } = useSelector((state: StoreType) => state.general);
  const {
    collateralization,
    collateral,
    lockedBTC,
    sla,
    apy
  } = useSelector((state: StoreType) => state.vault);
  const [capacity, setCapacity] = useState(BTCAmount.zero);
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState(BTCAmount.zero);
  const [feesEarnedDOT, setFeesEarnedDOT] = useState(PolkadotAmount.zero);
  const [totalIssueRequests, setTotalIssueRequests] = useState(0);
  const [totalRedeemRequests, setTotalRedeemRequests] = useState(0);

  const dispatch = useDispatch();
  const stats = useInterbtcIndex();
  const { t } = useTranslation();

  const closeUpdateCollateralModal = () => setUpdateCollateralModalStatus(CollateralUpdateStatus.Hidden);
  const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

  useEffect(() => {
    (async () => {
      if (!polkaBtcLoaded) return;
      if (!vaultClientLoaded) return;
      if (!address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const [
          vault,
          feesPolkaBTC,
          feesDOT,
          lockedAmountBTC,
          collateralization,
          slaScore,
          apyScore,
          issuableAmount,
          totalIssueRequests,
          totalRedeemRequests
        ] = await Promise.allSettled([
          window.polkaBTC.vaults.get(vaultId),
          window.polkaBTC.vaults.getFeesWrapped(address),
          window.polkaBTC.vaults.getFeesCollateral(address, Polkadot),
          window.polkaBTC.vaults.getIssuedAmount(vaultId),
          window.polkaBTC.vaults.getVaultCollateralization(vaultId),
          window.polkaBTC.vaults.getSLA(vaultId),
          window.polkaBTC.vaults.getAPY(vaultId),
          window.polkaBTC.vaults.getIssuableAmount(vaultId),
          stats.getFilteredTotalIssues({ filterIssueColumns: [{ column: IssueColumns.VaultId, value: address }] }),
          stats.getFilteredTotalRedeems({ filterRedeemColumns: [{ column: RedeemColumns.VaultId, value: address }] })
        ]);

        if (vault.status === 'fulfilled') {
          const collateralDot = planckToDOT(vault.value.backing_collateral);
          dispatch(updateCollateralAction(collateralDot.toString()));
        }

        if (feesPolkaBTC.status === 'fulfilled') {
          setFeesEarnedPolkaBTC(feesPolkaBTC.value);
        }

        if (feesDOT.status === 'fulfilled') {
          setFeesEarnedDOT(feesDOT.value);
        }

        if (totalIssueRequests.status === 'fulfilled') {
          setTotalIssueRequests(totalIssueRequests.value);
        }

        if (totalRedeemRequests.status === 'fulfilled') {
          setTotalRedeemRequests(totalRedeemRequests.value);
        }

        if (lockedAmountBTC.status === 'fulfilled') {
          dispatch(updateLockedBTCAction(lockedAmountBTC.value.toHuman()));
        }

        if (collateralization.status === 'fulfilled') {
          dispatch(updateCollateralizationAction(collateralization.value?.mul(100).toString()));
        }

        if (slaScore.status === 'fulfilled') {
          dispatch(updateSLAAction(slaScore.value.toString()));
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
    polkaBtcLoaded,
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
      title: t('vault.fees_earned_dot'),
      value: feesEarnedDOT.toHuman(),
      color: 'text-interlayDenim-800'
    },
    {
      title: t('sla_score'),
      value: safeRoundTwoDecimals(sla),
      color: 'text-interlayDenim-800'
    }, {
      title: t('vault.locked_dot'),
      value: safeRoundFiveDecimals(collateral),
      color: 'text-interlayDenim-800'
    },
    {
      title: t('locked_btc'),
      value: displayMonetaryAmount(BTCAmount.from.BTC(lockedBTC)),
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
    <MainContainer className='vault-dashboard-page'>
      <div className='space-y-20'>
        <div className='space-y-10'>
          <div>
            <PageTitle
              mainTitle={t('vault.vault_dashboard')}
              subTitle={<TimerIncrement />} />
            <BoldParagraph className='text-center'>{address}</BoldParagraph>
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
          </div>
          <div
            className={clsx(
              'max-w-xl',
              'mx-auto',
              'grid',
              'grid-cols-3',
              'gap-10'
            )}>
            <InterlayDenimContainedButton
              type='submit'
              style={{ display: 'flex' }}
              className='mx-auto'
              // TODO: should not use inlined functions
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
              {t('vault.deposit_collateral')}
            </InterlayDenimContainedButton>
            <InterlayDefaultContainedButton
              type='submit'
              style={{ display: 'flex' }}
              className='mx-auto'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
              {t('vault.withdraw_collateral')}
            </InterlayDefaultContainedButton>
            {new Big(lockedBTC).gt(new Big(0)) ? (
              <InterlayCaliforniaContainedButton
                type='submit'
                style={{ display: 'flex' }}
                className='mx-auto'
                onClick={() => setShowRequestReplacementModal(true)}>
                {t('vault.replace_vault')}
              </InterlayCaliforniaContainedButton>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className='text-center'>
          <VaultIssueRequestsTable
            totalIssueRequests={totalIssueRequests}
            vaultAddress={address} />
          <VaultRedeemRequestsTable
            totalRedeemRequests={totalRedeemRequests}
            vaultAddress={address} />
          <ReplaceTable />
          <UpdateCollateralModal
            onClose={closeUpdateCollateralModal}
            status={updateCollateralModalStatus} />
          <RequestReplacementModal
            onClose={closeRequestReplacementModal}
            show={showRequestReplacementModal} />
        </div>
      </div>
    </MainContainer>
  );
}

export default VaultDashboard;
