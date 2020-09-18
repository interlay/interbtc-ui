export function shortAddress(address: string): string {
    if (address.length < 12) return address;
    return (
        address.substr(0, 6) +
    "..." +
    address.substr(address.length - 7, address.length - 1)
    );
}

export function shortTxId(txid: string): string {
    if (txid.length < 20) return txid;
    return (
        txid.substr(0, 10) + "..." + txid.substr(txid.length - 11, txid.length - 1)
    );
}
