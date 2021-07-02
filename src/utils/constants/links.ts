
const PAGES = Object.freeze({
  HOME: '/',
  STAKED_RELAYER: '/staked-relayer',
  CHALLENGES: '/challenges',
  DASHBOARD_VAULTS: '/dashboard/vaults',
  DASHBOARD_PARACHAIN: '/dashboard/parachain',
  DASHBOARD_ORACLES: '/dashboard/oracles',
  DASHBOARD_ISSUE_REQUESTS: '/dashboard/issue-requests',
  DASHBOARD_REDEEM_REQUESTS: '/dashboard/redeem-requests',
  DASHBOARD_RELAY: '/dashboard/relay',
  DASHBOARD: '/dashboard',
  VAULT: '/vault',
  FEEDBACK: '/feedback'
});

const QUERY_PARAMETERS = Object.freeze({
  tab: 'tab',
  page: 'page'
});

export {
  PAGES,
  QUERY_PARAMETERS
};
