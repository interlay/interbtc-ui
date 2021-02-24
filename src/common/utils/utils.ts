import { RedeemRequest, RedeemRequestStatus, VaultRedeem } from "../types/redeem.types";
import { IssueRequest, IssueRequestStatus, VaultIssue } from "../types/issue.types";
import { DOT, PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import { VaultReplaceRequest } from "../types/vault.types";
import { H256, BlockNumber } from "@polkadot/types/interfaces";
import {
    satToBTC,
    planckToDOT,
    uint8ArrayToString,
    bitcoin,
    stripHexPrefix,
    reverseEndianness,
    IssueRequestExt as ParachainIssueRequest,
    RedeemRequestExt as ParachainRedeemRequest,
    ReplaceRequestExt as ParachainReplaceRequest,
    roundTwoDecimals,
} from "@interlay/polkabtc";
import { NUMERIC_STRING_REGEX, BITCOIN_NETWORK } from "../../constants";
import { Dispatch } from "redux";
import { updateBalanceDOTAction, updateBalancePolkaBTCAction } from "../actions/general.actions";
import Big from "big.js";
import { TableDisplayParams, RelayedBlock } from "../types/util.types";
import { Issue, Redeem } from "@interlay/polkabtc-stats";

export function safeRoundTwoDecimals(input: string | undefined, defaultValue = "0"): string {
    if (input === undefined) return defaultValue;
    else return roundTwoDecimals(input);
}

export function shortAddress(address: string): string {
    if (address.length < 12) return address;
    return address.substr(0, 6) + "..." + address.substr(address.length - 7, address.length - 1);
}

export function shortTxId(txid: string): string {
    if (txid.length < 20) return txid;
    return txid.substr(0, 10) + "..." + txid.substr(txid.length - 11, txid.length - 1);
}

export function formatDateTime(date: Date): string {
    return date.toDateString().substring(4) + " " + date.toTimeString().substring(0, 5);
}

export function formatDateTimePrecise(date: Date): string {
    return date.toDateString().substring(4) + " " + date.toTimeString().substring(0, 8);
}

export function calculateAmount(amount: string, currencyPrice: number): string {
    return new Big(amount).mul(new Big(currencyPrice)).toString();
}

/**
 * Converts an IssueRequest object retrieved from the parachain
 * to a UI IssueRequest object
 *
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 * @param parachainHeight parachainHeight data (queried from the parachain)
 * @param issuePeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 */
export async function parachainToUIIssueRequest(
    id: H256,
    parachainIssueRequest: ParachainIssueRequest,
    parachainHeight: BlockNumber,
    issuePeriod: BlockNumber,
    requiredBtcConfirmations: number
): Promise<IssueRequest> {
    const amountBTC = satToBTC(parachainIssueRequest.amount.toString());
    const fee = satToBTC(parachainIssueRequest.fee.toString());
    const status = computeIssueRequestStatus(
        parachainIssueRequest.completed.isTrue,
        parachainIssueRequest.cancelled.isTrue,
        parachainIssueRequest.opentime,
        parachainHeight,
        issuePeriod,
        requiredBtcConfirmations
    );
    return {
        id: stripHexPrefix(id.toString()),
        amountPolkaBTC: amountBTC,
        timestamp: "0000-00-00",
        creation: parachainIssueRequest.opentime.toString(),
        vaultBTCAddress: parachainIssueRequest.btc_address,
        vaultDOTAddress: parachainIssueRequest.vault.toString(),
        btcTxId: "",
        fee,
        totalAmount: new Big(amountBTC).add(fee).toString(),
        griefingCollateral: parachainIssueRequest.griefing_collateral.toString(),
        confirmations: 0,
        status,
    };
}

export const statsToUIIssueRequest = (
    statsIssue: Issue,
    currentBTCHeight: number,
    parachainHeight: BlockNumber,
    issuePeriod: BlockNumber,
    requiredBtcConfirmations: number
): IssueRequest => ({
    id: statsIssue.id,
    amountPolkaBTC: new Big(statsIssue.amountBTC).sub(new Big(statsIssue.feePolkabtc)).toString(),
    timestamp: statsIssue.timestamp,
    totalAmount: statsIssue.amountBTC,
    creation: statsIssue.creation,
    vaultBTCAddress: statsIssue.vaultBTCAddress,
    vaultDOTAddress: statsIssue.vaultDOTAddress,
    btcTxId: statsIssue.btcTxId,
    confirmations:
        statsIssue.confirmations !== undefined
            ? statsIssue.confirmations
            : statsIssue.btcBlockHeight
            ? currentBTCHeight - statsIssue.btcBlockHeight
            : 0,
    transactionBlockHeight: statsIssue.btcBlockHeight,
    status: computeIssueRequestStatus(
        statsIssue.completed,
        statsIssue.cancelled,
        window.polkaBTC.api.createType("BlockNumber", statsIssue.creation),
        parachainHeight,
        issuePeriod,
        requiredBtcConfirmations,
        statsIssue.btcTxId,
        statsIssue.confirmations
    ),
    fee: statsIssue.feePolkabtc,
    griefingCollateral: statsIssue.griefingCollateral,
});

/**
 * Given parameters about an issue request, computes its status
 *
 * @param completed boolean
 * @param cancelled boolean
 * @param creationBlock The number of the block where this request was included
 * @param issuePeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 * @param btcTxId (optional) Bitcoin transaction ID corresponding to this request
 * @param confirmations (optional) Confirmations of the given `btcTxId`
 */
export function computeIssueRequestStatus(
    completed: boolean,
    cancelled: boolean,
    creationBlock: BlockNumber,
    parachainHeight: BlockNumber,
    issuePeriod: BlockNumber,
    requiredBtcConfirmations: number,
    btcTxId = "",
    confirmations = 0
): IssueRequestStatus {
    if (completed) {
        return IssueRequestStatus.Completed;
    }
    if (cancelled) {
        return IssueRequestStatus.Cancelled;
    }
    if (creationBlock.add(issuePeriod).lte(parachainHeight)) {
        return IssueRequestStatus.Expired;
    }

    if (btcTxId === "") {
        return IssueRequestStatus.PendingWithBtcTxNotFound;
    }
    if (confirmations === 0) {
        return IssueRequestStatus.PendingWithBtcTxNotIncluded;
    }
    if (confirmations < requiredBtcConfirmations) {
        return IssueRequestStatus.PendingWithTooFewConfirmations;
    }

    return IssueRequestStatus.PendingWithEnoughConfirmations;
}

/**
 * Converts an IssueRequest object retrieved from the parachain
 * to a UI IssueRequest object
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 * @param parachainHeight parachainHeight data (queried from the parachain)
 * @param redeemPeriod redeemPeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)

 */
export async function parachainToUIRedeemRequest(
    id: H256,
    parachainRedeemRequest: ParachainRedeemRequest,
    parachainHeight: BlockNumber,
    redeemPeriod: BlockNumber,
    requiredBtcConfirmations: number
): Promise<RedeemRequest> {
    const amountPolkaBTC = satToBTC(parachainRedeemRequest.amount_polka_btc.toString());
    const fee = satToBTC(parachainRedeemRequest.fee.toString());
    const status = computeRedeemRequestStatus(
        parachainRedeemRequest.completed.isTrue,
        parachainRedeemRequest.cancelled.isTrue,
        parachainRedeemRequest.reimburse.isTrue,
        parachainRedeemRequest.opentime,
        parachainHeight,
        redeemPeriod,
        requiredBtcConfirmations
    );
    return {
        id: stripHexPrefix(id.toString()),
        amountPolkaBTC,
        timestamp: "0000-00-00",
        creation: parachainRedeemRequest.opentime.toString(),
        btcAddress: parachainRedeemRequest.btc_address,
        vaultDotAddress: parachainRedeemRequest.vault.toString(),
        btcTxId: "",
        fee,
        totalAmount: new Big(amountPolkaBTC).sub(new Big(fee)).toString(),
        confirmations: 0,
        status,
    };
}

export const statsToUIRedeemRequest = (
    statsRedeem: Redeem,
    currentBTCHeight: number,
    parachainHeight: BlockNumber,
    redeemPeriod: BlockNumber,
    requiredBtcConfirmations: number
): RedeemRequest => ({
    id: statsRedeem.id,
    amountPolkaBTC: statsRedeem.amountPolkaBTC,
    timestamp: statsRedeem.timestamp,
    creation: statsRedeem.creation,
    fee: statsRedeem.feePolkabtc,
    btcAddress: statsRedeem.btcAddress,
    vaultDotAddress: statsRedeem.vaultDotAddress,
    btcTxId: statsRedeem.btcTxId,
    totalAmount: new Big(statsRedeem.amountPolkaBTC).add(new Big(statsRedeem.feePolkabtc)).toString(),
    confirmations:
        statsRedeem.confirmations !== undefined
            ? statsRedeem.confirmations
            : statsRedeem.btcBlockHeight
            ? currentBTCHeight - statsRedeem.btcBlockHeight
            : 0,
    status: computeRedeemRequestStatus(
        statsRedeem.completed,
        statsRedeem.cancelled,
        statsRedeem.reimbursed,
        window.polkaBTC.api.createType("BlockNumber", statsRedeem.creation),
        parachainHeight,
        redeemPeriod,
        requiredBtcConfirmations,
        statsRedeem.btcTxId,
        statsRedeem.confirmations
    ),
});

/**
 * Given parameters about a redeem request, computes its status
 *
 * @param completed boolean
 * @param cancelled boolean
 * @param reimbursed boolean
 * @param creationBlock The number of the block where this request was included
 * @param parachainHeight Height of the parachain (number of blocks)
 * @param redeemPeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 * @param btcTxId (optional) Bitcoin transaction ID corresponding to this request
 * @param confirmations (optional) Confirmations of the given `btcTxId` */
export function computeRedeemRequestStatus(
    completed: boolean,
    cancelled: boolean,
    reimbursed: boolean,
    creationBlock: BlockNumber,
    parachainHeight: BlockNumber,
    redeemPeriod: BlockNumber,
    requiredBtcConfirmations: number,
    btcTxId = "",
    confirmations = 0
): RedeemRequestStatus {
    if (completed) {
        return RedeemRequestStatus.Completed;
    }
    if (reimbursed) {
        return RedeemRequestStatus.Reimbursed;
    }
    if (cancelled && !reimbursed) {
        return RedeemRequestStatus.Retried;
    }
    if (creationBlock.add(redeemPeriod).lte(parachainHeight)) {
        return RedeemRequestStatus.Expired;
    }
    if (btcTxId === "") {
        return RedeemRequestStatus.PendingWithBtcTxNotFound;
    }
    if (confirmations === 0) {
        return RedeemRequestStatus.PendingWithBtcTxNotIncluded;
    }
    if (confirmations < requiredBtcConfirmations) {
        return RedeemRequestStatus.PendingWithTooFewConfirmations;
    }

    return RedeemRequestStatus.PendingWithEnoughConfirmations;
}

/**
 * Checks whether string represents an integer or a floating point number
 * @remarks String of the form ".23" are not considered numeric. Use "0.23" instead.
 * @param s Arbitrary string
 * @returns True if string is numeric, false otherwise.
 */
export function isPositiveNumeric(s: string): boolean {
    const reg = new RegExp(NUMERIC_STRING_REGEX);
    return reg.test(s);
}

export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, k) => k + start);
}

