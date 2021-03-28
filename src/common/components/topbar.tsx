import React, { ReactElement, useEffect, useState } from 'react';
import polkaBTCLogo from '../../assets/img/polkabtc/PolkaBTC_black.png';
import { Navbar, Nav, Image, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType } from '../types/util.types';
import ButtonMaybePending from './pending-button';
import { planckToDOT } from '@interlay/polkabtc';
import { updateBalanceDOTAction, showAccountModalAction } from '../actions/general.actions';
import { shortAddress, updateBalances } from '../utils/utils';
import { useTranslation } from 'react-i18next';
import Balances from './balances';
import { PAGES } from 'utils/constants/links';
import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import clsx from 'clsx';

type TopbarProps = {
  address?: string;
  requestDOT: () => Promise<void>;
};

export default function Topbar(props: TopbarProps): ReactElement {
  const {
    extensions,
    address,
    polkaBtcLoaded,
    balanceDOT,
    balancePolkaBTC,
    vaultClientLoaded,
    relayerLoaded
  } = useSelector((state: StoreType) => state.general);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || address === '') return;

      updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
    };
    fetchData();
  }, [address, polkaBtcLoaded, dispatch, balanceDOT, balancePolkaBTC]);

  const requestDOT = async () => {
    if (!polkaBtcLoaded) return;
    setIsRequestPending(true);
    try {
      await props.requestDOT();
      const accountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
      const balanceDOT = planckToDOT(balancePLANCK.toString());
      dispatch(updateBalanceDOTAction(balanceDOT));
    } catch (error) {
      console.log(error);
    }
    setIsRequestPending(false);
  };

  const getLabel = (): string => {
    if (!extensions.length) return 'Connect Wallet';

    if (!address) return 'Select Account';

    return shortAddress(address);
  };

  return (
    <Navbar
      id='pbtc-topbar'
      bg='light'
      expand='lg'
      className={clsx(
        'border-bottom top-bar',
        'shadow'
      )}>
      {polkaBtcLoaded && (
        <React.Fragment>
          <Navbar.Brand>
            <InterlayRouterLink
              // TODO: hardcoded
              style={{
                textDecoration: 'none'
              }}
              to={PAGES.HOME}>
              <Image
                src={polkaBTCLogo}
                width='90'
                className='d-inline-block align-top'
                height='30'
                fluid />
            </InterlayRouterLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              {polkaBtcLoaded && (
                // TODO: should use https://reactrouter.com/web/api/NavLink with `activeClassName`
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.APPLICATION}>
                  {t('app')}
                </InterlayRouterLink>
              )}
              {polkaBtcLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.DASHBOARD}>
                  {t('nav_dashboard')}
                </InterlayRouterLink>
              )}
              {vaultClientLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.VAULT}>
                  {t('nav_vault')}
                </InterlayRouterLink>
              )}
              {relayerLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.STAKED_RELAYER}>
                  {t('nav_relayer')}
                </InterlayRouterLink>
              )}
              {polkaBtcLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.CHALLENGES}>
                  {t('nav_challenges')}
                  <NewMarkIcon
                    width={20}
                    height={20} />
                </InterlayRouterLink>
              )}
              <InterlayRouterLink
                style={{
                  textDecoration: 'none'
                }}
                className='nav-link'
                to={PAGES.FEEDBACK}>
                {t('feedback.feedback')}
              </InterlayRouterLink>
              <InterlayLink
                style={{
                  textDecoration: 'none'
                }}
                className='nav-link'
                href='https://docs.polkabtc.io/#/'
                target='_blank'
                rel='noopener noreferrer'>
                {t('nav_docs')}
              </InterlayLink>
            </Nav>
            {props.address !== undefined && (
              <React.Fragment>
                {address === '' ? (
                  <Nav
                    id='account-button'
                    className='d-inline'>
                    <Button
                      variant='outline-account-not-connected'
                      className='nav-bar-button'
                      onClick={() => dispatch(showAccountModalAction(true))}>
                      {getLabel()}
                    </Button>
                  </Nav>
                ) : (
                  <>
                    <Nav className='d-inline'>
                      <InterlayLink
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://testnet-faucet.mempool.co/'
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outline-bitcoin'
                          className='nav-bar-button'>
                          {t('request_btc')}
                        </Button>
                      </InterlayLink>
                      <ButtonMaybePending
                        variant='outline-polkadot'
                        className='nav-bar-button'
                        isPending={isRequestPending}
                        onClick={requestDOT}>
                        {t('request_dot')}
                      </ButtonMaybePending>
                    </Nav>
                    <Balances
                      balanceDOT={balanceDOT}
                      balancePolkaBTC={balancePolkaBTC} />
                    <Nav
                      id='account-button'
                      className='d-inline'>
                      <Button
                        variant='outline-account'
                        className='nav-bar-button'
                        onClick={() => dispatch(showAccountModalAction(true))}>
                        {getLabel()}
                      </Button>
                    </Nav>
                  </>
                )}
              </React.Fragment>
            )}
          </Navbar.Collapse>
        </React.Fragment>
      )}
    </Navbar>
  );
}
