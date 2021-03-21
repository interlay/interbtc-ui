
import React, {
  useState,
  useEffect
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  satToBTC,
  planckToDOT
} from '@interlay/polkabtc';
import { useTranslation } from 'react-i18next';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import CardList, {
  Card,
  CardHeader,
  CardContent
} from 'components/CardList';
import BoldParagraph from 'components/BoldParagraph';
import BitcoinTable from 'common/components/bitcoin-table/bitcoin-table';
import StatusUpdateTable from 'common/components/status-update-table/status-update-table';
import VaultTable from 'common/components/vault-table/vault-table';
import OracleTable from 'common/components/oracle-table/oracle-table';
import ButtonMaybePending from 'common/components/pending-button';
import TimerIncrement from 'common/components/timer-increment';
import { StoreType } from 'common/types/util.types';
import { safeRoundTwoDecimals } from 'common/utils/utils';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';
import './staked-relayer.page.scss';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard/dashboard-subpage.scss';

function StakedRelayer() {
  const [isDeregisterPending, setDeregisterPending] = useState(false);
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');
  const [dotLocked, setDotLocked] = useState('0');
  const [planckLocked, setPlanckLocked] = useState('0');
  const [stakedRelayerAddress, setStakedRelayerAddress] = useState('');
  const [relayerInactive, setRelayerInactive] = useState(false);
  const [sla, setSLA] = useState(0);
  const [apy, setAPY] = useState('0');
  const {
    polkaBtcLoaded,
    relayerLoaded,
    address
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  // TODO: should double-check (e.g. `unregisterStakedRelayer`)
  const deregisterStakedRelayer = async () => {
    if (!relayerLoaded) return;

    setDeregisterPending(true);
    try {
      await window.polkaBTC.stakedRelayer.deregister();
      toast.success('Successfully Deregistered');
    } catch (error) {
      toast.error(error.message);
    }
    setRelayerInactive(false);
    setDeregisterPending(false);
  };

  useEffect(() => {
    (async () => {
      if (!polkaBtcLoaded) return;
      if (!relayerLoaded) return;
      if (!address) return;

      try {
        const stakedRelayerId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);

        const isInactive = await window.polkaBTC.stakedRelayer.isStakedRelayerInactive(stakedRelayerId);
        setRelayerInactive(isInactive);
        setStakedRelayerAddress(address);

        const lockedPlanck = (
          await window.polkaBTC.stakedRelayer.getStakedDOTAmount(stakedRelayerId)
        ).toString();
        const lockedDOT = planckToDOT(lockedPlanck);

        const slaScore = await window.polkaBTC.stakedRelayer.getSLA(stakedRelayerId);
        setSLA(slaScore);

        const apyScore = await window.polkaBTC.stakedRelayer.getAPY(stakedRelayerId);
        setAPY(apyScore);

        const feesPolkaSAT = await window.polkaBTC.stakedRelayer.getFeesPolkaBTC(
          stakedRelayerId
        );
        setFeesEarnedPolkaBTC(satToBTC(feesPolkaSAT));

        const feesPlanck = await window.polkaBTC.stakedRelayer.getFeesDOT(stakedRelayerId);
        setFeesEarnedDOT(planckToDOT(feesPlanck));

        setDotLocked(lockedDOT);
        setPlanckLocked(lockedPlanck);
      } catch (error) {
        console.log('[StakedRelayerPage useEffect] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    relayerLoaded,
    address,
    t // TODO: should double-check
  ]);

  const STAKED_RELAYER_ITEMS = [
    {
      title: t('relayer.stake_locked'),
      value: dotLocked.toString(),
      unit: 'DOT'
    },
    {
      title: t('fees_earned'),
      value: feesEarnedPolkaBTC,
      unit: 'PolkaBTC'
    },
    {
      title: t('fees_earned'),
      value: feesEarnedDOT,
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
    <MainContainer className='staked-relayer-page'>
      <div className='staked-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('relayer.staked_relayer_dashboard')}
            subTitle={<TimerIncrement />} />
          <BoldParagraph>{address}</BoldParagraph>
          {relayerLoaded && polkaBtcLoaded && (
            <CardList>
              {STAKED_RELAYER_ITEMS.map(stakedRelayerItem => (
                <Card
                  key={stakedRelayerItem.title}
                  // ray test touch <
                  className='lg:w-56'>
                  {/* ray test touch > */}
                  <CardHeader>
                    {stakedRelayerItem.title}
                  </CardHeader>
                  <CardContent>
                    <div className='text-4xl'>
                      {stakedRelayerItem.value}
                    </div>
                    <div>
                      {stakedRelayerItem.unit}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardList>
          )}
          <BitcoinTable />
          <StatusUpdateTable
            dotLocked={dotLocked}
            planckLocked={planckLocked}
            stakedRelayerAddress={stakedRelayerAddress} />
          <VaultTable />
          <OracleTable planckLocked={planckLocked} />
          {relayerLoaded && (
            <>
              <ButtonMaybePending
                className='staked-button'
                variant='outline-danger'
                isPending={isDeregisterPending}
                disabled={relayerInactive || isDeregisterPending}
                onClick={deregisterStakedRelayer}>
                {t('relayer.deregister')}
              </ButtonMaybePending>
              <div className='row'>
                <div className='col-12 de-note'>
                  {t('relayer.note_you_can_deregister')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainContainer>
  );
}

export default StakedRelayer;
