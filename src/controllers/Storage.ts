import { StorageInterface } from "../types/Storage";
import { IssueRequest } from "../types/IssueState";
import { RedeemRequest } from "../types/RedeemState";

//
//                       IssueRequest
//           (issue) ->
//                       IssueRequest
// (user) ->
//                       RedeemRequest
//           (redeem) ->
//                       RedeemRequest
//
export default class Storage implements StorageInterface {
  address = "";
  issueRequests: Array<IssueRequest> = [];
  redeemRequests: Array<RedeemRequest> = [];

  // load requests based on user account
  constructor(address: string) {
    this.address = address;
    [this.issueRequests, this.redeemRequests] = this.loadRequests();
  }

  loadRequests() {
    let requests = localStorage.getItem(this.address);
    if (requests != null) {
      let pending = JSON.parse(requests);
      let issueRequests = pending.issueRequests;
      let redeemRequests = pending.redeemRequests;
      return [issueRequests, redeemRequests];
    }
    return [[], []];
  }

  getIssueRequests() {
    return this.issueRequests;
  }

  getRedeemRequests() {
    return this.redeemRequests;
  }

  appendIssueRequest(req: IssueRequest) {
    console.log("Storing" + req);
    this.issueRequests.push(req);
    this.writeToStorage();
  }

  appendRedeemRequest(req: RedeemRequest) {
    this.redeemRequests.push(req);
    this.writeToStorage();
  }

  modifyIssueRequest(req: IssueRequest) {
    const id = req.id;
    for (let i = 0; i < this.issueRequests.length; i++) {
      if (this.issueRequests[i].id === id) {
        this.issueRequests[i] = req;
        break;
      }
    }
    this.writeToStorage();
  }

  modifyRedeemRequest(req: RedeemRequest) {
    const id = req.id;
    for (let i = 0; i < this.redeemRequests.length; i++) {
      if (this.redeemRequests[i].id === id) {
        this.redeemRequests[i] = req;
        break;
      }
    }
    this.writeToStorage();
  }

  deleteIssueRequest(id: string) {
    const req = this.issueRequests.find(req => req.id === id);
    if (req) {
      const index = this.issueRequests.indexOf(req, 0);
      if (index > -1) {
        this.issueRequests.splice(index, 1);
      }
    }
    this.writeToStorage();
  }

  deleteRedeemRequest(id: string) {
    const req = this.redeemRequests.find(req => req.id === id);
    if (req) {
      const index = this.redeemRequests.indexOf(req, 0);
      if (index > -1) {
        this.redeemRequests.splice(index, 1);
      }
    }
    this.writeToStorage();
  }

  clearStorage() {
    localStorage.clear();
  }

  writeToStorage() {
    let requests = JSON.stringify(
      {
        "issueRequests": this.issueRequests,
        "redeemRequests": this.redeemRequests
      }
    )
    localStorage.setItem(this.address, requests);
  }
}
