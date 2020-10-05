export function shortAddress(address: string): string {
    if (address.length < 12) return address;
    return address.substr(0, 6) + "..." + address.substr(address.length - 7, address.length - 1);
}

export function shortTxId(txid: string): string {
    if (txid.length < 20) return txid;
    return txid.substr(0, 10) + "..." + txid.substr(txid.length - 11, txid.length - 1);
}

export function dateToShortString(date: Date): string {
    return date.toString().substr(0, 34);
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
