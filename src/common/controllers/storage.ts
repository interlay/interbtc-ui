import { CommonStorage, UserStorage, StorageInterface } from "../types/storage.types";
import { IssueRequest } from "../types/issue.types";
import { RedeemRequest } from "../types/redeem.types";

/// Storage layout
/// ===================================
/// Common storage
/// ===================================
/// (totalPolkaBTC)
/// (...)
/// ===================================
///           (balancePolkaBTC)
///           (balanceDOT)
///                       IssueRequest
///           (issue) ->
///                       IssueRequest
/// (user) ->
///                       RedeemRequest
///           (redeem) ->
///                       RedeemRequest
///
export default class Storage implements StorageInterface {
    private address: string | undefined;
    private issueRequests: Array<IssueRequest>;
    private redeemRequests: Array<RedeemRequest>;

    // load requests based on user account
    constructor(address?: string) {
        if (address) {
            this.address = address;
            [this.issueRequests, this.redeemRequests] = this.loadRequests();
        } else {
            [this.issueRequests, this.redeemRequests] = [[], []];
        }
    }

    getItemCommon(key: CommonStorage): string {
        const value = localStorage.getItem(key);
        if (value != null) {
            return value;
        }
        return "";
    }

    setItemCommon(key: CommonStorage, value: string): void {
        localStorage.setItem(key, value);
    }

    // user specific requests
    getItemUser(key: UserStorage): string {
        if (this.address) {
            const value = localStorage.getItem(key + this.address);
            if (value != null) {
                return value;
            }
        }
        return "";
    }

    setItemUser(key: UserStorage, value: string): void {
        if (this.address) {
            localStorage.setItem(key + this.address, value);
        }
    }

    loadRequests(): [[], []] {
        if (this.address) {
            const requests = localStorage.getItem(this.address);
            if (requests != null) {
                const pending = JSON.parse(requests);
                const issueRequests = pending.issueRequests;
                const redeemRequests = pending.redeemRequests;
                return [issueRequests, redeemRequests];
            }
        }
        return [[], []];
    }

    getIssueRequests(): Array<IssueRequest> {
        return this.issueRequests;
    }

    getIssueRequest(id: string): IssueRequest | undefined {
        return this.issueRequests.find(r => r.id === id);
    }

    getRedeemRequests(): Array<RedeemRequest> {
        return this.redeemRequests;
    }

    appendIssueRequest(req: IssueRequest): void {
        this.issueRequests.push(req);
        this.storeRequests();
    }

    appendRedeemRequest(req: RedeemRequest): void {
        this.redeemRequests.push(req);
        this.storeRequests();
    }

    modifyIssueRequest(req: IssueRequest): void {
        const id = req.id;
        for (let i = 0; i < this.issueRequests.length; i++) {
            if (this.issueRequests[i].id === id) {
                this.issueRequests[i] = req;
                break;
            }
        }
        this.storeRequests();
    }

    modifyRedeemRequest(req: RedeemRequest): void {
        const id = req.id;
        for (let i = 0; i < this.redeemRequests.length; i++) {
            if (this.redeemRequests[i].id === id) {
                this.redeemRequests[i] = req;
                break;
            }
        }
        this.storeRequests();
    }

    deleteIssueRequest(id: string): void {
        const req = this.issueRequests.find((req) => req.id === id);
        if (req) {
            const index = this.issueRequests.indexOf(req, 0);
            if (index > -1) {
                this.issueRequests.splice(index, 1);
            }
        }
        this.storeRequests();
    }

    deleteRedeemRequest(id: string): void {
        const req = this.redeemRequests.find((req) => req.id === id);
        if (req) {
            const index = this.redeemRequests.indexOf(req, 0);
            if (index > -1) {
                this.redeemRequests.splice(index, 1);
            }
        }
        this.storeRequests();
    }

    clearStorage(): void {
        localStorage.clear();
    }

    private storeRequests(): void {
        if (this.address) {
            const requests = JSON.stringify({
                issueRequests: this.issueRequests,
                redeemRequests: this.redeemRequests,
            });
            localStorage.setItem(this.address, requests);
        }
    }
}
