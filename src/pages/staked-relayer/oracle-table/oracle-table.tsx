import React, { ReactElement, useEffect, useState } from "react";

export default function OracleTable ():ReactElement{
    const [oracleStatus,setStatus] = useState(false);
    const [oracles,setOracles] = useState([{}]);

    useEffect(()=>{
        setOracles([{
            source: "ChainLink",
            feed: "BTC/DOT",
            lastUpdate: "2020-09-21 10:59:13",
            lastPrice: "1 BTC = 123 DOT",
            status: "Online"
        },{
            source: "ChainLink",
            feed: "BTC/DOT",
            lastUpdate: "2020-09-21 10:59:13",
            lastPrice: "1 BTC = 123 DOT",
            status: "Online"
        },{
            source: "ChainLink",
            feed: "BTC/DOT",
            lastUpdate: "2020-09-21 10:59:13",
            lastPrice: "1 BTC = 123 DOT",
            status: "Online"
        }]);
        setStatus(true);
    },[]);

    return <div className="oracle-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    BTC Parachain Status: Running &nbsp;<div className="green-circle"></div>{oracleStatus}
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
                            </tr>
                        </thead>
                        <tbody>
                            {oracles.map((oracle: any, index)=>{
                                return <tr key={index}>
                                    <td>{oracle.source}</td>
                                    <td>{oracle.feed}</td>
                                    <td>{oracle.lastUpdate}</td>
                                    <td>{oracle.lastPrice}</td>
                                    <td>{oracle.status}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}