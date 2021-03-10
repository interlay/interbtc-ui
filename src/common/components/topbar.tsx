import React, { ReactElement, useEffect, useState } from 'react';
import polkaBTCLogo from '../../assets/img/polkabtc/PolkaBTC_black.png';
import { Navbar, Nav, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType } from '../types/util.types';
import ButtonMaybePending from './pending-button';
import { planckToDOT } from '@interlay/polkabtc';
import { updateBalanceDOTAction, showAccountModalAction } from '../actions/general.actions';
import { shortAddress, updateBalances } from '../utils/utils';
import { useTranslation } from 'react-i18next';
import Balances from './balances';
import { PAGES } from 'utils/constants/links';
import newMark from '../../assets/img/icons/new-mark.png';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!polkaBtcLoaded) {
      setTimeout(() => setIsLoading(false), 2500);
      return;
    }
  }, [polkaBtcLoaded]);

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
      const accountId = window.polkaBTC.api.createType('AccountId', address);
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
      className='border-bottom shadow-sm top-bar'>
      {!isLoading && (
        <React.Fragment>
          <Navbar.Brand>
            <Link
              id='main-logo'
              className='text-decoration-none'
              to={PAGES.HOME}>
              <Image
                src={polkaBTCLogo}
                width='90'
                className='d-inline-block align-top'
                height='30'
                fluid />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              {polkaBtcLoaded && (
                <Link
                  className='nav-link'
                  to={PAGES.APPLICATION}>
                  {t('app')}
                </Link>
              )}
              {polkaBtcLoaded && (
                <Link
                  className='nav-link'
                  to={PAGES.DASHBOARD}>
                  {t('nav_dashboard')}
                </Link>
              )}
              {vaultClientLoaded && (
                <Link
                  id='vault-nav-item'
                  className='nav-link'
                  to={PAGES.VAULT}>
                  {t('nav_vault')}
                </Link>
              )}
              {relayerLoaded && (
                <Link
                  id='relayer-nav-item'
                  className='nav-link'
                  to={PAGES.STAKED_RELAYER}>
                  {t('nav_relayer')}
                </Link>
              )}
              {polkaBtcLoaded && (
                <Link
                  className='nav-link'
                  to={PAGES.CHALLENGES}>
                  {t('nav_challenges')}
                  <Image
                    src={newMark}
                    height='20em'>
                  </Image>
                </Link>
              )}
              <Link
                className='nav-link'
                to={PAGES.FEEDBACK}>
                {t('feedback.feedback')}
              </Link>
              <a
                className='nav-link'
                href='https://docs.polkabtc.io/#/'
                target='_blank'
                rel='noopener noreferrer'>
                {t('nav_docs')}
              </a>
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
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://testnet-faucet.mempool.co/'
                        style={{ textDecoration: 'none' }}>
                        <Button
                          variant='outline-bitcoin'
                          className='nav-bar-button'>
                          {t('request_btc')}
                        </Button>
                      </a>
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