export const arrayToMap = (
    arr: IssueRequest[][] | RedeemRequest[][]
): Map<string, IssueRequest[] | RedeemRequest[]> => {
    const map = new Map();
    for (const key in arr) {
        map.set(key, arr[key]);
    }
    return map;
};

interface DynamicObject {
    [key: string]: IssueRequest[] | RedeemRequest[];
}

export const mapToArray = (map: Map<string, IssueRequest[] | RedeemRequest[]>): DynamicObject => {
    const result: DynamicObject = {};
    map.forEach((value, key) => {
        result[key] = value;
    });
    return result;
};

interface ParsableParachainTypes {
    btc_address: string;
    amount_polka_btc?: PolkaBTC;
    amount?: PolkaBTC;
    amount_dot?: DOT;
    griefing_collateral?: DOT;
    premium_dot?: DOT;
}

export const BtcNetwork =
    BITCOIN_NETWORK === "mainnet"
        ? bitcoin.networks.bitcoin
        : BITCOIN_NETWORK === "testnet"
        ? bitcoin.networks.testnet
        : bitcoin.networks.regtest;

export function reverseHashEndianness(hash: Uint8Array): string {
    return uint8ArrayToString(reverseEndianness(hash));
}

export function defaultBlockData(): RelayedBlock {
    return {
        height: "0",
        hash: "",
        relay_ts: "0",
    };
}

