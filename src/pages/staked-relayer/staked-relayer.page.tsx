import {
  useState,
  useEffect
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

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
import NetworkActivity from 'common/components/network-activity/network-activity';
import ButtonMaybePending from 'common/components/pending-button';
import { StoreType } from 'common/types/util.types';
import {
  displayBtcAmount,
  safeRoundFiveDecimals,
  safeRoundTwoDecimals
} from 'common/utils/utils';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import './staked-relayer.page.scss';

function StakedRelayer(): JSX.Element {
  const [isDeregisterPending, setDeregisterPending] = useState(false);
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');
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

        const slaScore = await window.polkaBTC.stakedRelayer.getSLA(stakedRelayerId);
        setSLA(slaScore);

        const apyScore = await window.polkaBTC.stakedRelayer.getAPY(stakedRelayerId);
        setAPY(apyScore);

        const feesPolkaBTC = await window.polkaBTC.stakedRelayer.getWrappingFees(
          stakedRelayerId
        );
        setFeesEarnedPolkaBTC(feesPolkaBTC.toString());

        const feesDOT = await window.polkaBTC.stakedRelayer.getCollateralFees(stakedRelayerId);
        setFeesEarnedDOT(feesDOT.toString());
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
      title: t('sla_score'),
      value: safeRoundTwoDecimals(sla),
      color: 'text-interlayDenim-800'
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
      title: t('apy'),
      value: `~${safeRoundTwoDecimals(apy)}`,
      color: 'text-interlayDenim-800'
    }
  ];

  return (
    <MainContainer className='staked-relayer-page'>
      <div className='staked-container'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('relayer.staked_relayer_dashboard')}
            subTitle={<TimerIncrement />} />
          <BoldParagraph className='text-center'>
            {address}
          </BoldParagraph>
          <CardListContainer>
            <CardListHeader>Relayer Stats</CardListHeader>
            <CardList
              className={clsx(
                'md:grid-cols-2',
                'xl:grid-cols-4',
                'gap-5'
              )}>
              {STAKED_RELAYER_ITEMS.map(stakedRelayerItem => (
                <CardListItem
                  key={stakedRelayerItem.title}>
                  <CardListItemHeader className={stakedRelayerItem.color}>
                    {stakedRelayerItem.title}
                  </CardListItemHeader>
                  <CardListItemContent
                    className={clsx(
                      'text-2xl',
                      'font-medium')}>
                    {stakedRelayerItem.value}
                  </CardListItemContent>
                </CardListItem>
              ))}
            </CardList>
          </CardListContainer>
          <NetworkActivity className='mt-20' />
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
