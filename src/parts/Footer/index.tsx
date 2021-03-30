
import { useTranslation } from 'react-i18next';

import InterlayImage from 'components/UI/InterlayImage';
import InterlayLink from 'components/UI/InterlayLink';
import { getCurrentYear } from 'utils/helpers/time';
import {
  POLKA_BTC_UI_GITHUB,
  WEB3_FOUNDATION,
  INTERLAY_COMPANY,
  INTERLAY_EMAIL,
  INTERLAY_DISCORD,
  INTERLAY_LINKEDIN,
  INTERLAY_MEDIUM,
  INTERLAY_GITHUB,
  POLKA_BTC_UI_GITHUB_ISSUES,
  INTERLAY_TWITTER,
  USER_FEEDBACK_FORM,
  VAULT_FEEDBACK_FORM,
  RELAYER_FEEDBACK_FORM,
  POLKA_BTC_DOC_TREASURE_HUNT,
  POLKA_BTC_DOC_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_TREASURE_HUNT_RELAYER,
  POLKA_BTC_DOC_GETTING_STARTED,
  POLKA_BTC_DOC_VAULTS,
  POLKA_BTC_DOC_RELAYERS,
  POLKA_BTC_DOC_DEVELOPERS,
  POLKA_BTC_DOC_ROADMAP,
  PRIVACY_POLICY,
  NEWS_LETTER_ACTION
} from 'config/links';
import styles from './footer.module.css';
import interlayImage from 'assets/img/interlay.svg';
// TODO: Update svg
import web3FoundationImage from 'assets/img/polkabtc/web3-foundation-grants-badge-black.png';

const packageJson = require('../../../package.json');

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles['footer']}>
      <div className={styles[`logos-container`]}>
        <InterlayLink
          href={INTERLAY_COMPANY}
          target='_blank'
          rel='noopener noreferrer'
          style={{ display: 'inline-block' }}>
          <InterlayImage
            src={interlayImage}
            width={150}
            height={40}
            alt='Interlay' />
        </InterlayLink>
        <div className={styles['padding-for-logo-2']}>
          <InterlayLink
            href={WEB3_FOUNDATION}
            target='_blank'
            rel='noopener noreferrer'
            style={{ display: 'inline-block' }}>
            <InterlayImage
              src={web3FoundationImage}
              width={150}
              height={50}
              alt='Web3 Foundation' />
          </InterlayLink>
        </div>
      </div>
      <div className={styles['grid-container']}>
        <div
          id='contact-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.contact')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <li>
                  <InterlayLink
                    href={INTERLAY_DISCORD}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-placement='bottom'
                    data-original-title='Join our Discord channel'>
                 Discord
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={INTERLAY_EMAIL}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-placement='bottom'
                    data-original-title='Drop us an email'>
                 Email
                  </InterlayLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='challenges-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.challenges')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_TREASURE_HUNT}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.treasure_hunt')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_TREASURE_HUNT_VAULT}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.vault_treasure')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_TREASURE_HUNT_RELAYER}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.relayer_treasure')}
                  </InterlayLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='feedback-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.feedback')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <li>
                  <InterlayLink
                    href={USER_FEEDBACK_FORM}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.user_feedback')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={VAULT_FEEDBACK_FORM}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.vault_feedback')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={RELAYER_FEEDBACK_FORM}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.relayer_feedback')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_UI_GITHUB_ISSUES}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.open_issue')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={INTERLAY_DISCORD}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.discuss_discord')}
                  </InterlayLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='docs-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.docs')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_GETTING_STARTED}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.getting_started')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_VAULTS}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.vaults_docs')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_RELAYERS}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.Relayer_docs')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_DEVELOPERS}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.developers')}
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={POLKA_BTC_DOC_ROADMAP}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.roadmap')}
                  </InterlayLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='contact-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.follow_us')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <li>
                  <InterlayLink
                    href={INTERLAY_TWITTER}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-placement='bottom'
                    data-original-title='Follow us on Twitter'>
                  Twitter
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={INTERLAY_MEDIUM}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-placement='bottom'
                    data-original-title='Follow us on Medium'>
                  Medium
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={INTERLAY_GITHUB}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-placement='bottom'
                    data-original-title='Follow us on Github'>
                 Github
                  </InterlayLink>
                </li>
                <li>
                  <InterlayLink
                    href={INTERLAY_LINKEDIN}
                    target='_blank'
                    rel='noopener noreferrer'
                    data-placement='bottom'
                    data-original-title='Follow us on LinkedIn'>
                  LinkedIn
                  </InterlayLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='newsletter-container'
          className={styles['footer-items-container']}>
          <div>
            <div className={styles['title']}>{t('footer.newsletter')}</div>
            <ul>
              <li>
                <form
                  action={NEWS_LETTER_ACTION}
                  method='post'
                  id='mc-embedded-subscribe-form'
                  name='mc-embedded-subscribe-form'
                  className={styles['signup-container']}
                  target='_blank'>
                  <div id='mc_embed_signup_scroll'>
                    <div className='input-group'>
                      <input
                        type='email'
                        className={styles['newsletter-input']}
                        placeholder=' Enter email here'
                        name='EMAIL'
                        id='mce-EMAIL' />
                      <div>
                        <button
                          className={styles['newsletter-button']}
                          type='submit'
                          name='subscribe'
                          id='mc-embedded-subscribe'>
                          {t('footer.subscribe')}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </li>
              <li>
                <div className={styles['signup-text-container']}>{t('footer.join_newsletter')}</div>
              </li>
              <li>
                <div className={styles['rights-container']}>
                  <InterlayLink
                    href={POLKA_BTC_UI_GITHUB}
                    target='_blank'
                    rel='noopener noreferrer'>
                    v&nbsp;{packageJson.version}
                  </InterlayLink>
                  &nbsp;&#169; {getCurrentYear()} Interlay. {t('footer.rights_reserved')}
                </div>
                <li>
                  <InterlayLink
                    href={PRIVACY_POLICY}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {t('footer.read_our_policy')}
                  </InterlayLink>
                </li>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
