import React, {
  ReactElement,
  useEffect,
  useState
} from 'react';
import {
  Navbar,
  Nav,
  Button
} from 'react-bootstrap';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import InterlayLink from 'components/UI/InterlayLink';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import ButtonMaybePending from './pending-button';
import { updateBalanceDOTAction, showAccountModalAction } from 'common/actions/general.actions';
import { shortAddress, updateBalances } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import Balances from './balances';
import {
  PAGES,
  QUERY_PARAMETERS
} from 'utils/constants/links';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';
import TAB_TYPES from 'utils/constants/tab-types';
import { ReactComponent as PolkabtcLogoIcon } from 'assets/img/polkabtc/polkabtc-logo.svg';
import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';

const queryString = require('query-string');

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
      const balanceDOT = await window.polkaBTC.collateral.balance(accountId);
      dispatch(updateBalanceDOTAction(balanceDOT.toString()));
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
      expand='lg'
      className={clsx(
        'top-bar',
        'border-bottom',
        'shadow',
        'bg-default'
      )}>
      {polkaBtcLoaded && (
        <React.Fragment>
          <Navbar.Brand>
            <InterlayRouterLink
              // TODO: hardcoded
              style={{
                textDecoration: 'none'
              }}
              to={PAGES.home}>
              <PolkabtcLogoIcon
                fill='currentColor'
                width={90}
                height={53} />
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
                  to={{
                    pathname: PAGES.application,
                    search: queryString.stringify({
                      [QUERY_PARAMETERS.type]: TAB_TYPES.issue
                    })
                  }}>
                  {t('app')}
                </InterlayRouterLink>
              )}
              {polkaBtcLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.dashboard}>
                  {t('nav_dashboard')}
                </InterlayRouterLink>
              )}
              {vaultClientLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.vault}>
                  {t('nav_vault')}
                </InterlayRouterLink>
              )}
              {relayerLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.stakedRelayer}>
                  {t('nav_relayer')}
                </InterlayRouterLink>
              )}
              {polkaBtcLoaded && (
                <InterlayRouterLink
                  style={{
                    textDecoration: 'none'
                  }}
                  className='nav-link'
                  to={PAGES.challenges}>
                  {t('nav_challenges')}
                  <NewMarkIcon
                    className='inline-block'
                    width={20}
                    height={20} />
                </InterlayRouterLink>
              )}
              <InterlayRouterLink
                style={{
                  textDecoration: 'none'
                }}
                className='nav-link'
                to={PAGES.feedback}>
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
