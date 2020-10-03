import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector } from "react-redux";

interface OracleInfo {
    source: string;
    feed: string;
    lastUpdate: string;
    exchangeRate: number;
}

export default function OracleTable(): ReactElement {
    const [oracleStatus, setStatus] = useState("Online");
    const [oracles, setOracles] = useState<Array<OracleInfo>>([]);
    const polkaBTC = useSelector((state: StoreType) => state.api);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC) return;
            const oracle = await polkaBTC.oracle.getInfo();
            setStatus(oracle.online ? "Online" : "Offline");
            setOracles([
                {
                    source: oracle.name,
                    feed: oracle.feed,
                    lastUpdate: oracle.lastUpdate.toString().substr(0, 34),
                    exchangeRate: oracle.exchangeRate,
                },
            ]);
        };
        fetchData();
    }, [polkaBTC]);

    return (
        <div className="oracle-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Oracle Status: &nbsp;
                        <div className={oracleStatus === "Online" ? "green-circle" : "red-circle"}></div> &nbsp;{oracleStatus} 
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
                                    <th>Feed</th>
                                    <th>Last Update</th>
                                    <th>Exchange Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {oracles.map((oracle, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{oracle.source}</td>
                                            <td>{oracle.feed}</td>
                                            <td>{oracle.lastUpdate}</td>
                                            <td> 1 DOT = {oracle.exchangeRate} BTC</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
