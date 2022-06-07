const URL_PARAMETERS = Object.freeze({
  VAULT: {
    ACCOUNT: 'vaultAccount',
    COLLATERAL: 'vaultCollateral',
    WRAPPED: 'vaultWrapped'
  },
  TRANSACTION_HASH: 'transactionHash'
});

const PAGES = Object.freeze({
  HOME: '/',
  BRIDGE: '/bridge',
  TRANSFER: '/transfer',
  TRANSACTIONS: '/transactions',
  TRANSACTION: '/transaction',
  STAKING: '/staking',
  DASHBOARD: '/dashboard',
  DASHBOARD_VAULTS: '/dashboard/vaults',
  DASHBOARD_PARACHAIN: '/dashboard/parachain',
  DASHBOARD_ORACLES: '/dashboard/oracles',
  DASHBOARD_ISSUE_REQUESTS: '/dashboard/issue-requests',
  DASHBOARD_REDEEM_REQUESTS: '/dashboard/redeem-requests',
  DASHBOARD_RELAY: '/dashboard/relay',
  VAULTS: `/vaults/:${URL_PARAMETERS.VAULT.ACCOUNT}`,
  // eslint-disable-next-line max-len
  VAULT: `/vaults/:${URL_PARAMETERS.VAULT.ACCOUNT}/:${URL_PARAMETERS.VAULT.COLLATERAL}/:${URL_PARAMETERS.VAULT.WRAPPED}`,
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

export { PAGES, QUERY_PARAMETERS, URL_PARAMETERS };
