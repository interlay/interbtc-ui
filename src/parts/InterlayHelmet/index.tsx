
import { Helmet } from 'react-helmet-async';

import { APP_NAME } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

let folderName: string;
let domain: string;
let imageName: string;
if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  folderName = 'interlay';
  domain = 'https://bridge.interlay.io';
  imageName = 'interbtc-meta-image.jpg';
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  folderName = 'kintsugi';
  domain = '';
  imageName = 'kbtc-meta-image.jpg';
} else {
  throw new Error('Something went wrong!');
}

const InterlayHelmet = (): JSX.Element => (
  <Helmet>
    <link
      rel='apple-touch-icon'
      sizes='180x180'
      href={`/${folderName}/apple-touch-icon.png`} />
    <link
      rel='icon'
      type='image/png'
      sizes='32x32'
      href={`/${folderName}/favicon-32x32.png`} />
    <link
      rel='icon'
      type='image/png'
      sizes='16x16'
      href={`/${folderName}/favicon-16x16.png`} />
    {/*
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    */}
    <link
      rel='mask-icon'
      href={`/${folderName}/safari-pinned-tab.svg`}
      color='#5bbad5' />
    <link
      rel='shortcut icon'
      href={`/${folderName}/favicon.ico`} />
    <meta
      name='msapplication-config'
      content={`/${folderName}/browserconfig.xml`} />
    <link
      rel='manifest'
      href={`/${folderName}/site.webmanifest`} />
    <title>{APP_NAME}</title>
    {/* Primary Meta Tags */}
    <meta
      name='title'
      content={APP_NAME} />
    <meta
      name='description'
      content={`${APP_NAME}: Trustless and open DeFi access for your Bitcoin`} />
    {/* Open Graph / Facebook */}
    <meta
      property='og:type'
      content='website' />
    <meta
      property='og:url'
      content={domain} />
    <meta
      property='og:title'
      content={APP_NAME} />
    <meta
      property='og:description'
      content={`${APP_NAME}: Trustless and open DeFi access for your Bitcoin`} />
    <meta
      property='og:image'
      content={`${domain}/${folderName}/${imageName}`} />
    <meta
      property='og:image:width'
      content='1200' />
    <meta
      property='og:image:height'
      content='598' />
    {/* Twitter */}
    <meta
      property='twitter:card'
      content='summary_large_image' />
    <meta
      property='twitter:url'
      content={domain} />
    <meta
      property='twitter:title'
      content={APP_NAME} />
    <meta
      property='twitter:description'
      content={`${APP_NAME}: Trustless and open DeFi access for your Bitcoin`} />
    <meta
      property='twitter:image'
      content={`${domain}/${folderName}/${imageName}`} />
  </Helmet>
);

export default InterlayHelmet;
