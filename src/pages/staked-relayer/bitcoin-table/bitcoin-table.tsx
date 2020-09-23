import React, { ReactElement, useEffect, useState } from "react";

export default function BitcoinTable(): ReactElement {
    const [relayStatus,setStatus] = useState(false);
    const [btcBlocks,setBlocks] = useState([{}]);

    useEffect(()=>{
        setStatus(true);
        setBlocks([
            {source: "Bitcoin Core", hash: "00000000000...42d948799f82d",
            height: "1,835,346", timestamp: "2020-09-21 10:59:13"
            },
            {source: "BTC Parachain", hash: "00000000000...f6499c8547227",
            height: "2,230,342", timestamp: "2020-08-01 10:37:54"
        }
        ]);
    },[]);

    return <div className="bitcoin-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    Bitcoin Relay Status: Online &nbsp;<div className="red-circle"></div>{relayStatus}
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