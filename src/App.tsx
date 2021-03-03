
import React, {
  useState,
  ReactElement,
  useEffect,
  useCallback
} from 'react';
import {
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
import AccountModal from 'common/components/account-modal/account-modal';
import LazyLoadingErrorBoundary from 'utils/hocs/LazyLoadingErrorBoundary';
import checkStaticPage from 'config/check-static-page';
import { PAGES } from 'utils/constants/links';
import {
  isPolkaBtcLoaded,
  isStakedRelayerLoaded,
  isVaultClientLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  showAccountModalAction,
  updateAddressesAction,
  isFaucetLoaded
} from 'common/actions/general.actions';
import './i18n';
import * as constants from './constants';
import startFetchingLiveData from 'common/live-data/live-data';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
// theme
// FIXME: Clean-up and move to scss
import './_general.scss';
import 'react-toastify/dist/ReactToastify.css';

const ApplicationPage = React.lazy(() =>
  import(/* webpackChunkName: 'application' */ 'pages/app/app.page')
);

const DashboardPage = React.lazy(() =>
  import(/* webpackChunkName: 'dashboard' */ 'pages/dashboard/dashboard.page')
);

const VaultDashboardPage = React.lazy(() =>
  import(/* webpackChunkName: 'vault' */ 'pages/vault-dashboard/vault-dashboard.page')
);

const StakedRelayerPage = React.lazy(() =>
  import(/* webpackChunkName: 'staked-relayer' */ 'pages/staked-relayer/staked-relayer.page')
);

const LeaderboardPage = React.lazy(() =>
  import(/* webpackChunkName: 'leaderboard' */ 'pages/leaderboard/leaderboard.page')
);

const VaultsDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'vaults' */ 'pages/dashboard/vaults/vaults.dashboard.page')
);

const IssueDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'issue' */ 'pages/dashboard/issue/issue.dashboard.page')
);

const RedeemDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'redeem' */ 'pages/dashboard/redeem/redeem.dashboard.page')
);

const LandingPage = React.lazy(() =>
  import(/* webpackChunkName: 'landing' */ 'pages/landing/landing.page')
);

const RelayDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'relay' */ 'pages/dashboard/relay/relay.dashboard.page')
);

const OraclesDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'oracles' */ 'pages/dashboard/oracles/oracles.dashboard.page')
);

const ParachainDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'parachain' */ 'pages/dashboard/parachain/parachain.dashboard.page')
);

const FeedbackPage = React.lazy(() =>
  import(/* webpackChunkName: 'feedback' */ 'pages/feedback/feedback.page')
);

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
    [
      polkaBtcLoaded,
      dispatch
    ]
  );

  const createAPIInstance = useCallback(async (): Promise<void> => {
    try {
      window.relayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
      dispatch(isStakedRelayerLoaded(true));

      window.vaultClient = new VaultClient(constants.VAULT_CLIENT_URL);
      dispatch(isVaultClientLoaded(true));

      window.faucet = new FaucetClient(constants.FAUCET_URL);
      dispatch(isFaucetLoaded(true));

      // TODO: should avoid any race condition
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

  useEffect(() => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;
    if (!polkaBtcLoaded) return;

    // Initialize data on app bootstrap
    (async () => {
      try {
        const [
          totalPolkaSAT,
          totalLockedPLANCK,
          btcRelayHeight,
          bitcoinHeight,
          state
        ] = await Promise.all([
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
        // TODO: should have error handling instead of console
        console.log(error);
      }
    })();
  }, [
    dispatch,
    polkaBtcLoaded
  ]);

  useEffect(() => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;

    const loadAccountData = async () => {
      if (!polkaBtcLoaded || extensions.length) return false;

      const browserExtensions = await web3Enable(constants.APP_NAME);
      dispatch(setInstalledExtensionAction(browserExtensions.map(ext => ext.name)));

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        dispatch(changeAddressAction(''));
        return false;
      }

      const addresses = accounts.map(({ address }) => address);
      dispatch(updateAddressesAction(addresses));

      let newAddress: string | undefined = undefined;
      if (addresses.includes(address)) {
        newAddress = address;
      } else if (addresses.length === 1) {
        newAddress = addresses[0];
      }

      if (newAddress) {
        const { signer } = await web3FromAddress(newAddress);
        window.polkaBTC.setAccount(newAddress, signer);
        dispatch(changeAddressAction(newAddress));
      } else {
        dispatch(changeAddressAction(''));
      }

      return true;
    };

    const id = setTimeout(async () => {
      const accountsLoaded = await loadAccountData();
      if (accountsLoaded) {
        clearInterval(id);
      }
    }, 1000);
  }, [
    address,
    polkaBtcLoaded,
    dispatch,
    extensions.length
  ]);

  useEffect(() => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;
    if (polkaBtcLoaded) return;

    (async () => {
      try {
        // TODO: should avoid any race condition
        setTimeout(() => {
          if (isLoading) setIsLoading(false);
        }, 3000);
        await createAPIInstance();
        keyring.loadAll({});
      } catch (error) {
        toast.warn('Could not connect to the Parachain, please try again in a few seconds', {
          autoClose: false
        });
      }
    })();
    startFetchingLiveData(dispatch, store);
  }, [
    createAPIInstance,
    isLoading,
    polkaBtcLoaded,
    dispatch,
    store
  ]);

  return (
    <Layout>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false} />
      <ReactTooltip
        place='top'
        type='dark'
        effect='solid' />
      {/* TODO: should move into `Topbar` */}
      <AccountModal
        selectedAccount={address}
        selectAccount={selectAccount} />
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyLoadingErrorBoundary>
          <Switch>
            {!checkStaticPage() && (
              <Route path={PAGES.STAKED_RELAYER}>
                <StakedRelayerPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.VAULTS}>
                <VaultsDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.LEADERBOARD}>
                <LeaderboardPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.PARACHAIN}>
                <ParachainDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.ORACLES}>
                <OraclesDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.ISSUE}>
                <IssueDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.REDEEM}>
                <RedeemDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.RELAY}>
                <RelayDashboard />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.DASHBOARD}>
                <DashboardPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.VAULT}>
                <VaultDashboardPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route path={PAGES.FEEDBACK}>
                <FeedbackPage />
              </Route>
            )}
            {!checkStaticPage() && (
              <Route
                exact
                path={PAGES.APPLICATION}>
                <ApplicationPage />
              </Route>
            )}
            <Route
              path={PAGES.HOME}
              exact>
              <LandingPage />
            </Route>
          </Switch>
        </LazyLoadingErrorBoundary>
      </React.Suspense>
    </Layout>
  );
}

export default App;
