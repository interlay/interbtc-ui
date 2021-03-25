
import {
  useState,
  useEffect,
  ReactElement,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import {
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap';
import {
  useTranslation,
  TFunction
} from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { RelayerData } from '@interlay/polkabtc-stats';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import InterlayLink from 'components/InterlayLink';
import InterlayTabs, { InterlayTab } from 'components/InterlayTabs';
import CardList, {
  Card,
  CardHeader,
  CardContent
} from 'components/CardList';
import VaultScoresTable from 'components/VaultScoresTable';
import {
  POLKA_BTC_DOC_TREASURE_HUNT,
  POLKA_BTC_DOC_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_TREASURE_HUNT_RELAYER
} from 'config/links';
import DashboardTable from 'common/components/dashboard-table/dashboard-table';
import TimerIncrement from 'common/components/timer-increment';
import {
  CHALLENGES_2_AND_3_START,
  CHALLENGE_4_START
} from '../../constants';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';
import 'pages/dashboard/dashboard-subpage.scss';
import './challenges.scss';

const CHALLENGE_CUTOFFS = [
  CHALLENGES_2_AND_3_START,
  CHALLENGE_4_START,
  0 // all time
];

type ChallengeSelectorProps = {
  challengeIdx: number;
  setChallengeIdx: (idx: number) => void;
  t: TFunction;
}

function ChallengeSelector({ challengeIdx, setChallengeIdx, t }: ChallengeSelectorProps): ReactElement {
  const timestamp = Date.now();

  return (
    <div className='text-right'>
      <ToggleButtonGroup
        className='mt-4 mx-3'
        type='radio'
        value={challengeIdx}
        name='challenge'
        onChange={(val: any) => setChallengeIdx(val)}>
        {timestamp > CHALLENGE_CUTOFFS[0] && ( // only show buttons at all if at least the first is active
          CHALLENGE_CUTOFFS.map((displayFrom, idx) =>
            timestamp > displayFrom &&
            <ToggleButton
              variant='outline-polkadot'
              className='font-weight-bold'
              value={idx}>
              {t(`leaderboard.challenge_buttons.${idx}`)}
            </ToggleButton>
          )
        )}
      </ToggleButtonGroup>
    </div>
  );
}

const CHALLENGE_ITEMS = [
  {
    title: 'leaderboard.challenges.treasure_hunt',
    content: 'leaderboard.challenges.treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_TREASURE_HUNT
  },
  {
    title: 'leaderboard.challenges.vault_treasure_hunt',
    titleIcon: (
      <NewMarkIcon
        width={20}
        height={20} />
    ),
    content: 'leaderboard.challenges.vault_treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_TREASURE_HUNT_VAULT
  },
  {
    title: 'leaderboard.challenges.relayer_treasure_hunt',
    titleIcon: (
      <NewMarkIcon
        width={20}
        height={20} />
    ),
    content: 'leaderboard.challenges.relayer_treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_TREASURE_HUNT_RELAYER
  },
  {
    title: 'leaderboard.challenges.vaults_relayers',
    content: 'leaderboard.challenges.vaults_relayers_desc'
  },
  {
    title: 'leaderboard.challenges.lottery',
    content: 'leaderboard.challenges.lottery_desc'
  }
];

function Challenges(): ReactElement {
  // ray test touch <
  // eslint-disable-next-line no-array-constructor
  const [relayerRows, setRelayerRows] = useState(new Array<RelayerData>());
  const [challengeIdx, setChallengeIdx] = useState(0); // all time
  // ray test touch >

  const statsApi = usePolkabtcStats();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  // ray test touch <
  const relayerTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.stake')}</h1>,
    <h1>{t('leaderboard.block_count')}</h1>,
    <h1>{t('leaderboard.lifetime_sla')}</h1>
  ];
  // ray test touch >

  // ray test touch <
  // TODO:
  // - exclude Interlay owned relayers
  // - sort relayers with highest lifetime sla
  const tableRelayerRow = useMemo(
    () => (row: RelayerData): ReactElement[] => [
      <p>{row.id}</p>,
      <p>{row.stake} DOT</p>,
      <p>{row.block_count}</p>,
      <p>{Number(row.lifetime_sla).toFixed(2)}</p>
    ],
    []
  );
  // ray test touch >

  // ray test touch <
  useEffect(() => {
    const fetchRelayerData = async () => {
      if (!polkaBtcLoaded) return;
      const relayers = (await statsApi.getRelayers(CHALLENGE_CUTOFFS[challengeIdx])).data;
      setRelayerRows(relayers.sort((a, b) => b.lifetime_sla - a.lifetime_sla));
    };

    fetchRelayerData();
  }, [
    polkaBtcLoaded,
    statsApi,
    challengeIdx,
    t
  ]);
  // ray test touch >

  return (
    <MainContainer>
      <div className='dashboard-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='dashboard-wrapper'>
          <PageTitle mainTitle={t('leaderboard.challenges_title')} />
          <CardList>
            {CHALLENGE_ITEMS.map(cardItem => (
              <Card key={cardItem.title}>
                <CardHeader>
                  {t(cardItem.title)}
                  {cardItem.titleIcon}
                </CardHeader>
                <CardContent>
                  {t(cardItem.content)}
                  {cardItem.contentLink && (
                    <InterlayLink
                      href={cardItem.contentLink}
                      target='_blank'
                      rel='noopener noreferrer'>
                      &nbsp;
                      {t('leaderboard.more_info')}
                      &nbsp;
                      <FaExternalLinkAlt />
                    </InterlayLink>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardList>
          <PageTitle
            mainTitle={t('leaderboard.title')}
            subTitle={<TimerIncrement />} />
          <InterlayTabs>
            <InterlayTab
              className='space-y-10'
              tabClassName={clsx(
                'no-underline',
                'text-black'
              )}
              eventKey='vaults'
              title={t('leaderboard.vault_scores')}>
              <ChallengeSelector {...{ challengeIdx, setChallengeIdx, t }} />
              <VaultScoresTable challengeCutOff={CHALLENGE_CUTOFFS[challengeIdx]} />
            </InterlayTab>
            <InterlayTab
              tabClassName={clsx(
                'no-underline',
                'text-black'
              )}
              eventKey='relayers'
              title={t('leaderboard.relayer_scores')}>
              <ChallengeSelector {...{ challengeIdx, setChallengeIdx, t }} />
              {/* ray test touch < */}
              <div style={{ margin: '40px 0px' }}>
                <DashboardTable
                  pageData={relayerRows}
                  headings={relayerTableHeadings}
                  dataPointDisplayer={tableRelayerRow}
                  noDataEl={<td colSpan={6}>{t('loading_ellipsis')}</td>} />
              </div>
              {/* ray test touch > */}
            </InterlayTab>
          </InterlayTabs>
        </div>
      </div>
    </MainContainer>
  );
}

export default Challenges;
