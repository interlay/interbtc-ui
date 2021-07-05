
import * as React from 'react';
import {
  Navbar,
  Nav
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
import InterlayCinnabarOutlinedButton from 'components/buttons/InterlayCinnabarOutlinedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import {
  updateBalanceDOTAction,
  showAccountModalAction
} from 'common/actions/general.actions';
import { updateBalances } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import Balances from './balances';
import { PAGES } from 'utils/constants/links';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { ReactComponent as PolkabtcLogoIcon } from 'assets/img/polkabtc-logo.svg';
import { ReactComponent as NewMarkIcon } from 'assets/img/icons/new-mark.svg';

type TopbarProps = {
  address?: string;
  requestDOT: () => Promise<void>;
}

const Topbar = (props: TopbarProps): JSX.Element => {
  const {
    extensions,
    address,
    polkaBtcLoaded,
    balanceDOT,
    balancePolkaBTC,
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

  const handleAccountModalOpen = () => {
    dispatch(showAccountModalAction(true));
  };

  const handleAccountModalClose = () => {
    dispatch(showAccountModalAction(false));
  };

  let accountLabel;
  if (!extensions.length) {
    accountLabel = t('connect_wallet');
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
        {polkaBtcLoaded && (
          <React.Fragment>
            <Navbar.Brand>
              <InterlayRouterLink
                to={PAGES.HOME}>
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
                    className='p-2'
                    to={PAGES.DASHBOARD}>
                    {t('nav_dashboard')}
                  </InterlayRouterLink>
                )}
                {vaultClientLoaded && (
                  <InterlayRouterLink
                    className='p-2'
                    to={PAGES.VAULT}>
                    {t('nav_vault')}
                  </InterlayRouterLink>
                )}
                {relayerLoaded && (
                  <InterlayRouterLink
                    className='p-2'
                    to={PAGES.STAKED_RELAYER}>
                    {t('nav_relayer')}
                  </InterlayRouterLink>
                )}
                {polkaBtcLoaded && (
                  <InterlayRouterLink
                    className='p-2'
                    to={PAGES.CHALLENGES}>
                    {t('nav_challenges')}
                    <NewMarkIcon
                      className='inline-block'
                      width={20}
                      height={20} />
                  </InterlayRouterLink>
                )}
                <InterlayRouterLink
                  className='p-2'
                  to={PAGES.FEEDBACK}>
                  {t('feedback.feedback')}
                </InterlayRouterLink>
                <InterlayLink
                  className='p-2'
                  href='https://docs.polkabtc.io/#/'
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
                      <InterlayDefaultContainedButton onClick={handleAccountModalOpen}>
                        {accountLabel}
                      </InterlayDefaultContainedButton>
                    </Nav>
                  ) : (
                    <>
                      <Nav className='d-inline'>
                        <InterlayLink
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://testnet-faucet.mempool.co/'
                          style={{ textDecoration: 'none' }}>
                          <InterlayCaliforniaOutlinedButton>
                            {t('request_btc')}
                          </InterlayCaliforniaOutlinedButton>
                        </InterlayLink>
                        <InterlayCinnabarOutlinedButton
                          style={{
                            marginLeft: 8
                          }}
                          pending={isRequestPending}
                          onClick={requestDOT}>
                          {t('request_dot')}
                        </InterlayCinnabarOutlinedButton>
                      </Nav>
                      <Balances
                        balanceDOT={balanceDOT}
                        balancePolkaBTC={balancePolkaBTC} />
                      <Nav
                        id='account-button'
                        className='d-inline'>
                        <InterlayDefaultContainedButton onClick={handleAccountModalOpen}>
                          {accountLabel}
                        </InterlayDefaultContainedButton>
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
