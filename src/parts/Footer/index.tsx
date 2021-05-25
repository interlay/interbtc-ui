
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  FaTwitter,
  FaMediumM,
  FaGithub,
  FaLinkedinIn,
  FaDiscord
} from 'react-icons/fa';

import SubscribeForm from 'components/SubscribeForm';
import InterlayLink from 'components/UI/InterlayLink';
import { getCurrentYear } from 'utils/helpers/time';
import {
  INTERLAY_COMPANY,
  WEB3_FOUNDATION,
  INTERLAY_EMAIL,
  INTERLAY_TWITTER,
  INTERLAY_MEDIUM,
  INTERLAY_GITHUB,
  INTERLAY_LINKEDIN,
  INTERLAY_DISCORD,
  POLKA_BTC_UI_GITHUB,
  POLKA_BTC_UI_GITHUB_ISSUES,
  USER_FEEDBACK_FORM,
  VAULT_FEEDBACK_FORM,
  RELAYER_FEEDBACK_FORM,
  POLKA_BTC_DOC_START_TREASURE_HUNT,
  POLKA_BTC_DOC_START_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_START_TREASURE_HUNT_STAKED_RELAYER,
  POLKA_BTC_DOC_START_OVERVIEW,
  POLKA_BTC_DOC_VAULTS_OVERVIEW,
  POLKA_BTC_DOC_RELAYERS_OVERVIEW,
  POLKA_BTC_DOC_DEVELOPERS_INTEGRATION,
  PRIVACY_POLICY,
  POLKA_BTC_DOC_ABOUT_ROADMAP,
  NEWS_LETTER_SUBSCRIPTION_ENDPOINT
} from 'config/links';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo.svg';
// TODO: should use a vivid-looking version
import {
  ReactComponent as Web3FoundationGrantsBadgeIcon
} from 'assets/img/web3-foundation-grants-badge.svg';
import styles from './footer.module.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../package.json');

const FOOTER_COLUMNS = [
  {
    title: 'footer.contact',
    listItems: [
      {
        title: 'Twitter',
        link: INTERLAY_TWITTER
      },
      {
        title: 'Discord',
        link: INTERLAY_DISCORD
      },
      {
        title: 'Email',
        link: INTERLAY_EMAIL
      }
    ]
  },
  {
    title: 'footer.challenges',
    listItems: [
      {
        title: 'footer.treasure_hunt',
        link: POLKA_BTC_DOC_START_TREASURE_HUNT
      },
      {
        title: 'footer.vault_treasure',
        link: POLKA_BTC_DOC_START_TREASURE_HUNT_VAULT
      },
      {
        title: 'footer.relayer_treasure',
        link: POLKA_BTC_DOC_START_TREASURE_HUNT_STAKED_RELAYER
      }
    ]
  },
  {
    title: 'footer.feedback',
    listItems: [
      {
        title: 'footer.user_feedback_form',
        link: USER_FEEDBACK_FORM
      },
      {
        title: 'footer.vault_feedback_form',
        link: VAULT_FEEDBACK_FORM
      },
      {
        title: 'footer.relayer_feedback_form',
        link: RELAYER_FEEDBACK_FORM
      },
      {
        title: 'footer.open_an_issue_on_github',
        link: POLKA_BTC_UI_GITHUB_ISSUES
      },
      {
        title: 'footer.discuss_on_discord',
        link: INTERLAY_DISCORD
      }
    ]
  },
  {
    title: 'footer.docs',
    listItems: [
      {
        title: 'footer.getting_started',
        link: POLKA_BTC_DOC_START_OVERVIEW
      },
      {
        title: 'footer.vaults',
        link: POLKA_BTC_DOC_VAULTS_OVERVIEW
      },
      {
        title: 'footer.relayers',
        link: POLKA_BTC_DOC_RELAYERS_OVERVIEW
      },
      {
        title: 'footer.developers',
        link: POLKA_BTC_DOC_DEVELOPERS_INTEGRATION
      },
      {
        title: 'footer.roadmap',
        link: POLKA_BTC_DOC_ABOUT_ROADMAP
      }
    ]
  }
];

const SOCIAL_PLATFORM_ITEMS = [
  {
    link: INTERLAY_TWITTER,
    icon: <FaTwitter />
  },
  {
    link: INTERLAY_MEDIUM,
    icon: <FaMediumM />
  },
  {
    link: INTERLAY_GITHUB,
    icon: <FaGithub />
  },
  {
    link: INTERLAY_LINKEDIN,
    icon: <FaLinkedinIn />
  },
  {
    link: INTERLAY_DISCORD,
    icon: <FaDiscord />
  }
];

