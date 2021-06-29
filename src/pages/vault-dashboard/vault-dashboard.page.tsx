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
import { planckToDOT } from '@interlay/polkabtc';
import {
  IssueColumns,
  RedeemColumns
} from '@interlay/interbtc-stats-client';

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
import InterlayRoseContainedButton from 'components/buttons/InterlayRoseContainedButton';
import InterlayOrangePeelContainedButton from 'components/buttons/InterlayOrangePeelContainedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import UpdateCollateralModal, { CollateralUpdateStatus } from './update-collateral/update-collateral';
import RequestReplacementModal from './request-replacement/request-replacement';
import ReplaceTable from './replace-table/replace-table';
import { StoreType } from 'common/types/util.types';
import {
  safeRoundTwoDecimals,
  displayBtcAmount,
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
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';

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
  const [capacity, setCapacity] = useState(new Big(0));
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');
  const [totalIssueRequests, setTotalIssueRequests] = useState(0);
  const [totalRedeemRequests, setTotalRedeemRequests] = useState(0);

  const dispatch = useDispatch();
  const stats = usePolkabtcStats();
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
          window.polkaBTC.vaults.getFeesWrapped(vaultId),
          window.polkaBTC.vaults.getFeesCollateral(vaultId),
          window.polkaBTC.vaults.getIssuedAmount(vaultId),
          window.polkaBTC.vaults.getVaultCollateralization(vaultId),
          window.polkaBTC.vaults.getSLA(vaultId),
          window.polkaBTC.vaults.getAPY(vaultId),
          window.polkaBTC.vaults.getIssuableAmount(vaultId),
          stats.getFilteredTotalIssues({ filterIssueColumns: [{ column: IssueColumns.VaultId, value: address }] }),
          stats.getFilteredTotalRedeems({ filterRedeemColumns: [{ column: RedeemColumns.VaultId, value: address }] })
        ]);

        if (vault.status === 'fulfilled') {
          const collateralDot = planckToDOT(vault.value.backing_collateral.toString());
          dispatch(updateCollateralAction(collateralDot));
        }

        if (feesPolkaBTC.status === 'fulfilled') {
          setFeesEarnedPolkaBTC(feesPolkaBTC.value.toString());
        }

        if (feesDOT.status === 'fulfilled') {
          setFeesEarnedDOT(feesDOT.value.toString());
        }

        if (totalIssueRequests.status === 'fulfilled') {
          setTotalIssueRequests(totalIssueRequests.value);
        }

        if (totalRedeemRequests.status === 'fulfilled') {
          setTotalRedeemRequests(totalRedeemRequests.value);
        }

        if (lockedAmountBTC.status === 'fulfilled') {
          dispatch(updateLockedBTCAction(lockedAmountBTC.value.toString()));
        }

        if (collateralization.status === 'fulfilled') {
          dispatch(updateCollateralizationAction(collateralization.value?.mul(100).toString()));
        }

        if (slaScore.status === 'fulfilled') {
          dispatch(updateSLAAction(slaScore.value));
        }

        if (apyScore.status === 'fulfilled') {
          dispatch(updateAPYAction(apyScore.value));
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
      color: 'text-interlayDodgerBlue-800'
    },
    {
      title: t('vault.fees_earned_interbtc'),
      value: displayBtcAmount(feesEarnedPolkaBTC),
      color: 'text-interlayRose-800'
    },
    {
      title: t('vault.fees_earned_dot'),
      value: safeRoundFiveDecimals(feesEarnedDOT),
      color: 'text-interlayRose-800'
    },
    {
      title: t('sla_score'),
      value: safeRoundTwoDecimals(sla),
      color: 'text-interlayDodgerBlue-800'
    }, {
      title: t('vault.locked_dot'),
      value: safeRoundFiveDecimals(collateral),
      color: 'text-interlayRose-800'
    },
    {
      title: t('locked_btc'),
      value: displayBtcAmount(lockedBTC),
      color: 'text-interlayOrangePeel-700'
    }, {
      title: t('vault.remaining_capacity'),
      value: displayBtcAmount(capacity),
      color: 'text-interlayRose-800'
    },
    {
      title: t('apy'),
      value: `~${safeRoundTwoDecimals(apy)}%`,
      color: 'text-interlayDodgerBlue-800'
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
            <InterlayRoseContainedButton
              type='submit'
              style={{ display: 'flex' }}
              className='mx-auto'
              // TODO: should not use inlined functions
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
              {t('vault.deposit_collateral')}
            </InterlayRoseContainedButton>
            <InterlayDefaultContainedButton
              type='submit'
              style={{ display: 'flex' }}
              className='mx-auto'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
              {t('vault.withdraw_collateral')}
            </InterlayDefaultContainedButton>
            {new Big(lockedBTC).gt(new Big(0)) ? (
              <InterlayOrangePeelContainedButton
                type='submit'
                style={{ display: 'flex' }}
                className='mx-auto'
                onClick={() => setShowRequestReplacementModal(true)}>
                {t('vault.replace_vault')}
              </InterlayOrangePeelContainedButton>
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
