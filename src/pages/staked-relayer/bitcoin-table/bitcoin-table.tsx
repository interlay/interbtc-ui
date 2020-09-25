import React, { ReactElement, useEffect, useState } from "react";
import { PolkaBTCAPI } from "@interlay/polkabtc";

export default function BitcoinTable(): ReactElement {
    const [relayStatus,setStatus] = useState("Online");
    const [btcBlocks,setBlocks] = useState([{}]);

    useEffect(()=>{
        setStatus("Online");
        setBlocks([
            {source: "Bitcoin Core", hash: "00000000000...42d948799f82d",
            height: "1,835,346", timestamp: "2020-09-21 10:59:13"},
            {source: "BTC Parachain", hash: "00000000000...f6499c8547227",
            height: "2,230,342", timestamp: "2020-08-01 10:37:54"}
        ]);
    },[]);

    const getCircle = (status: string): string =>{
        if(status === "Online"){
            return "green-circle";
        }
        if(status === "Fork"){
            return "orange-circle";
        }
        return "red-circle"
    }

    return <div className="bitcoin-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    Bitcoin Relay Status:&nbsp; {relayStatus} &nbsp;<div className={getCircle("Online")}></div>
                </div>
            </div>
        </div>
        <div className="row justify-content-center">
            <div className="col-12">
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Best Block Hash</th>
                                <th>Best Block Height</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {btcBlocks.map((block: any, index)=>{
                                return <tr key={index}>
                                    <td>{block.source}</td>
                                    <td>{block.hash}</td>
                                    <td>{block.height}</td>
                                    <td>{block.timestamp}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}