
import {
  FaTwitter,
  FaGithub,
  FaMailBulk,
  FaDiscord
} from 'react-icons/fa';
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';
import {
  INTERLAY_TWITTER_LINK,
  INTERLAY_DISCORD_LINK,
  INTERLAY_GITHUB_LINK,
  INTERLAY_EMAIL_LINK
} from 'config/links';

const SOCIAL_MEDIA_ITEMS = [
  {
    link: INTERLAY_TWITTER_LINK,
    icon: (
      <FaTwitter
        className={clsx(
          'w-3',
          'h-3'
        )} />
    )
  },
  {
    link: INTERLAY_DISCORD_LINK,
    icon: (
      <FaDiscord
        className={clsx(
          'w-3',
          'h-3'
        )} />
    )
  },
  {
    link: INTERLAY_GITHUB_LINK,
    icon: (
      <FaGithub
        className={clsx(
          'w-3',
          'h-3'
        )} />
    )
  },
  {
    link: INTERLAY_EMAIL_LINK,
    icon: (
      <FaMailBulk
        className={clsx(
          'w-3',
          'h-3'
        )} />
    )
  }
];

const SocialMediaContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'items-center',
      'justify-center',
      'space-x-4',
      className
    )}
    {...rest}>
    {SOCIAL_MEDIA_ITEMS.map(socialMediaItem => (
      <InterlayLink
        key={socialMediaItem.link}
        className={clsx(
          'w-6',
          'h-6',
          'ring-1',
          'ring-interlayHaiti',
          'rounded-full',
          'm-1',
          'grid',
          'place-items-center',
          'text-interlayHaiti'
        )}
        href={socialMediaItem.link}
        target='_blank'
        rel='noopener noreferrer'>
        {socialMediaItem.icon}
      </InterlayLink>
    ))}
  </div>
);

export default SocialMediaContainer;
