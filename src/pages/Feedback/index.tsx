
import {
  FaExternalLinkAlt,
  FaGithub,
  FaDiscord
} from 'react-icons/fa';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import CardList, { Card } from 'components/CardList';
import InterlayLink from 'components/UI/InterlayLink';
import {
  USER_FEEDBACK_FORM,
  VAULT_FEEDBACK_FORM,
  RELAYER_FEEDBACK_FORM,
  POLKA_BTC_UI_GITHUB_ISSUES,
  INTERLAY_DISCORD
} from 'config/links';

const FEEDBACK_ITEMS = [
  {
    title: 'User Feedback Form',
    link: USER_FEEDBACK_FORM,
    icon: <FaExternalLinkAlt />
  },
  {
    title: 'Vault Feedback Form',
    link: VAULT_FEEDBACK_FORM,
    icon: <FaExternalLinkAlt />
  },
  {
    title: 'Relayer Feedback Form',
    link: RELAYER_FEEDBACK_FORM,
    icon: <FaExternalLinkAlt />
  },
  {
    title: 'Open an Issue on Github',
    link: POLKA_BTC_UI_GITHUB_ISSUES,
    icon: <FaGithub />
  },
  {
    title: 'Discuss on Discord',
    link: INTERLAY_DISCORD,
    icon: <FaDiscord />
  }
];

const Feedback = () => (
  <>
    {/* TODO: should use footer layout pattern */}
    <MainContainer>
      <PageTitle mainTitle='Feedback' />
      <CardList>
        {FEEDBACK_ITEMS.map(feedbackType => (
          <Card key={feedbackType.title}>
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
          </Card>
        ))}
      </CardList>
    </MainContainer>
  </>
);

export default Feedback;
