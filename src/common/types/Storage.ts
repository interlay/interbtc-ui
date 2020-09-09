import { IssueRequest } from "./IssueState";
import { RedeemRequest } from "./RedeemState";

export interface StorageInterface {
  address: string,
  issueRequests: Array<IssueRequest>,
  redeemRequests: Array<RedeemRequest>,

  // load both issue and redeem requests
  loadRequests(): any[],

  // get the current issue requests
  getIssueRequests(): Array<IssueRequest>,

  // get the current redeem requests
  getRedeemRequests(): Array<RedeemRequest>,

  // append a new issue request
  appendIssueRequest(req: IssueRequest): void,

  // append a new redeem request
  appendRedeemRequest(req: RedeemRequest): void,

  // modify an issue request
  modifyIssueRequest(req: IssueRequest): void,

  // modify a redeem request
  modifyRedeemRequest(req: RedeemRequest): void,

  // delete a issue request
  deleteIssueRequest(id: string): void,

  // delete a redeem request
  deleteRedeemRequest(id: string): void,

  // clear storage
  clearStorage(): void,
}

export interface KVStorageInterface {
  getValue(key: string): string,

  setValue(key: string, value: string): void,
}
