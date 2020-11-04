import { IssueRequest } from "../types/issue.types";
import { RedeemRequest } from "../types/redeem.types";
import { H256 } from "@polkadot/types/interfaces";
import { IssueRequest as ParachainIssueRequest } from "@interlay/polkabtc/build/interfaces/default";

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
