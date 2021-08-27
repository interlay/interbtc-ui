
import {
  FaExternalLinkAlt,
  FaGithub,
  FaDiscord
} from 'react-icons/fa';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import CardList, { CardListItem } from 'components/CardList';
import InterlayLink from 'components/UI/InterlayLink';
import {
  USER_FEEDBACK_FORM_LINK,
  VAULT_FEEDBACK_FORM_LINK,
  RELAYER_FEEDBACK_FORM_LINK,
  INTER_BTC_UI_GITHUB_ISSUES_LINK,
  INTERLAY_DISCORD_LINK
} from 'config/links';

const FEEDBACK_ITEMS = [
  {
    title: 'User Feedback Form',
    link: USER_FEEDBACK_FORM_LINK,
    icon: <FaExternalLinkAlt />
  },
  {
    title: 'Vault Feedback Form',
    link: VAULT_FEEDBACK_FORM_LINK,
    icon: <FaExternalLinkAlt />
  },
  {
    title: 'Relayer Feedback Form',
    link: RELAYER_FEEDBACK_FORM_LINK,
    icon: <FaExternalLinkAlt />
  },
  {
    title: 'Open an Issue on Github',
    link: INTER_BTC_UI_GITHUB_ISSUES_LINK,
    icon: <FaGithub />
  },
  {
    title: 'Discuss on Discord',
    link: INTERLAY_DISCORD_LINK,
    icon: <FaDiscord />
  }
];

const Feedback = (): JSX.Element => (
  <MainContainer>
    <PageTitle mainTitle='Feedback' />
    <CardList
      className={clsx(
        'md:grid-cols-3',
        '2xl:grid-cols-5',
        'gap-5'
      )}>
      {FEEDBACK_ITEMS.map(feedbackType => (
        <CardListItem
          key={feedbackType.title}
          className={clsx(
            'justify-center',
            'items-center'
          )}>
          <InterlayLink
            href={feedbackType.link}
            target='_blank'
            rel='noopener noreferrer'
            className={clsx(
              'font-bold',
              'flex',
              'items-center',
              'space-x-1'
            )}>
            <span>{feedbackType.title}</span>
            {feedbackType.icon}
          </InterlayLink>
        </CardListItem>
      ))}
    </CardList>
  </MainContainer>
);

export default Feedback;
