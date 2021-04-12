
import {
  Button,
  Col,
  Row
} from 'react-bootstrap';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import Timer from 'common/components/timer';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import checkStaticPage from 'config/check-static-page';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';
import * as constants from '../../constants';
import { ReactComponent as PolkabtcLogoIcon } from 'assets/img/polkabtc/polkabtc-logo.svg';

export default function LandingPage(): JSX.Element {
  const { totalPolkaBTC, totalLockedDOT, polkaBtcLoaded, address, extensions } = useSelector(
    (state: StoreType) => state.general
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const secondsUntilBeta = constants.BETA_LAUNCH_DATE - nowInSeconds;

  const checkWalletAndAccount = () => {
    if (!extensions.length || !address) {
      dispatch(showAccountModalAction(true));
    }
  };

  return (
    <div>
      <section className='jumbotron text-center transparent-background'>
        <div
          className={clsx(
            'container',
            'mt-12',
            'mx-auto'
          )}>
          <InterlayRouterLink
            style={{ display: 'inline-block' }}
            to={PAGES.HOME}>
            <PolkabtcLogoIcon
              fill='currentColor'
              className='text-white'
              width={256}
              height={150.84} />
          </InterlayRouterLink>
          <h1
            className={clsx(
              'text-white',
              'mt-12',
              'mb-2',
              'text-4xl'
            )}>
            PolkaBTC
          </h1>
          <h2
            className={clsx(
              'text-white',
              'mb-2',
              'text-3xl'
            )}>
            {t('landing.defi_ecosystem')}
          </h2>

          {checkStaticPage() ? (
            <div>
              <h4
                className={clsx(
                  'text-white',
                  'mt-12',
                  'mb-2',
                  'text-2xl'
                )}>
                {t('landing.beta_coming')}
              </h4>
              <h1
                className={clsx(
                  'text-white',
                  'mt-12',
                  'mb-2',
                  'text-4xl'
                )}>
                <Timer seconds={secondsUntilBeta}></Timer>
              </h1>
              <Row className={clsx('mt-12')}>
                <Col
                  className='mt-2'
                  xs='12'
                  sm={{ span: 4, offset: 2 }}>
                  <InterlayLink
                    style={{
                      textDecoration: 'none'
                    }}
                    href='https://docs.polkabtc.io/#/'
                    target='_bank'
                    rel='noopener noreferrer'>
                    <Button
                      variant='outline-bitcoin'
                      size='lg'
                      block>
                      {t('landing.docs')}
                    </Button>
                  </InterlayLink>
                </Col>
                <Col
                  className='mt-2'
                  xs='12'
                  sm={{ span: 4, offset: 0 }}>
                  <InterlayLink
                    style={{
                      textDecoration: 'none'
                    }}
                    href='https://discord.gg/KgCYK3MKSf'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button
                      variant='outline-bitcoin'
                      size='lg'
                      block>
                      {t('landing.discord')}
                    </Button>
                  </InterlayLink>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row className={clsx('mt-6')}>
                <Col
                  xs='12'
                  sm={{ span: 6, offset: 3 }}>
                  <h5
                    className={clsx(
                      'text-white',
                      'mb-2',
                      'text-xl'
                    )}>
                    {t('landing.issued')} {totalPolkaBTC} PolkaBTC
                  </h5>
                </Col>
              </Row>
              <Row className='mt-1'>
                <Col
                  xs='12'
                  sm={{ span: 6, offset: 3 }}>
                  <h5
                    className={clsx(
                      'text-white',
                      'mb-2',
                      'text-xl'
                    )}>
                    {t('locked')} {totalLockedDOT} DOT
                  </h5>
                </Col>
              </Row>
              {polkaBtcLoaded && (
                <Row className={clsx('mt-12')}>
                  <Col
                    className='mt-2'
                    xs='12'
                    sm={{ span: 4, offset: 2 }}>
                    <InterlayRouterLink
                      style={{
                        textDecoration: 'none'
                      }}
                      to={PAGES.APPLICATION}>
                      <Button
                        variant='outline-dark'
                        size='lg'
                        block
                        onClick={checkWalletAndAccount}>
                        {t('app')}
                      </Button>
                    </InterlayRouterLink>
                  </Col>
                  <Col
                    className='mt-2'
                    xs='12'
                    sm={{ span: 4 }}>
                    <InterlayRouterLink
                      style={{
                        textDecoration: 'none'
                      }}
                      to={PAGES.DASHBOARD}>
                      <Button
                        variant='outline-dark'
                        size='lg'
                        block
                        onClick={checkWalletAndAccount}>
                        {t('nav_dashboard')}
                      </Button>
                    </InterlayRouterLink>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
