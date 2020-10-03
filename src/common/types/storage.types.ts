import { IssueRequest } from "./issue.types";
import { RedeemRequest } from "./redeem.types";

export enum CommonStorage {
    totalPolkaBTC = "TOTAL_POLKA_BTC",
    totalLockedDOT = "TOTAL_LOCKED_DOT",
    collateralization = "COLLATERALIZATION",
    feesEarned = "FEES_EARNED",
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

    // get the current issue requests
    getIssueRequests(): Array<IssueRequest>;

    // get the current redeem requests
    getRedeemRequests(): Array<RedeemRequest>;

    // append a new issue request
    appendIssueRequest(req: IssueRequest): void;

    // append a new redeem request
    appendRedeemRequest(req: RedeemRequest): void;

    // modify an issue request
    modifyIssueRequest(req: IssueRequest): void;

    // modify a redeem request
    modifyRedeemRequest(req: RedeemRequest): void;

    // delete a issue request
    deleteIssueRequest(id: string): void;

    // delete a redeem request
    deleteRedeemRequest(id: string): void;

    // clear storage
    clearStorage(): void;
}