export function defaultTableDisplayParams<Column>(): TableDisplayParams<Column> {
    return {
        page: 0,
        perPage: 20,
    };
}

/**
 * Parses types which belong to request objects and need parsing/conversion to be displayed in the UI.
 *
 * @param parachainObject A request object, which must have a BTC address, a PolkaBTC amount and a DOT amount.
 * @returns A tuple with the parsed properties
 */
function convertParachainTypes(parachainObject: ParsableParachainTypes): [string, string, string] {
    let parsedPolkaBTC = "";
    let parsedDOT = "";

    if (parachainObject.amount_polka_btc) {
        parsedPolkaBTC = satToBTC(parachainObject.amount_polka_btc.toString());
    } else if (parachainObject.amount) {
        parsedPolkaBTC = satToBTC(parachainObject.amount.toString());
    } else {
        throw new Error("No property found for PolkaBTC amount");
    }

    if (parachainObject.premium_dot && parachainObject.premium_dot.toString() !== "0") {
        parsedDOT = planckToDOT(parachainObject.premium_dot.toString());
    } else if (parachainObject.amount_dot) {
        parsedDOT = planckToDOT(parachainObject.amount_dot.toString());
    } else if (parachainObject.griefing_collateral) {
        parsedDOT = planckToDOT(parachainObject.griefing_collateral.toString());
    } else {
        throw new Error("No property found for DOT amount");
    }

    return [parachainObject.btc_address, parsedPolkaBTC, parsedDOT];
}

