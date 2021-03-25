
import { useState } from 'react';
import {
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap';
import {
  useTranslation,
  TFunction
} from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
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
import StakedRelayerScoresTable from 'components/StakedRelayerScoresTable';
import {
  POLKA_BTC_DOC_TREASURE_HUNT,
  POLKA_BTC_DOC_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_TREASURE_HUNT_RELAYER
} from 'config/links';
import TimerIncrement from 'common/components/timer-increment';
import {
  CHALLENGES_2_AND_3_START,
  CHALLENGE_4_START
} from '../../constants';
import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';
import 'pages/dashboard/dashboard-subpage.scss';
import './challenges.scss';

// ray test touch <
const CHALLENGE_CUT_OFFS = [
  CHALLENGES_2_AND_3_START,
  CHALLENGE_4_START,
  0 // all time
];
// ray test touch >

type ChallengeSelectorProps = {
  challengeIndex: number;
  setChallengeIndex: (index: number) => void;
  t: TFunction;
}

// ray test touch <
function ChallengeSelector({
  challengeIndex,
  setChallengeIndex,
  t
}: ChallengeSelectorProps) {
  const timestamp = Date.now();

  return (
    <div className='text-right'>
      <ToggleButtonGroup
        className='mt-4 mx-3'
        type='radio'
        value={challengeIndex}
        name='challenge'
        onChange={(val: any) => setChallengeIndex(val)}>
        {timestamp > CHALLENGE_CUT_OFFS[0] && ( // only show buttons at all if at least the first is active
          CHALLENGE_CUT_OFFS.map((displayFrom, idx) =>
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
// ray test touch >

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

function Challenges() {
  // TODO: should be persisted using query parameters
  const [challengeIndex, setChallengeIndex] = useState(0); // all time

  const { t } = useTranslation();

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
              <ChallengeSelector {...{ challengeIndex, setChallengeIndex, t }} />
              <VaultScoresTable challengeCutOff={CHALLENGE_CUT_OFFS[challengeIndex]} />
            </InterlayTab>
            <InterlayTab
              className='space-y-10'
              tabClassName={clsx(
                'no-underline',
                'text-black'
              )}
              eventKey='relayers'
              title={t('leaderboard.relayer_scores')}>
              <ChallengeSelector {...{ challengeIndex, setChallengeIndex, t }} />
              <StakedRelayerScoresTable challengeCutOff={CHALLENGE_CUT_OFFS[challengeIndex]} />
            </InterlayTab>
          </InterlayTabs>
        </div>
      </div>
    </MainContainer>
  );
}

export default Challenges;
