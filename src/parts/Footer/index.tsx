
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';
import { getCurrentYear } from 'utils/helpers/time';
import {
  POLKA_BTC_UI_GITHUB,
  // WEB3_FOUNDATION,
  // INTERLAY_COMPANY,
  INTERLAY_EMAIL,
  INTERLAY_DISCORD,
  // INTERLAY_LINKEDIN,
  // INTERLAY_MEDIUM,
  // INTERLAY_GITHUB,
  POLKA_BTC_UI_GITHUB_ISSUES,
  INTERLAY_TWITTER,
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
  POLKA_BTC_DOC_ABOUT_ROADMAP
  // NEWS_LETTER_SUBSCRIPTION_ENDPOINT
} from 'config/links';
import { ReactComponent as InterlayLogoIcon } from 'assets/img/interlay-logo.svg';
// import {
//   ReactComponent as Web3FoundationGrantsBadgeIcon
// } from 'assets/img/polkabtc/web3-foundation-grants-badge.svg';
import styles from './footer.module.css';

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
  children,
  ...rest
}: React.ComponentPropsWithRef<'h5'>) => (
  <h5 {...rest}>
    {children}
  </h5>
);

const Column = (props: React.ComponentPropsWithRef<'div'>) => (
  <div {...props} />
);

const ColumnList = (props: React.ComponentPropsWithRef<'ul'>) => (
  <ul {...props} />
);

const ColumnListItem = (props: React.ComponentPropsWithRef<'li'>) => (
  <li {...props} />
);

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer
      className={clsx(
        'bg-default'
      )}>
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
                className={clsx(
                  'p-4',
                  'space-y-3.5'
                )}>
                <ColumnTitle>
                  {t(columnTitle)}
                </ColumnTitle>
                <ColumnList
                  className={clsx(
                    'space-y-3.5'
                  )}>
                  {columnListItems.map(columnListItem => (
                    <ColumnListItem>
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
        </div>
        <div
          className={clsx(
            'flex',
            'flex-wrap',
            'items-end',
            'space-x-10'
          )}>
          <InterlayLogoIcon
            width={150}
            height={40} />
          {/* <Web3FoundationGrantsBadgeIcon
            width={150}
            height={50} /> */}
          <ul
            className={clsx(
              'flex',
              'flex-wrap',
              'm-0'
            )}>
            {FOOTER_BOTTOM_ITEMS.map(footerBottomItem => (
              <li
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
};

export default Footer;
