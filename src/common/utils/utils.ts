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
import { satToBTC, planckToDOT, getP2WPKHFromH160 } from "@interlay/polkabtc";
import { NUMERIC_STRING_REGEX } from "../../constants";

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

export function remove0x(hash: string): string {
    if (hash.substr(0, 2) === "0x") {
        return hash.substr(2);
    }
    return hash;
}

/**
 * Converts endianness of a Uint8Array
 * @param bytes Uint8Array, to be converted LE<>BE
 */
export function reverseEndianness(bytes: Uint8Array): Uint8Array {
    let offset = bytes.length;
    for (let index = 0; index < bytes.length; index += bytes.length) {
        offset--;
        for (let x = 0; x < offset; x++) {
            const b = bytes[index + x];
            bytes[index + x] = bytes[index + offset];
            bytes[index + offset] = b;
            offset--;
        }
    }
    return bytes;
}

/**
 * Converts a Uin8Array to string, removing the leading "0x"
 * @param bytes
 */
export function uint8ArrayToStringClean(bytes: Uint8Array): string {
    return bytes.toString().substr(2).split("").join("");
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
        amountBTC: parachainIssueRequest.amount.toString(),
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
        creation: new Date(parachainRedeemRequest.opentime.toString()),
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
        arr[key].forEach((request: IssueRequest | RedeemRequest) => {
            request.creation = new Date(request.creation);
        });
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

/**
 * Parses types which belong to request objects and need parsing/conversion to be displayed in the UI.
 *
 * @param parachainObject A request object, which must have a BTC address, a PolkaBTC amount and a DOT amount.
 * @returns A tuple with the parsed properties
 */
function convertParachainTypes(parachainObject: ParsableParachainTypes): [string, string, string] {
    let parsedPolkaBTC = "";
    let parsedDOT = "";
    const parsedBtcAddress = getP2WPKHFromH160(parachainObject.btc_address);
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

export const redeemRequestToVaultRedeem = (requests: ParachainRedeemRequest[]): VaultRedeem[] => {
    return requests.map((request) => {
        const [btcAddress, polkaBTC, unlockedDOT] = convertParachainTypes(request);
        return {
            id: request.vault.toString(),
            timestamp: request.opentime.toString(),
            user: request.redeemer.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            unlockedDOT: unlockedDOT,
            status: "",
        };
    });
};

export const issueRequestToVaultIssue = (requests: ParachainIssueRequest[]): VaultIssue[] => {
    return requests.map((request) => {
        const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
        return {
            id: request.vault.toString(),
            timestamp: request.opentime.toString(),
            user: request.requester.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            lockedDOT: lockedDOT,
            status: "",
        };
    });
};

export const requestsToVaultReplaceRequests = (requests: ReplaceRequest[]): VaultReplaceRequest[] => {
    return requests.map((request) => {
        const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
        return {
            id: request.old_vault.toString(),
            timestamp: request.open_time.toHuman(),
            vault: request.new_vault.toString(),
            btcAddress: btcAddress,
            polkaBTC: polkaBTC,
            lockedDOT: lockedDOT,
            status: "",
        };
    });
};
