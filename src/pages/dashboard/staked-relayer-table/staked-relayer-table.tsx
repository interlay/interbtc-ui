import React from "react";
import * as constants from "../../../constants";

type StakedRelayer = {
    AccountID: string,
    lockedDOT: number,
    status: string
}

export default function StakedRelayerTable () {
    const relayers: StakedRelayer[] = [
        {
            AccountID: "zxczxcxzhcxz",
            lockedDOT: 0.04,
            status: "Ok"
        },
        {
            AccountID: "xxxzxczxcxzhcxz",
            lockedDOT: 0.24,
            status: "Theft"
        },
        {
            AccountID: "zzzzzzxczxcxzhcxz",
            lockedDOT: 0.24,
            status: "Liquidation"
        }
    ];
    const relayerStatus = "Ok";


    const getCircle = (status: string): string => {
        if (status === "Ok") {
            return "green-circle";
        }
        if (status === "Offline") {
            return "orange-circle";
        }
        return "red-circle";
    };

    const getStatusColor = (status: string): string => {
        if (status === constants.STAKED_RELAYER_OK) {
            return "green-text";
        }
        if (status === constants.STAKED_RELAYER_OFFLINE) {
            return "orange-text";
        }
        if (status === constants.STAKED_RELAYER_SLASHED) {
            return "red-text";
        }
        return "black-text";
    };

    return <div className="staked-relayer-table">
    <div className="row">
        <div className="col-12">
            <div className="header">
                Staked Relayer &nbsp; <div className={getCircle(relayerStatus)}></div> &nbsp; {relayerStatus}
            </div>
        </div>
    </div>
    <div className="row justify-content-center">
        <div className="col-12">
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>AccountID</th>
                            <th>Locked DOT</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relayers.map((relayer, index) => {
                            return (
                                <tr key={index}>
                                    <td className="break-words">{relayer.AccountID}</td>
                                    <td>{relayer.lockedDOT}</td>
                                    <td className={getStatusColor(relayer.status)}>{relayer.status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
}