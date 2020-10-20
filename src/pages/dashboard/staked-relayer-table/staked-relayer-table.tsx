import React from "react";
import * as constants from "../../../constants";

type StakedRelayer = {
    id: string,
    name: string,
    lockedDOT: string,
    status: string
}

export default function StakedRelayerTable () {
    let relayers: StakedRelayer[] = [];

    const getStatusColor = (status: string): string => {
        if (status === constants.VAULT_STATUS_ACTIVE) {
            return "green-text";
        }
        if (status === constants.VAULT_STATUS_UNDECOLLATERALIZED) {
            return "orange-text";
        }
        if (
            status === constants.VAULT_STATUS_THEFT ||
            status === constants.VAULT_STATUS_AUCTION ||
            status === constants.VAULT_STATUS_LIQUIDATED
        ) {
            return "red-text";
        }
        return "black-text";
    };

    return <div className="staked-relayer-table">
    <div className="row">
        <div className="col-12">
            <div className="header">Staked Relayer</div>
        </div>
    </div>
    <div className="row justify-content-center">
        <div className="col-12">
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Relayer</th>
                            <th>Locked DOT</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relayers.map((relayer, index) => {
                            return (
                                <tr key={index}>
                                    <td>{relayer.id}</td>
                                    <td className="break-words">{relayer.name}</td>
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