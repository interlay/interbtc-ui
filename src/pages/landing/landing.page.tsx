
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

import Timer from 'components/Timer';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import checkStaticPage from 'config/check-static-page';
import {
  PAGES,
  QUERY_PARAMETERS
} from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';
import * as constants from '../../constants';
import TAB_IDS from 'utils/constants/tab-ids';
import { ReactComponent as InterbtcLogoIcon } from 'assets/img/interbtc-logo.svg';

const queryString = require('query-string');

export default function LandingPage(): JSX.Element {
  const { totalInterBTC, totalLockedDOT, interBtcLoaded, address, extensions } = useSelector(
    (state: StoreType) => state.general
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const initialLeftSecondsUntilBeta = constants.BETA_LAUNCH_DATE - nowInSeconds;

  const checkWalletAndAccount = () => {
    if (!extensions.length || !address) {
      dispatch(showAccountModalAction(true));
    }
  };

  return (
    <section
      className={clsx(
        'text-center',
        'px-8',
        'py-16',
        // TODO: could be better
        'grid',
        'place-items-center',
        'min-h-screen',
        '-mt-20'
      )}>
      <div
        className={clsx(
          'container',
          'mx-auto'
        )}>
        <InterlayRouterLink
          style={{ display: 'inline-block' }}
          to={PAGES.home}>
          <InterbtcLogoIcon
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
          InterBTC
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
              <Timer initialLeftSeconds={initialLeftSecondsUntilBeta} />
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
                  href='https://docs.interbtc.io/#/'
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
                  {t('landing.issued')} {totalInterBTC} InterBTC
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
            {interBtcLoaded && (
              <Row className={clsx('mt-12')}>
                <Col
                  className='mt-2'
                  xs='12'
                  sm={{ span: 4, offset: 2 }}>
                  <InterlayRouterLink
                    style={{
                      textDecoration: 'none'
                    }}
                    to={{
                      pathname: PAGES.application,
                      search: queryString.stringify({
                        [QUERY_PARAMETERS.tab]: TAB_IDS.issue
                      })
                    }}>
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
                    to={PAGES.dashboard}>
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
  );
}
