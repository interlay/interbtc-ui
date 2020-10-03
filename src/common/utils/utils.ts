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

export function satToBTC(sat: number): string {
    return (sat * 0.00000001).toString();
}

export function BTCtoSat(btc: string): number {
    return Number(btc) * 100000000;
}

export function plankToDOT(plank: number): string {
    return (plank * 0.0000000001).toString();
}

export function DOTtoPlank(dot: string): number {
    return Number(dot) * 10000000000;
}
