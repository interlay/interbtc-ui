
import { Helmet } from 'react-helmet-async';

import {
  APP_NAME,
  PUBLIC_ASSETS_FOLDER_NAME,
  APP_DOMAIN,
  OPEN_GRAPH_IMAGE_FILE_NAME
} from 'config/relay-chains';

const InterlayHelmet = (): JSX.Element => (
  <Helmet>
    <link
      rel='apple-touch-icon'
      sizes='180x180'
      href={`/${PUBLIC_ASSETS_FOLDER_NAME}/apple-touch-icon.png`} />
    <link
      rel='icon'
      type='image/png'
      sizes='32x32'
      href={`/${PUBLIC_ASSETS_FOLDER_NAME}/favicon-32x32.png`} />
    <link
      rel='icon'
      type='image/png'
      sizes='16x16'
      href={`/${PUBLIC_ASSETS_FOLDER_NAME}/favicon-16x16.png`} />
    {/*
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    */}
    <link
      rel='mask-icon'
      href={`/${PUBLIC_ASSETS_FOLDER_NAME}/safari-pinned-tab.svg`}
      color='#5bbad5' />
    <link
      rel='shortcut icon'
      href={`/${PUBLIC_ASSETS_FOLDER_NAME}/favicon.ico`} />
    <meta
      name='msapplication-config'
      content={`/${PUBLIC_ASSETS_FOLDER_NAME}/browserconfig.xml`} />
    <link
      rel='manifest'
      href={`/${PUBLIC_ASSETS_FOLDER_NAME}/site.webmanifest`} />
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
      content={APP_DOMAIN} />
    <meta
      property='og:title'
      content={APP_NAME} />
    <meta
      property='og:description'
      content={`${APP_NAME}: Trustless and open DeFi access for your Bitcoin`} />
    <meta
      property='og:image'
      content={`${APP_DOMAIN}/${PUBLIC_ASSETS_FOLDER_NAME}/${OPEN_GRAPH_IMAGE_FILE_NAME}`} />
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
      content={APP_DOMAIN} />
    <meta
      property='twitter:title'
      content={APP_NAME} />
    <meta
      property='twitter:description'
      content={`${APP_NAME}: Trustless and open DeFi access for your Bitcoin`} />
    <meta
      property='twitter:image'
      content={`${APP_DOMAIN}/${PUBLIC_ASSETS_FOLDER_NAME}/${OPEN_GRAPH_IMAGE_FILE_NAME}`} />
  </Helmet>
);

export default InterlayHelmet;