const FOOTER_BOTTOM_ITEMS = [
  {
    title: `© ${getCurrentYear()} Interlay`,
    link: null
  },
  {
    title: 'footer.all_rights_reserved',
    link: null
  },
  {
    title: 'footer.privacy',
    link: PRIVACY_POLICY
  },
  {
    title: `version ${packageJson.version}`,
    link: POLKA_BTC_UI_GITHUB
  }
];

const ColumnTitle = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h5'>) => (
  <h5
    className={clsx(
      'font-bold',
      className
    )}
    {...rest}>
    {children}
  </h5>
);

const Column = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'p-4',
      'mb-8',
      className
    )}
    {...rest} />
);

const ColumnList = (props: React.ComponentPropsWithRef<'ul'>) => (
  <ul {...props} />
);

const ColumnListItem = (props: React.ComponentPropsWithRef<'li'>) => (
  <li {...props} />
);

type Ref = HTMLDivElement;
type Props = React.ComponentPropsWithRef<'footer'>;

const Footer = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref) => {
  const { t } = useTranslation();

  return (
    <footer
      ref={ref}
      className={clsx(
        'bg-default',
        className
      )}
      {...rest}>
      <div
        className={clsx(
          'container',
          'py-8',
          'px-20',
          'mx-auto',
          'space-y-10'
        )}>
        <div
          className={clsx(
            'flex',
            'flex-wrap',
            'justify-between'
          )}>
          {FOOTER_COLUMNS.map(footerColumn => {
            const columnTitle = footerColumn.title;
            const columnListItems = footerColumn.listItems;

            return (
              <Column
                key={columnTitle}
                className='space-y-3.5'>
                <ColumnTitle>
                  {t(columnTitle)}
                </ColumnTitle>
                <ColumnList className='space-y-3.5'>
                  {columnListItems.map(columnListItem => (
                    <ColumnListItem key={columnListItem.title}>
                      <InterlayLink
                        href={columnListItem.link}
                        target='_blank'
                        rel='noopener noreferrer'>
                        {t(columnListItem.title)}
                      </InterlayLink>
                    </ColumnListItem>
                  ))}
                </ColumnList>
              </Column>
            );
          })}
          <Column className='space-y-6'>
            <div
              className={clsx(
                'flex',
                'flex-wrap'
              )}>
              {SOCIAL_PLATFORM_ITEMS.map(socialPlatformItem => (
                <InterlayLink
                  key={socialPlatformItem.link}
                  className={clsx(
                    'border',
                    'border-black',
                    'border-solid',
                    'rounded-full',
                    'w-12',
                    'h-12',
                    'm-1',
                    'grid',
                    'place-items-center'
                  )}
                  href={socialPlatformItem.link}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {socialPlatformItem.icon}
                </InterlayLink>
              ))}
            </div>
            <SubscribeForm endpoint={NEWS_LETTER_SUBSCRIPTION_ENDPOINT} />
          </Column>
        </div>
        <div
          className={clsx(
            'flex',
            'flex-wrap',
            'items-end',
            'space-x-10'
          )}>
          <InterlayLink
            href={INTERLAY_COMPANY}
            target='_blank'
            rel='noopener noreferrer'>
            <InterlayLogoIcon
              width={150}
              height={40} />
          </InterlayLink>
          <InterlayLink
            href={WEB3_FOUNDATION}
            target='_blank'
            rel='noopener noreferrer'>
            <Web3FoundationGrantsBadgeIcon
              width={150}
              height={50} />
          </InterlayLink>
          <ul
            className={clsx(
              'flex',
              'flex-wrap',
              'm-0'
            )}>
            {FOOTER_BOTTOM_ITEMS.map(footerBottomItem => (
              <li
                key={footerBottomItem.title}
                className={clsx(
                  styles['footer-bottom-item'],
                  'text-sm'
                )}>
                {footerBottomItem.link ? (
                  <InterlayLink
                    className='whitespace-nowrap'
                    href={footerBottomItem.link}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t(footerBottomItem.title)}
                  </InterlayLink>
                ) : (
                  <span className='whitespace-nowrap'>
                    {t(footerBottomItem.title)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = 'Footer';

export default Footer;
