import clsx from 'clsx';
import { FaDiscord, FaGithub, FaMailBulk, FaTwitter } from 'react-icons/fa';

import {
  INTERLAY_DISCORD_LINK,
  INTERLAY_EMAIL_LINK,
  INTERLAY_GITHUB_LINK,
  INTERLAY_TWITTER_LINK
} from '@/config/links';
import InterlayLink from '@/legacy-components/UI/InterlayLink';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const SOCIAL_MEDIA_ITEMS = [
  {
    link: INTERLAY_TWITTER_LINK,
    icon: <FaTwitter color='white' className={clsx('w-3', 'h-3')} />
  },
  {
    link: INTERLAY_DISCORD_LINK,
    icon: <FaDiscord color='white' className={clsx('w-3', 'h-3')} />
  },
  {
    link: INTERLAY_GITHUB_LINK,
    icon: <FaGithub color='white' className={clsx('w-3', 'h-3')} />
  },
  {
    link: INTERLAY_EMAIL_LINK,
    icon: <FaMailBulk color='white' className={clsx('w-3', 'h-3')} />
  }
];

const SocialMediaContainer = ({ className, ...rest }: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div className={clsx('flex', 'items-center', 'justify-center', 'space-x-4', className)} {...rest}>
    {SOCIAL_MEDIA_ITEMS.map((socialMediaItem) => (
      <InterlayLink
        key={socialMediaItem.link}
        className={clsx(
          'bg-interlayHaiti',
          'w-6',
          'h-6',
          'ring-1',
          'ring-white',
          'rounded-full',
          'm-1',
          'grid',
          'place-items-center',
          { 'text-interlayHaiti': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}
        href={socialMediaItem.link}
        target='_blank'
        rel='noopener noreferrer'
      >
        {socialMediaItem.icon}
      </InterlayLink>
    ))}
  </div>
);

export default SocialMediaContainer;
