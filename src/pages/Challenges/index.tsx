
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import VaultScoresTable from 'containers/VaultScoresTable';
import CardList, {
  CardListItem,
  CardListItemHeader,
  CardListItemContent
} from 'components/CardList';
import InterlayDenimToggleButtonGroup, {
  InterlayDenimToggleButtonGroupItem,
  InterlayDenimToggleButtonGroupProps
} from 'components/toggle-button-groups/InterlayDenimToggleButtonGroup';
import InterlayLink from 'components/UI/InterlayLink';
import {
  POLKA_BTC_DOC_START_TREASURE_HUNT,
  POLKA_BTC_DOC_START_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_START_TREASURE_HUNT_STAKED_RELAYER,
  POLKA_BTC_DOC_KING_OF_THE_HILL,
  POLKA_BTC_DOC_LOTTERY
} from 'config/links';
import { CHALLENGE_CUT_OFFS } from 'config/challenges';

const challengeCutOffs = Object.values(CHALLENGE_CUT_OFFS);

const ChallengeSelector = (props: InterlayDenimToggleButtonGroupProps) => {
  const { t } = useTranslation();

  const nowTimestamp = Date.now();

  const validChallengeCutOffs = challengeCutOffs.filter(item => nowTimestamp > item.time);

  if (validChallengeCutOffs.length <= 0) {
    return null;
  }

  return (
    <InterlayDenimToggleButtonGroup {...props}>
      {validChallengeCutOffs.map(challengeCutOff => (
        <InterlayDenimToggleButtonGroupItem
          key={challengeCutOff.id}
          value={challengeCutOff.id}>
          {t(`leaderboard.challenge_buttons.${challengeCutOff.id}`)}
        </InterlayDenimToggleButtonGroupItem>
      ))}
    </InterlayDenimToggleButtonGroup>
  );
};

const CHALLENGE_ITEMS = [
  {
    title: 'leaderboard.challenges.treasure_hunt',
    content: 'leaderboard.challenges.treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_START_TREASURE_HUNT
  },
  {
    title: 'leaderboard.challenges.vault_treasure_hunt',
    content: 'leaderboard.challenges.vault_treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_START_TREASURE_HUNT_VAULT
  },
  {
    title: 'leaderboard.challenges.relayer_treasure_hunt',
    content: 'leaderboard.challenges.relayer_treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_START_TREASURE_HUNT_STAKED_RELAYER
  },
  {
    title: 'leaderboard.challenges.vaults_relayers',
    content: 'leaderboard.challenges.vaults_relayers_desc',
    contentLink: POLKA_BTC_DOC_KING_OF_THE_HILL
  },
  {
    title: 'leaderboard.challenges.lottery',
    content: 'leaderboard.challenges.lottery_desc',
    contentLink: POLKA_BTC_DOC_LOTTERY
  }
];

const Challenges = (): JSX.Element => {
  // TODO: should be persisted using query parameters
  const [challengeId, setChallengeId] = useState(challengeCutOffs[0].id ?? null);
  // TODO: should be persisted using query parameters
  const { t } = useTranslation();

  const handleChallengeIdChange = (newChallengeId: number) => {
    setChallengeId(newChallengeId);
  };

  const challengeTime = challengeCutOffs.find(item => item.id === challengeId)?.time;
  if (challengeTime === undefined) {
    // TODO: should translate
    throw new Error('Something went wrong!');
  }

  return (
    <MainContainer
      className={clsx(
        'fade-in-animation',
        'space-y-20',
        // TODO: should set it within `MainContainer`
        'px-6',
        'container',
        'm-auto'
      )}>
      <div>
        <PageTitle mainTitle={t('leaderboard.challenges_title')} />
        <CardList
          className= {clsx(
            'max-w-max',
            'mx-auto',
            'md:grid-cols-3',
            '2xl:grid-cols-5',
            'gap-5'
          )}>
          {CHALLENGE_ITEMS.map(challengeItem => (
            <CardListItem key={challengeItem.title}>
              <CardListItemHeader>
                {t(challengeItem.title)}
                {/* {challengeItem.titleIcon} */}
              </CardListItemHeader>
              <CardListItemContent className='text-gray-500'>
                {t(challengeItem.content)}
                {challengeItem.contentLink && (
                  <InterlayLink
                    className={clsx(
                      'inline-flex',
                      'items-center',
                      'space-x-1',
                      'ml-1',
                      'text-interlayDenim'
                    )}
                    href={challengeItem.contentLink}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <span>{t('leaderboard.more_info')}</span>
                    <FaExternalLinkAlt />
                  </InterlayLink>
                )}
              </CardListItemContent>
            </CardListItem>
          ))}
        </CardList>
      </div>
      <div>
        <PageTitle
          mainTitle={t('leaderboard.title')}
          subTitle={<TimerIncrement />} />
        <div
          className={clsx(
            'text-right',
            'px-4'
          )}>
          <ChallengeSelector
            value={challengeId}
            onChange={handleChallengeIdChange} />
        </div>
        <VaultScoresTable challengeTime={challengeTime} />
      </div>
    </MainContainer>
  );
};

export default Challenges;
