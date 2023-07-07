import { BANXA_LINK } from '@/config/links';
import { DOCS_LINK, SUBSCAN_LINK } from '@/config/relay-chains';

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
  BTC: '/bridge',
  STRATEGIES: '/strategies',
  TRANSFER: '/transfer',
  TX: '/tx',
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
  FEEDBACK: '/feedback',
  ACTIONS: '/actions',
  LOANS: '/lending',
  SWAP: '/swap',
  POOLS: '/pools',
  WALLET: '/wallet',
  ONBOARDING: '/onboarding'
});

const EXTERNAL_URL_PARAMETERS = Object.freeze({
  SUBSCAN: {
    BLOCK: {
      HASH: 'hash'
    },
    ACCOUNT: {
      ADDRESS: 'address'
    }
  }
});

const EXTERNAL_PAGES = Object.freeze({
  BANXA: `${BANXA_LINK}`,
  DOCS: {
    ASSETS: `${DOCS_LINK}/#/guides/assets`
  },
  SUBSCAN: {
    BLOCKS: `${SUBSCAN_LINK}/block`,
    BLOCK: `${SUBSCAN_LINK}/block/:${EXTERNAL_URL_PARAMETERS.SUBSCAN.BLOCK.HASH}`,
    EXTRINSIC: `${SUBSCAN_LINK}/extrinsic/:${EXTERNAL_URL_PARAMETERS.SUBSCAN.BLOCK.HASH}`,
    ACCOUNT: `${SUBSCAN_LINK}/account/:${EXTERNAL_URL_PARAMETERS.SUBSCAN.ACCOUNT.ADDRESS}`
  }
});

const QUERY_PARAMETERS = Object.freeze({
  TAB: 'tab',
  PAGE: 'page',
  ISSUE_REQUESTS_PAGE: 'issueRequestPage',
  REDEEM_REQUESTS_PAGE: 'redeemRequestPage',
  ISSUE_REQUEST_ID: 'issueRequestId',
  REDEEM_REQUEST_ID: 'redeemRequestId',
  SWAP: {
    FROM: 'from',
    TO: 'to'
  }
});

const EXTERNAL_QUERY_PARAMETERS = Object.freeze({
  BANXA: {
    WALLET_ADDRESS: 'walletAddress',
    FIAT_TYPE: 'fiatType',
    COIN_TYPE: 'coinType'
  },
  DOCS: {
    ASSET: {
      ID: 'id'
    }
  }
});

export { EXTERNAL_PAGES, EXTERNAL_QUERY_PARAMETERS, EXTERNAL_URL_PARAMETERS, PAGES, QUERY_PARAMETERS, URL_PARAMETERS };
