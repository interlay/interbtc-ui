
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import VaultScoresTable from 'containers/VaultScoresTable';
import StakedRelayerScoresTable from 'containers/StakedRelayerScoresTable';
import CardList, {
  CardListItem,
  CardListItemHeader,
  CardListItemContent
} from 'components/CardList';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayTabs, { InterlayTab } from 'components/UI/InterlayTabs';
import InterlayToggleButtonGroup, {
  InterlayToggleButton,
  InterlayToggleButtonGroupProps
} from 'components/UI/InterlayToggleButtonGroup';
import {
  POLKA_BTC_DOC_START_TREASURE_HUNT,
  POLKA_BTC_DOC_START_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_START_TREASURE_HUNT_STAKED_RELAYER,
  POLKA_BTC_DOC_KING_OF_THE_HILL,
  POLKA_BTC_DOC_LOTTERY
} from 'config/links';
// import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';
import { CHALLENGE_CUT_OFFS } from 'config/challenges';

const challengeCutOffs = Object.values(CHALLENGE_CUT_OFFS);

function ChallengeSelector(props: InterlayToggleButtonGroupProps) {
  const { t } = useTranslation();

  const nowTimestamp = Date.now();

  const validChallengeCutOffs = challengeCutOffs.filter(item => nowTimestamp > item.time);

  if (validChallengeCutOffs.length <= 0) {
    return null;
  }

  return (
    <InterlayToggleButtonGroup
      type='radio'
      {...props}>
      {validChallengeCutOffs.map(challengeCutOff => (
        <InterlayToggleButton
          // TODO: should use tailwindcss
          variant='outline-polkadot'
          // className={clsx(
          //   'border-interlayScarlet-400',
          //   'bg-interlayScarlet-400'
          // )}
          key={challengeCutOff.id}
          value={challengeCutOff.id}>
          {t(`leaderboard.challenge_buttons.${challengeCutOff.id}`)}
        </InterlayToggleButton>
      ))}
    </InterlayToggleButtonGroup>
  );
}

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

const tabStyles = {
  className: clsx(
    'py-2'
  ),
  // TODO: hack for now
  tabClassName: clsx(
    'no-underline',
    'text-black'
  )
};

const TAB_KEYS = Object.freeze({
  VAULTS: 'vaults',
  STAKED_RELAYER: 'staked-relayer'
});

function Challenges(): JSX.Element {
  // TODO: should be persisted using query parameters
  const [challengeId, setChallengeId] = useState(challengeCutOffs[0].id ?? null);
  // TODO: should be persisted using query parameters
  const [tabKey, setTabKey] = useState<string | null>('vaults');
  const { t } = useTranslation();

  const handleChallengeIdChange = (newChallengeId: number) => {
    setChallengeId(newChallengeId);
  };

  const handleTabSelect = (newTabKey: string | null) => {
    setTabKey(newTabKey);
  };

  const challengeTime = challengeCutOffs.find(item => item.id === challengeId)?.time;
  if (challengeTime === undefined) {
    // TODO: should translate
    throw new Error('Something went wrong!');
  }

  return (
    <MainContainer
      className={clsx(
        'px-14', // TODO: should set it within `MainContainer`
        'fade-in-animation',
        'space-y-20',
        'max-w-screen-2xl',
        'm-auto'
      )}>
      <div>
        <PageTitle mainTitle={t('leaderboard.challenges_title')} />
        <CardList
          className= {clsx(
            'max-w-max',
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
                      'text-interlayDodgerBlue'
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
            name='challenge'
            value={challengeId}
            onChange={handleChallengeIdChange} />
        </div>
        <InterlayTabs onSelect={handleTabSelect}>
          <InterlayTab
            {...tabStyles}
            eventKey={TAB_KEYS.VAULTS}
            title={t('leaderboard.vault_scores')}>
            {tabKey === TAB_KEYS.VAULTS && <VaultScoresTable challengeTime={challengeTime} />}
          </InterlayTab>
          <InterlayTab
            {...tabStyles}
            eventKey={TAB_KEYS.STAKED_RELAYER}
            title={t('leaderboard.relayer_scores')}>
            {tabKey === TAB_KEYS.STAKED_RELAYER && <StakedRelayerScoresTable challengeTime={challengeTime} />}
          </InterlayTab>
        </InterlayTabs>
      </div>
    </MainContainer>
  );
}

export default Challenges;
