import { IssueRequest } from "./common/types/IssueState";
import { RedeemRequest } from "./common/types/RedeemState";
import { ALICE_BTC, BOB_BTC } from "./constants";

export const MockIssueRequests: Array<IssueRequest> = [
    {
        id: "1",
        amount: "5.7",
        creation: "2020-06-15T19:07:00.000Z",
        vaultAddress: "aa269f4bd72bd...7d10a62a9cdd8d7f",
        btcTx: "3b4162a307fab...b588d61a9069e762",
        confirmations: 25,
        completed: true,
    },
    {
        id: "2",
        amount: "1.5",
        creation: "2020-06-16T21:08:00.000Z",
        vaultAddress: "aa269f4bd72bd...7d10a62a9cdd8d7f",
        btcTx: "d3c6652dfa406...e4aacb4c441e030e",
        confirmations: 9,
        completed: true,
    },
];

export const MockRedeemRequests: Array<RedeemRequest> = [
    {
        id: "1",
        amount: "0.5",
        creation: "2020-06-15T16:09:01.000Z",
        vaultAddress: "aa269f4bd72bd...7d10a62a9cdd8d7f",
        btcTx: "3b4162a307fab...b588d61a9069e762",
        confirmations: 18,
        redeemAddress: ALICE_BTC,
        vaultBTCAddress: BOB_BTC,
        completed: true,
    },
    {
        id: "2",
        amount: "0.2",
        creation: "2020-06-13T20:08:23.000Z",
        vaultAddress: "aa269f4bd72bd...7d10a62a9cdd8d7f",
        btcTx: "d3c6652dfa406...e4aacb4c441e030e",
        confirmations: 7,
        redeemAddress: ALICE_BTC,
        vaultBTCAddress: BOB_BTC,
        completed: true,
    },
];

export const totalPolkaBTC = "12333.41";
export const totalLockedDOT = "43243.98";

export const balancePolkaBTC = "7.2";
export const balanceDOT = "20.21";

export const balanceLockedDOT = "19431.94";
export const backedPolkaBTC = "109.96";
export const collateralRate = "228.02";
export const feesEarned = "0.34";