export const redeemRequestToVaultRedeem = (requests: Map<H256, ParachainRedeemRequest>): VaultRedeem[] => {
    const redeemRequests: VaultRedeem[] = [];
    requests.forEach((request, requestId) => {
        const [btcAddress, polkaBTC, unlockedDOT] = convertParachainTypes(request);
        redeemRequests.push({
            id: stripHexPrefix(requestId.toString()),
            timestamp: request.opentime.toString(),
            user: request.redeemer.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            unlockedDOT: unlockedDOT,
            status: "Pending",
            cancelled: request.cancelled.isTrue,
            completed: request.completed.isTrue,
        });
    });
    return redeemRequests;
};

export const issueRequestToVaultIssue = (requests: Map<H256, ParachainIssueRequest>): VaultIssue[] => {
    const issueRequests: VaultIssue[] = [];
    requests.forEach((request, requestId) => {
        const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
        issueRequests.push({
            id: stripHexPrefix(requestId.toString()),
            timestamp: request.opentime.toString(),
            user: request.requester.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            lockedDOT: lockedDOT,
            status: "Pending",
            cancelled: request.cancelled.isTrue,
            completed: request.completed.isTrue,
        });
    });
    return issueRequests;
};

export const requestsToVaultReplaceRequests = (requests: Map<H256, ParachainReplaceRequest>): VaultReplaceRequest[] => {
    const replaceRequests: VaultReplaceRequest[] = [];
    requests.forEach((request, requestId) => {
        const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
        replaceRequests.push({
            id: stripHexPrefix(requestId.toString()),
            timestamp: request.open_time.toString(),
            newVault: request.new_vault.toString(),
            oldVault: request.old_vault.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            lockedDOT: lockedDOT,
            status: request.accept_time.isSome ? "Accepted" : "Pending",
        });
    });
    return replaceRequests;
};

export const updateBalances = async (
    dispatch: Dispatch,
    address: string,
    currentBalanceDOT: string,
    currentBalancePolkaBTC: string
): Promise<void> => {
    const accountId = window.polkaBTC.api.createType("AccountId", address);
    const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
    const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
    const balancePolkaBTC = satToBTC(balancePolkaSAT.toString());
    const balanceDOT = planckToDOT(balancePLANCK.toString());

    if (currentBalanceDOT !== balanceDOT) {
        dispatch(updateBalanceDOTAction(balanceDOT));
    }

    if (currentBalancePolkaBTC !== balancePolkaBTC) {
        dispatch(updateBalancePolkaBTCAction(balancePolkaBTC));
    }
};

export const requestsInStore = (
    storeRequests: IssueRequest[] | RedeemRequest[],
    parachainRequests: IssueRequest[] | RedeemRequest[]
): boolean => {
    if (storeRequests.length !== parachainRequests.length) return false;
    let inStore = true;

    storeRequests.forEach((storeRequest: IssueRequest | RedeemRequest) => {
        let found = false;
        parachainRequests.forEach((parachainRequest: IssueRequest | RedeemRequest) => {
            if (storeRequest.id === parachainRequest.id) {
                found = true;
            }
        });
        if (!found) {
            inStore = false;
        }
    });
    return inStore;
};
