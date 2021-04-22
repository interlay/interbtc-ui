
const PAGES = Object.freeze({
  home: '/',
  stakedRelayer: '/staked-relayer',
  challenges: '/challenges',
  vaults: '/dashboard/vaults',
  parachain: '/dashboard/parachain',
  oracles: '/dashboard/oracles',
  issue: '/dashboard/issue-requests',
  redeem: '/dashboard/redeem-requests',
  relay: '/dashboard/relay',
  dashboard: '/dashboard',
  vault: '/vault',
  feedback: '/feedback',
  application: '/application'
});

const QUERY_PARAMETERS = Object.freeze({
  type: 'type',
  page: 'page'
});

export {
  PAGES,
  QUERY_PARAMETERS
};
