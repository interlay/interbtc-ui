
import {
  FaGithub,
  FaTwitter,
  FaDiscord
} from 'react-icons/fa';
import clsx from 'clsx';

import InterlayImage from 'components/InterlayImage';
import InterlayLink from 'components/InterlayLink';
import { getCurrentYear } from 'utils/helpers/time';
import {
  POLKA_BTC_UI_GITHUB,
  WEB3_FOUNDATION,
  INTERLAY_COMPANY,
  INTERLAY_EMAIL,
  INTERLAY_DISCORD,
  INTERLAY_GITHUB,
  INTERLAY_TWITTER
} from 'config/links';
// TODO: should use an SVG
import interlayImage from 'assets/img/interlay.png';
// TODO: should use next-gen format
import web3FoundationImage from 'assets/img/polkabtc/web3-foundation-grants-badge-black.png';
import styles from './footer.module.css';

const packageJson = require('../../../../package.json');

interface Props {
  isHomePage: boolean;
}

const Footer = ({ isHomePage }: Props) => (
  <footer
    className={clsx(
      styles['footer'],
      // TODO: a hack for now
      { [styles['footer-gradient']]: !isHomePage }
    )}>
    <div className={clsx(styles['footer-row'], styles['first-row'])}>
      <InterlayLink
        href={INTERLAY_COMPANY}
        target='_blank'
        rel='noopener noreferrer'
        style={{ display: 'inline-block' }}>
        <InterlayImage
          src={interlayImage}
          width={128}
          height={30}
          alt='Interlay' />
      </InterlayLink>
      <InterlayLink
        href={WEB3_FOUNDATION}
        target='_blank'
        rel='noopener noreferrer'
        style={{ display: 'inline-block' }}>
        <InterlayImage
          src={web3FoundationImage}
          width={116}
          height={40}
          alt='Web3 Foundation' />
      </InterlayLink>
    </div>
    <div className={clsx(styles['footer-row'], styles['second-row'])}>
      <InterlayLink
        href={POLKA_BTC_UI_GITHUB}
        target='_blank'
        rel='noopener noreferrer'>
        v&nbsp;{packageJson.version}
      </InterlayLink>
      <span className='interlay-text-white'>&copy;{getCurrentYear()} Interlay.</span>
      <span className='interlay-text-white'>All Rights Reserved</span>
      <span>|</span>
      <InterlayLink
        href='https://www.interlay.io/docs/privacy-policy.pdf'
        target='_blank'
        rel='noopener noreferrer'>
        Privacy Policy
      </InterlayLink>
    </div>
    <div className={clsx(styles['footer-row'], styles['third-row'])}>
      <InterlayLink
        href={INTERLAY_EMAIL}
        target='_blank'
        rel='noopener noreferrer'
        data-placement='bottom'
        data-original-title='Drop us an email'>
        polkabtc@interlay.io
      </InterlayLink>
      <InterlayLink
        href={INTERLAY_DISCORD}
        target='_blank'
        rel='noopener noreferrer'
        data-placement='bottom'
        data-original-title='Join our Discord channel'>
        {/* TODO: could larger icons */}
        <FaDiscord />
      </InterlayLink>
      <InterlayLink
        href={INTERLAY_GITHUB}
        target='_blank'
        rel='noopener noreferrer'
        data-placement='bottom'
        data-original-title='Follow us on Github'>
        <FaGithub />
      </InterlayLink>
      <InterlayLink
        href={INTERLAY_TWITTER}
        target='_blank'
        rel='noopener noreferrer'
        data-placement='bottom'
        data-original-title='Follow us on Twitter'>
        <FaTwitter />
      </InterlayLink>
    </div>
  </footer>
);

export default Footer;
