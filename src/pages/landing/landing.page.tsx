
import React from 'react';
import {
  Button,
  Col,
  Image,
  Row
} from 'react-bootstrap';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  Link,
  NavLink
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Timer from 'common/components/timer';
import * as constants from '../../constants';
import checkStaticPage from 'config/check-static-page';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';
import PolkaBTCImg from 'assets/img/polkabtc/PolkaBTC_white.svg';

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
      <section className='jumbotron min-vh-90 text-center transparent-background'>
        <div className='container mt-5'>
          <Link to={PAGES.HOME}>
            <Image
              src={PolkaBTCImg}
              width='256'>
            </Image>
          </Link>
          <h1 className='text-white mt-5'>PolkaBTC</h1>
          <h2 className='text-white'>{t('landing.defi_ecosystem')}</h2>

          {checkStaticPage() ? (
            <div>
              <h4 className='text-white mt-5'>{t('landing.beta_coming')}</h4>
              <h1 className='text-white mt-5'>
                <Timer seconds={secondsUntilBeta}></Timer>
              </h1>
              {/* <h5 className="text-light mt-1">
                {formatDateTime(new Date(constants.BETA_LAUNCH_DATE * 1000))}
              </h5> */}
              <Row className='mt-5'>
                <Col
                  className='mt-2'
                  xs='12'
                  sm={{ span: 4, offset: 2 }}>
                  <a
                    className='text-decoration-none'
                    href='https://docs.polkabtc.io/#/'
                    target='_bank'
                    rel='noopener noreferrer'>
                    <Button
                      variant='outline-bitcoin'
                      size='lg'
                      block>
                      {t('landing.docs')}
                    </Button>
                  </a>
                </Col>
                <Col
                  className='mt-2'
                  xs='12'
                  sm={{ span: 4, offset: 0 }}>
                  <a
                    className='text-decoration-none'
                    href='https://discord.gg/KgCYK3MKSf'
                    target='_blank'
                    rel='noopener noreferrer'>
                    <Button
                      variant='outline-bitcoin'
                      size='lg'
                      block>
                      {t('landing.discord')}
                    </Button>
                  </a>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row className='mt-4'>
                <Col
                  xs='12'
                  sm={{ span: 6, offset: 3 }}>
                  <h5 className='text-white'>
                    {t('landing.issued')} {totalPolkaBTC} PolkaBTC
                  </h5>
                </Col>
              </Row>
              <Row className='mt-1'>
                <Col
                  xs='12'
                  sm={{ span: 6, offset: 3 }}>
                  <h5 className='text-white'>
                    {t('locked')} {totalLockedDOT} DOT
                  </h5>
                </Col>
              </Row>
              {polkaBtcLoaded && (
                <Row className='mt-5'>
                  <Col
                    className='mt-2'
                    xs='12'
                    sm={{ span: 4, offset: 2 }}>
                    <NavLink
                      className='text-decoration-none'
                      to={PAGES.APPLICATION}>
                      <Button
                        variant='outline-polkadot'
                        size='lg'
                        block
                        onClick={checkWalletAndAccount}>
                        {t('app')}
                      </Button>
                    </NavLink>
                  </Col>
                  <Col
                    className='mt-2'
                    xs='12'
                    sm={{ span: 4 }}>
                    <NavLink
                      className='text-decoration-none'
                      to={PAGES.DASHBOARD}>
                      <Button
                        variant='outline-bitcoin'
                        size='lg'
                        block
                        onClick={checkWalletAndAccount}>
                        {t('nav_dashboard')}
                      </Button>
                    </NavLink>
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
