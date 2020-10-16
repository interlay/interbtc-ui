import { IssueRequest } from "./issue.types";
import { RedeemRequest } from "./redeem.types";

export enum CommonStorage {
    totalPolkaBTC = "TOTAL_POLKA_BTC",
    totalLockedDOT = "TOTAL_LOCKED_DOT",
    collateralization = "COLLATERALIZATION",
    feesEarned = "FEES_EARNED",
    userAddress = "POLKABTC_USER_ADDRESS",
}

export enum UserStorage {
    balancePolkaBTC = "BALANCE_POLKA_BTC",
    balanceDOT = "BALANCE_DOT",
    balanceLockedDOT = "BALANCE_LOCKED_DOT",
}

export interface StorageInterface {
    // common storage items
    getItemCommon(key: CommonStorage): string;

    setItemCommon(key: CommonStorage, value: string): void;

    // user specific storage items
    getItemUser(key: UserStorage): string;

    setItemUser(key: UserStorage, value: string): void;

    // load both issue and redeem requests
    loadRequests(): [Array<IssueRequest>, Array<RedeemRequest>];
}
