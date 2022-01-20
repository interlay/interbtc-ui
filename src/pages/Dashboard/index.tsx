
import * as React from 'react';
import {
  useRouteMatch,
  Switch,
  Route
} from 'react-router-dom';

import MainContainer from 'parts/MainContainer';
import { PAGES } from 'utils/constants/links';

const Home = React.lazy(() =>
  import(/* webpackChunkName: 'home' */ './sub-pages/Home')
);
const Vaults = React.lazy(() =>
  import(/* webpackChunkName: 'vaults' */ './sub-pages/Vaults')
);
const Vault = React.lazy(() =>
  import(/* webpackChunkName: 'vault' */ './sub-pages/Vault')
);
const Parachain = React.lazy(() =>
  import(/* webpackChunkName: 'parachain' */ './sub-pages/Parachain')
);
const Oracles = React.lazy(() =>
  import(/* webpackChunkName: 'oracles' */ './sub-pages/Oracles')
);
const IssueRequests = React.lazy(() =>
  import(/* webpackChunkName: 'issue-requests' */ './sub-pages/IssueRequests')
);
const RedeemRequests = React.lazy(() =>
  import(/* webpackChunkName: 'redeem-requests' */ './sub-pages/RedeemRequests')
);
const BTCRelay = React.lazy(() =>
  import(/* webpackChunkName: 'btc-relay' */ './sub-pages/BTCRelay')
);

const Dashboard = (): JSX.Element => {
  const match = useRouteMatch();

  return (
    <MainContainer className='fade-in-animation'>
      <Switch>
        <Route path={PAGES.DASHBOARD_VAULTS}>
          <Vaults />
        </Route>
        <Route path={PAGES.DASHBOARD_VAULT}>
          <Vault />
        </Route>
        <Route path={PAGES.DASHBOARD_PARACHAIN}>
          <Parachain />
        </Route>
        <Route path={PAGES.DASHBOARD_ORACLES}>
          <Oracles />
        </Route>
        <Route path={PAGES.DASHBOARD_ISSUE_REQUESTS}>
          <IssueRequests />
        </Route>
        <Route path={PAGES.DASHBOARD_REDEEM_REQUESTS}>
          <RedeemRequests />
        </Route>
        <Route path={PAGES.DASHBOARD_RELAY}>
          <BTCRelay />
        </Route>
        <Route path={match.path}>
          <Home />
        </Route>
      </Switch>
    </MainContainer>
  );
};

export default Dashboard;
