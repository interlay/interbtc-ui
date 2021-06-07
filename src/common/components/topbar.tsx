
import * as React from 'react';
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
import { web3Accounts } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AccountModal from 'parts/AccountModal';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import ButtonMaybePending from './pending-button';
import {
  updateBalanceDOTAction,
  showAccountModalAction
} from 'common/actions/general.actions';
import { updateBalances } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import Balances from './balances';
import {
  PAGES,
  QUERY_PARAMETERS
} from 'utils/constants/links';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import TAB_IDS from 'utils/constants/tab-ids';
import { ReactComponent as InterbtcLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';

const queryString = require('query-string');

type TopbarProps = {
  address?: string;
  requestDOT: () => Promise<void>;
}

const Topbar = (props: TopbarProps): JSX.Element => {
  const {
    extensions,
    address,
    interBtcLoaded,
    balanceDOT,
    balanceInterBTC,
    vaultClientLoaded,
    relayerLoaded,
    showAccountModal
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isRequestPending, setIsRequestPending] = React.useState(false);

  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  React.useEffect(() => {
    if (!extensions.length) return;

    (async () => {
      try {
        const theAccounts = await web3Accounts();
        setAccounts(theAccounts);
      } catch (error) {
        // TODO: should add error handling properly
        console.log('[Topbar] error.message => ', error.message);
      }
    })();
  }, [extensions.length]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!interBtcLoaded || address === '') return;

      updateBalances(dispatch, address, balanceDOT, balanceInterBTC);
    };
    fetchData();
  }, [address, interBtcLoaded, dispatch, balanceDOT, balanceInterBTC]);

  const requestDOT = async () => {
    if (!interBtcLoaded) return;
    setIsRequestPending(true);
    try {
      await props.requestDOT();
      const accountId = window.interBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const balanceDOT = await window.interBTC.collateral.balance(accountId);
      dispatch(updateBalanceDOTAction(balanceDOT.toString()));
    } catch (error) {
      console.log(error);
    }
    setIsRequestPending(false);
  };

  const handleAccountModalOpen = () => {
    dispatch(showAccountModalAction(true));
  };

  const handleAccountModalClose = () => {
    dispatch(showAccountModalAction(false));
  };

  let accountLabel;
  if (!extensions.length) {
    accountLabel = 'Connect Wallet';
  } else if (address) {
    // TODO: could memoize
    const matchedAccount = accounts.find(account => account.address === address);
    accountLabel = matchedAccount?.meta.name || address;
  } else {
    accountLabel = 'Select Account';
  }

  return (
    <>
      <Navbar
        id='pbtc-topbar'
        expand='lg'
        className={clsx(
          'top-bar',
          'border-bottom',
          'shadow',
          'bg-default'
        )}>
        {interBtcLoaded && (
          <React.Fragment>
            <Navbar.Brand>
              <InterlayRouterLink
                // TODO: hardcoded
                style={{
                  textDecoration: 'none'
                }}
                to={PAGES.home}>
                <InterbtcLogoIcon
                  fill='currentColor'
                  width={90}
                  height={53} />
              </InterlayRouterLink>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='mr-auto'>
                {interBtcLoaded && (
                  // TODO: should use https://reactrouter.com/web/api/NavLink with `activeClassName`
                  <InterlayRouterLink
                    style={{
                      textDecoration: 'none'
                    }}
                    className='nav-link'
                    to={{
                      pathname: PAGES.application,
                      search: queryString.stringify({
                        [QUERY_PARAMETERS.tab]: TAB_IDS.issue
                      })
                    }}>
                    {t('app')}
                  </InterlayRouterLink>
                )}
                {interBtcLoaded && (
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
                {interBtcLoaded && (
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
                  href='https://docs.interbtc.io/#/'
                  target='_blank'
                  rel='noopener noreferrer'>
                  {t('nav_docs')}
                </InterlayLink>
              </Nav>
              {props.address !== undefined && (
                <>
                  {address === '' ? (
                    <Nav
                      id='account-button'
                      className='d-inline'>
                      <Button
                        variant='outline-account-not-connected'
                        className='nav-bar-button'
                        onClick={handleAccountModalOpen}>
                        {accountLabel}
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
                        balanceInterBTC={balanceInterBTC} />
                      <Nav
                        id='account-button'
                        className='d-inline'>
                        <Button
                          variant='outline-account'
                          className='nav-bar-button'
                          onClick={handleAccountModalOpen}>
                          {accountLabel}
                        </Button>
                      </Nav>
                    </>
                  )}
                </>
              )}
            </Navbar.Collapse>
          </React.Fragment>
        )}
      </Navbar>
      <AccountModal
        open={showAccountModal}
        onClose={handleAccountModalClose} />
    </>
  );
};

export default Topbar;
