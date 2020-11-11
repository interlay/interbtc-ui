import { RedeemRequest, VaultRedeem } from "../types/redeem.types";
import { IssueRequest, VaultIssue } from "../types/issue.types";
import {
    DOT,
    PolkaBTC,
    RedeemRequest as ParachainRedeemRequest,
    ReplaceRequest,
} from "@interlay/polkabtc/build/interfaces/default";
import { VaultReplaceRequest } from "../types/vault.types";
import { H160, H256 } from "@polkadot/types/interfaces";
import { IssueRequest as ParachainIssueRequest } from "@interlay/polkabtc/build/interfaces/default";
import { satToBTC, planckToDOT, getP2WPKHFromH160, bitcoin } from "@interlay/polkabtc";
import { NUMERIC_STRING_REGEX, BITCOIN_NETWORK } from "../../constants";

export function shortAddress(address: string): string {
    if (address.length < 12) return address;
    return address.substr(0, 6) + "..." + address.substr(address.length - 7, address.length - 1);
}

export function shortTxId(txid: string): string {
    if (txid.length < 20) return txid;
    return txid.substr(0, 10) + "..." + txid.substr(txid.length - 11, txid.length - 1);
}

export function formatDateTime(date: Date): string {
    return date.toDateString().substring(3) + " " + date.toTimeString().substring(0, 5);
}

export function dateToShortString(date: Date): string {
    return date.toDateString().substring(3) + date.toTimeString().substring(0, date.toTimeString().length);
}

/**
 * Converts an IssueRequest object retrieved from the parachain
 * to a UI IssueRequest object
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 */
export function parachainToUIIssueRequest(id: H256, parachainIssueRequest: ParachainIssueRequest): IssueRequest {
    return {
        id: id.toString(),
        amountBTC: satToBTC(parachainIssueRequest.amount.toString()),
        creation: parachainIssueRequest.opentime.toString(),
        vaultBTCAddress: parachainIssueRequest.btc_address.toString(),
        btcTxId: "",
        confirmations: 0,
        completed: parachainIssueRequest.completed.isTrue,
    };
}

/**
 * Converts an IssueRequest object retrieved from the parachain
 * to a UI IssueRequest object
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 */
export function parachainToUIRedeemRequest(id: H256, parachainRedeemRequest: ParachainRedeemRequest): RedeemRequest {
    return {
        id: id.toString(),
        amountPolkaBTC: parachainRedeemRequest.amount_polka_btc.toString(),
        creation: parachainRedeemRequest.opentime.toString(),
        vaultBTCAddress: parachainRedeemRequest.btc_address.toString(),
        btcTxId: "",
        confirmations: 0,
        completed: false,
    };
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
    btc_address: H160;
    amount_polka_btc?: PolkaBTC;
    amount?: PolkaBTC;
    amount_dot?: DOT;
    griefing_collateral?: DOT;
}

export function getAddressFromH160(hash: H160): string | undefined {
    const btcNetwork =
        BITCOIN_NETWORK === "mainnet"
            ? bitcoin.networks.bitcoin
            : BITCOIN_NETWORK === "testnet"
            ? bitcoin.networks.testnet
            : bitcoin.networks.regtest;
    return getP2WPKHFromH160(hash, btcNetwork);
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
    const parsedBtcAddress = getAddressFromH160(parachainObject.btc_address);
    if (parsedBtcAddress === undefined) {
        throw new Error("Invalid BTC address encountered during parsing");
    }

    if (parachainObject.amount_polka_btc) {
        parsedPolkaBTC = satToBTC(parachainObject.amount_polka_btc.toString());
    } else if (parachainObject.amount) {
        parsedPolkaBTC = satToBTC(parachainObject.amount.toString());
    } else {
        throw new Error("No property found for PolkaBTC amount");
    }

    if (parachainObject.amount_dot) {
        parsedDOT = planckToDOT(parachainObject.amount_dot.toString());
    } else if (parachainObject.griefing_collateral) {
        parsedDOT = planckToDOT(parachainObject.griefing_collateral.toString());
    } else {
        throw new Error("No property found for DOT amount");
    }

    return [parsedBtcAddress, parsedPolkaBTC, parsedDOT];
}

export const redeemRequestToVaultRedeem = (requests: Map<H256, ParachainRedeemRequest>): VaultRedeem[] => {
    let redeemRequests: VaultRedeem[] = [];
    requests.forEach((request, requestId) => {
        const [btcAddress, polkaBTC, unlockedDOT] = convertParachainTypes(request);
        redeemRequests.push({
            id: requestId.toString(),
            timestamp: request.opentime.toString(),
            user: request.redeemer.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            unlockedDOT: unlockedDOT,
            status: "",
        });
    });
    return redeemRequests;
};

export const issueRequestToVaultIssue = (requests: Map<H256, ParachainIssueRequest> ): VaultIssue[] => {
    let issueRequests: VaultIssue[] = [];
    requests.forEach((request, requestId) => {
        const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
        issueRequests.push({
            id: requestId.toString(),
            timestamp: request.opentime.toString(),
            user: request.requester.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            lockedDOT: lockedDOT,
            status: "",
        });
    });
    return issueRequests;
};

export const requestsToVaultReplaceRequests = (requests: Map<H256, ReplaceRequest>): VaultReplaceRequest[] => {
    let replaceRequests: VaultReplaceRequest[] = [];
    requests.forEach((request, requestId) => {
        const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
        replaceRequests.push({
            id: requestId.toString(),
            timestamp: request.open_time.toString(),
            newVault: request.new_vault.toString(),
            oldVault: request.old_vault.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            lockedDOT: lockedDOT,
            status: request.accept_time.isSome ? "Accepted" : "Open", 
        });
    });
    return replaceRequests;
};
