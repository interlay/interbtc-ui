
import React, {
  useState,
  useEffect
} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  planckToDOT
} from '@interlay/polkabtc';
import { useTranslation } from 'react-i18next';
import tw from 'twin.macro';
import { IssueColumns, RedeemColumns } from '@interlay/polkabtc-stats';
import Big from 'big.js';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import CardList, {
  Card,
  CardHeader,
  CardContent
} from 'components/CardList';
import BoldParagraph from 'components/BoldParagraph';
import UpdateCollateralModal, { CollateralUpdateStatus } from './update-collateral/update-collateral';
import RequestReplacementModal from './request-replacement/request-replacement';
import ReplaceTable from './replace-table/replace-table';
import { StoreType } from 'common/types/util.types';
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
import { displayBtcAmount, displayDotAmount, safeRoundTwoDecimals } from 'common/utils/utils';
import InterlayButton from 'components/UI/InterlayButton';
import clsx from 'clsx';

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
  const [capacity, setCapacity] = useState('0');
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
          issuablePolkaBTC,
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
          stats.getFilteredTotalIssues([{ column: IssueColumns.VaultId, value: address }]),
          stats.getFilteredTotalRedeems([{ column: RedeemColumns.VaultId, value: address }])
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
          setTotalIssueRequests(totalIssueRequests.value.data);
        }

        if (totalRedeemRequests.status === 'fulfilled') {
          setTotalRedeemRequests(totalRedeemRequests.value.data);
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

        if (issuablePolkaBTC.status === 'fulfilled') {
          setCapacity(issuablePolkaBTC.value.toString());
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
      title: t('vault.locked_collateral'),
      value: displayDotAmount(collateral),
      unit: 'DOT'
    },
    {
      title: t('locked_btc'),
      value: displayBtcAmount(lockedBTC),
      unit: 'BTC'
    },
    {
      title: t('collateralization'),
      value: `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`
    },
    {
      title: t('vault.capacity'),
      value: `~${displayDotAmount(capacity)}`,
      unit: 'PolkaBTC'
    },
    {
      title: t('fees_earned'),
      value: displayBtcAmount(feesEarnedPolkaBTC.toString()),
      unit: 'PolkaBTC'
    },
    {
      title: t('fees_earned'),
      value: displayDotAmount(feesEarnedDOT.toString()),
      unit: 'DOT'
    },
    {
      title: t('sla_score'),
      value: safeRoundTwoDecimals(sla)
    },
    {
      title: t('apy'),
      value: `~${safeRoundTwoDecimals(apy)}`,
      unit: '%'
    }
  ];

  return (
    <MainContainer className='vault-dashboard-page'>
      <div className='vault-container fade-in-animation'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('vault.vault_dashboard')}
            subTitle={<TimerIncrement />} />
          <BoldParagraph>{address}</BoldParagraph>
        </div>
        <>
          <CardList>
            {VAULT_ITEMS.map(vaultItem => (
              <Card
                key={`${vaultItem.title}-${vaultItem?.unit}`}
                twStyle={tw`lg:w-56`}>
                <CardHeader>
                  {vaultItem.title}
                </CardHeader>
                <CardContent>
                  <div className='text-4xl'>
                    {vaultItem.value}
                  </div>
                  <div>
                    {vaultItem.unit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardList>
          <div
            className={clsx(
              'md:max-w-xl',
              'mx-auto',
              'grid',
              'grid-cols-3',
              'mt-3',
              'mb-3'
            )}>
            <InterlayButton
              type='submit'
              style={{ display: 'flex' }}
              className='mx-auto'
              variant='contained'
              color='primary'
              // TODO: should not use inlined functions
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
              {t('vault.deposit_collateral')}
            </InterlayButton>
            <InterlayButton
              type='submit'
              style={{ display: 'flex' }}
              className='mx-auto'
              variant='contained'
              color='default'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
              {t('vault.withdraw_collateral')}
            </InterlayButton>
            {new Big(lockedBTC).gt(new Big(0)) ? (
              <InterlayButton
                type='submit'
                style={{ display: 'flex' }}
                className='mx-auto'
                variant='contained'
                color='secondary'
                onClick={() => setShowRequestReplacementModal(true)}>
                {t('vault.replace_vault')}
              </InterlayButton>
            ) : (
              ''
            )}
          </div>
        </>
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
    </MainContainer>
  );
}

export default VaultDashboard;
