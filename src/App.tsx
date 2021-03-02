import React, {
  useState,
  ReactElement,
  useEffect,
  useCallback
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import {
  toast,
  ToastContainer
} from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import Big from 'big.js';
import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import {
  FaucetClient,
  planckToDOT,
  satToBTC
} from '@interlay/polkabtc';
import {
  createPolkabtcAPI,
  PolkaBTCAPI,
  StakedRelayerClient,
  VaultClient
} from '@interlay/polkabtc';
import {
  useSelector,
  useDispatch,
  useStore
} from 'react-redux';

import Layout from 'parts/Layout';
import AppPage from 'pages/app/app.page';
import DashboardPage from 'pages/dashboard/dashboard.page';
import VaultDashboardPage from 'pages/vault-dashboard/vault-dashboard.page';
import StakedRelayerPage from 'pages/staked-relayer/staked-relayer.page';
import LeaderboardPage from 'pages/leaderboard/leaderboard.page';
import VaultsDashboard from 'pages/dashboard/vaults/vaults.dashboard.page';
import IssueDashboard from 'pages/dashboard/issue/issue.dashboard.page';
import RedeemDashboard from 'pages/dashboard/redeem/redeem.dashboard.page';
import LandingPage from 'pages/landing/landing.page';
import RelayDashboard from 'pages/dashboard/relay/relay.dashboard.page';
import OraclesDashboard from 'pages/dashboard/oracles/oracles.dashboard.page';
import ParachainDashboard from 'pages/dashboard/parachain/parachain.dashboard.page';
import FeedbackPage from 'pages/feedback/feedback.page';
import AccountModal from 'common/components/account-modal/account-modal';
import Topbar from 'common/components/topbar';
import Footer from 'common/components/footer/footer';
import LazyLoadingErrorBoundary from 'utils/hocs/LazyLoadingErrorBoundary';
import checkStaticPage from 'config/check-static-page';
import {
  isPolkaBtcLoaded,
  isStakedRelayerLoaded,
  isVaultClientLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  showAccountModalAction,
  updateAccountsAction,
  isFaucetLoaded
} from 'common/actions/general.actions';
import './i18n';
import * as constants from './constants';
import startFetchingLiveData from 'common/live-data/live-data';
import { StoreType, ParachainStatus } from 'common/types/util.types';
// theme
// FIXME: Clean-up and move to scss
import './_general.scss';
import 'react-toastify/dist/ReactToastify.css';

function connectToParachain(): Promise<PolkaBTCAPI> {
  return createPolkabtcAPI(
    constants.PARACHAIN_URL,
    constants.BITCOIN_NETWORK === 'regtest' ? constants.BITCOIN_REGTEST_URL : constants.BITCOIN_NETWORK
  );
}

function App(): ReactElement {
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
  const address = useSelector((state: StoreType) => state.general.address);
  const [isLoading, setIsLoading] = useState(true);
  const extensions = useSelector((state: StoreType) => state.general.extensions);
  const dispatch = useDispatch();
  const store = useStore();

  const requestDotFromFaucet = async (): Promise<void> => {
    if (!address) return;

    try {
      const receiverId = window.polkaBTC.api.createType('AccountId', address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. You can only use the faucet once every 6 hours. ${error}`);
    }
  };

  const selectAccount = useCallback(
    async (newAddress: string): Promise<void> => {
      if (!polkaBtcLoaded || !newAddress) {
        return;
      }

      await web3Enable(constants.APP_NAME);
      const { signer } = await web3FromAddress(newAddress);
      window.polkaBTC.setAccount(newAddress, signer);

      dispatch(showAccountModalAction(false));
      dispatch(changeAddressAction(newAddress));
    },
    [polkaBtcLoaded, dispatch]
  );

  const createAPIInstance = useCallback(async (): Promise<void> => {
    try {
      window.relayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
      dispatch(isStakedRelayerLoaded(true));

      window.vaultClient = new VaultClient(constants.VAULT_CLIENT_URL);
      dispatch(isVaultClientLoaded(true));

      window.faucet = new FaucetClient(constants.FAUCET_URL);
      dispatch(isFaucetLoaded(true));

      // TODO: could be a race condition
      setTimeout(() => {
        if (!window.polkaBTC) {
          toast.warn(
            'Unable to connect to the BTC-Parachain. ' +
            'Please check your internet connection or try again later.'
          );
        }
      }, 10000);
      window.polkaBTC = await connectToParachain();
      dispatch(isPolkaBtcLoaded(true));

      startFetchingLiveData(dispatch, store);
      setIsLoading(false);
    } catch (error) {
      if (!window.polkaBTC) {
        toast.warn(
          'Unable to connect to the BTC-Parachain. ' +
          'Please check your internet connection or try again later.'
        );
      }
    }
  }, [
    dispatch,
    store
  ]);

  useEffect((): void => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;

    const initDataOnAppBootstrap = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const [totalPolkaSAT, totalLockedPLANCK, btcRelayHeight, bitcoinHeight, state] = await Promise.all([
          window.polkaBTC.treasury.totalPolkaBTC(),
          window.polkaBTC.collateral.totalLockedDOT(),
          window.polkaBTC.btcRelay.getLatestBlockHeight(),
          window.polkaBTC.btcCore.getLatestBlockHeight(),
          window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain()
        ]);
        const totalPolkaBTC = new Big(satToBTC(totalPolkaSAT.toString())).round(3).toString();
        const totalLockedDOT = new Big(planckToDOT(totalLockedPLANCK.toString())).round(3).toString();
        dispatch(
          initGeneralDataAction(
            totalPolkaBTC,
            totalLockedDOT,
            Number(btcRelayHeight),
            bitcoinHeight,
            state.isError ?
              ParachainStatus.Error :
              state.isRunning ?
                ParachainStatus.Running :
                ParachainStatus.Shutdown
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    initDataOnAppBootstrap();
  }, [dispatch, polkaBtcLoaded]);

  useEffect((): void => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;

    const loadAccountData = async () => {
      if (!polkaBtcLoaded || extensions.length) return false;

      const browserExtensions = await web3Enable(constants.APP_NAME);
      dispatch(setInstalledExtensionAction(browserExtensions.map(ext => ext.name)));

      const allAccounts = await web3Accounts();
      if (allAccounts.length === 0) {
        dispatch(changeAddressAction(''));
        return false;
      }

      const accounts = allAccounts.map(({ address }) => address);
      dispatch(updateAccountsAction(accounts));

      let newAddress: string | undefined = undefined;
      if (accounts.includes(address)) {
        newAddress = address;
      } else if (accounts.length === 1) {
        newAddress = accounts[0];
      }

      if (newAddress) {
        const { signer } = await web3FromAddress(newAddress);
        window.polkaBTC.setAccount(newAddress, signer);
        dispatch(changeAddressAction(newAddress));
      } else dispatch(changeAddressAction(''));

      return true;
    };

    const id = setTimeout(async () => {
      const accountsLoaded = await loadAccountData();
      if (accountsLoaded) {
        clearInterval(id);
      }
    }, 1000);
  }, [address, polkaBtcLoaded, dispatch, extensions.length]);

  useEffect(() => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;

    const loadData = async () => {
      try {
        if (polkaBtcLoaded) return;

        setTimeout(() => {
          if (isLoading) setIsLoading(false);
        }, 3000);
        await createAPIInstance();
        keyring.loadAll({});
      } catch (e) {
        toast.warn('Could not connect to the Parachain, please try again in a few seconds', {
          autoClose: false
        });
      }
    };
    loadData();
    startFetchingLiveData(dispatch, store);
  }, [createAPIInstance, isLoading, polkaBtcLoaded, dispatch, store]);

  return (
    <Router>
      <Layout>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false} />
        <ReactTooltip
          place='top'
          type='dark'
          effect='solid' />
        <AccountModal
          selected={address}
          onSelected={selectAccount} />
        {/* TODO: should move into `Layout` */}
        {!checkStaticPage() && (
          <Topbar
            address={address}
            requestDOT={requestDotFromFaucet} />
        )}
        <LazyLoadingErrorBoundary>
          <Switch>
            {!checkStaticPage() && (
              <Route path='/staked-relayer'>
                <StakedRelayerPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard/vaults'>
                <VaultsDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/leaderboard'>
                <LeaderboardPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard/parachain'>
                <ParachainDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard/oracles'>
                <OraclesDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard/issue'>
                <IssueDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard/redeem'>
                <RedeemDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard/relay'>
                <RelayDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/dashboard'>
                <DashboardPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/vault'>
                <VaultDashboardPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path='/feedback'>
                <FeedbackPage />
              </Route>
            )}
            <Route
              path='/'
              exact>
              <LandingPage />
            </Route>
            {!checkStaticPage() && (
              <Route
                exact
                path='/app'>
                <AppPage />
              </Route>
            )}
          </Switch>
        </LazyLoadingErrorBoundary>
        <Footer />
      </Layout>
    </Router>
  );
}

export default App;
