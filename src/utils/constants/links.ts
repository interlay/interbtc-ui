
const URL_PARAMETERS = Object.freeze({
  VAULT_ADDRESS: 'vaultAddress'
});

const PAGES = Object.freeze({
  HOME: '/',
  BRIDGE: '/bridge',
  TRANSFER: '/transfer',
  TRANSACTIONS: '/transactions',
  STAKING: '/staking',
  DASHBOARD: '/dashboard',
  DASHBOARD_VAULTS: '/dashboard/vaults',
  DASHBOARD_PARACHAIN: '/dashboard/parachain',
  DASHBOARD_ORACLES: '/dashboard/oracles',
  DASHBOARD_ISSUE_REQUESTS: '/dashboard/issue-requests',
  DASHBOARD_REDEEM_REQUESTS: '/dashboard/redeem-requests',
  DASHBOARD_RELAY: '/dashboard/relay',
  VAULT: `/vault/:${URL_PARAMETERS.VAULT_ADDRESS}`,
  FEEDBACK: '/feedback'
});

const QUERY_PARAMETERS = Object.freeze({
  TAB: 'tab',
  PAGE: 'page',
  ISSUE_REQUESTS_PAGE: 'issueRequestPage',
  REDEEM_REQUESTS_PAGE: 'redeemRequestPage',
  ISSUE_REQUEST_ID: 'issueRequestId',
  REDEEM_REQUEST_ID: 'redeemRequestId'
});

export {
  PAGES,
  QUERY_PARAMETERS,
  URL_PARAMETERS
};
