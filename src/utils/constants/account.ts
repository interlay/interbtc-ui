import { MonetaryAmount } from '@interlay/monetary-js';

import { APP_NAME, GOVERNANCE_TOKEN } from '@/config/relay-chains';

const SELECTED_ACCOUNT_LOCAL_STORAGE_KEY = `${APP_NAME}-selected-account`;

const DEFAULT_PROXY_ACCOUNT_AMOUNT = 10;

const PROXY_ACCOUNT_RESERVE_AMOUNT = new MonetaryAmount(GOVERNANCE_TOKEN, 26);

export { DEFAULT_PROXY_ACCOUNT_AMOUNT, PROXY_ACCOUNT_RESERVE_AMOUNT, SELECTED_ACCOUNT_LOCAL_STORAGE_KEY };
