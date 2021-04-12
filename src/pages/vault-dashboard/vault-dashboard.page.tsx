
import React, {
  useState,
  useEffect
} from 'react';
import { Button } from 'react-bootstrap';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  satToBTC,
  planckToDOT
} from '@interlay/polkabtc';
import { useTranslation } from 'react-i18next';
import tw from 'twin.macro';

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
import IssueTable from './issue-table/issue-table';
import RedeemTable from './redeem-table/redeem-table';
import ReplaceTable from './replace-table/replace-table';
import { StoreType } from 'common/types/util.types';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import {
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateSLAAction,
  updateAPYAction
} from 'common/actions/vault.actions';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';
import './vault-dashboard.page.scss';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard/dashboard-subpage.scss';

function VaultDashboard() {
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

  const dispatch = useDispatch();
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
          totalPolkaSAT,
          collateralization,
          slaScore,
          apyScore,
          issuablePolkaBTC
        ] = await Promise.allSettled([
          window.polkaBTC.vaults.get(vaultId),
          window.polkaBTC.vaults.getFeesPolkaBTC(vaultId),
          window.polkaBTC.vaults.getFeesDOT(vaultId),
          window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId),
          window.polkaBTC.vaults.getVaultCollateralization(vaultId),
          window.polkaBTC.vaults.getSLA(vaultId),
          window.polkaBTC.vaults.getAPY(vaultId),
          window.polkaBTC.vaults.getIssuablePolkaBTC()
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

        const lockedAmountBTC = satToBTC(totalPolkaSAT.toString());
        dispatch(updateLockedBTCAction(lockedAmountBTC));

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
          setCapacity(issuablePolkaBTC.value);
        }
      } catch (error) {
        console.log('[VaultDashboard useEffect] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    vaultClientLoaded,
    dispatch,
    address
  ]);

  const VAULT_ITEMS = [
    {
      title: t('vault.locked_collateral'),
      value: collateral,
      unit: 'DOT'
    },
    {
      title: t('locked_btc'),
      value: lockedBTC,
      unit: 'BTC'
    },
    {
      title: t('collateralization'),
      value: `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`
    },
    {
      title: t('vault.capacity'),
      value: `~${safeRoundTwoDecimals(capacity)}`,
      unit: 'PolkaBTC'
    },
    {
      title: t('fees_earned'),
      value: feesEarnedPolkaBTC.toString(),
      unit: 'PolkaBTC'
    },
    {
      title: t('fees_earned'),
      value: feesEarnedDOT.toString(),
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
      <div className='vault-container dashboard-fade-in-animation'>
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
          <div className='flex justify-center space-x-4 mt-3'>
            <Button
              variant='outline-success'
              // TODO: should not use inlined functions
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
              {t('vault.increase_collateral')}
            </Button>
            <Button
              variant='outline-danger'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
              {t('vault.withdraw_collateral')}
            </Button>
          </div>
        </>
        <IssueTable />
        <RedeemTable />
        <ReplaceTable openModal={setShowRequestReplacementModal} />
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
