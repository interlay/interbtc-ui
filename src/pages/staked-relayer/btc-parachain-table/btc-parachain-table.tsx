import React, { ReactElement, useEffect, useState } from "react";

export default function BtcParachainTable ():ReactElement{
    const [parachainStatus,setStatus] = useState(false);
    const [parachains,setParachains] = useState([{}]);

    useEffect(()=>{
        setParachains([{
            id: "1",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Error",
            currentStatus: "Running",
            proposedChanges: "Add NO_DATA error",
            hash: "00000000000...42d948799f82d",
            votes: "49 : 20",
            result: "Accepted"
        },{
            id: "2",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Running",
            currentStatus: "Error",
            proposedChanges: "Remove NO_DATA error",
            hash: "00000000000...42d948799f82d",
            votes: "3 : 27",
            result: "Pending"
        },{
            id: "3",
            timestamp: "22020-09-21 10:59:13",
            proposedStatus: "Error",
            currentStatus: "Error",
            proposedChanges: "Add INVALID_BTC_RELAY error",
            hash: "00000000000...42d948799f82d",
            votes: "90 : 227",
            result: "Rejected"
        }]);
        setStatus(true);
    },[]);

    return <div className="btc-parachain-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    BTC Parachain Status: Running &nbsp;<div className="green-circle"></div>{parachainStatus}
                </div>
            </div>
        </div>
        <div className="row justify-content-center">
            <div className="col-12">
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Timestamp</th>
                                <th>Proposed Status</th>
                                <th>Current Status</th>
                                <th>Proposed Changes</th>
                                <th>BTC Block Hash</th>
                                <th>Votes (Yes : No)</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parachains.map((parachain: any, index)=>{
                                return <tr key={index}>
                                    <td>{parachain.id}</td>
                                    <td>{parachain.timestamp}</td>
                                    <td>{parachain.proposedStatus}</td>
                                    <td>{parachain.currentStatus}</td>
                                    <td>{parachain.proposedChanges}</td>
                                    <td>{parachain.hash}</td>
                                    <td>{parachain.votes}</td>
                                    <td>{parachain.result}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}