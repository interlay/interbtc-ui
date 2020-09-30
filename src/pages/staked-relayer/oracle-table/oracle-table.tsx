import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector } from "react-redux";

export default function OracleTable ():ReactElement{
    const [oracleStatus,setStatus] = useState("Online");
    const [oracles,setOracles] = useState([{}]);
    const polkaBTC = useSelector((state: StoreType) => state.api)

    useEffect(()=>{
        setStatus("Online");
        const fetchData = async () => {
            if (!polkaBTC) return;
            const oracle = await polkaBTC.oracle.getInfo();
            console.log(oracle);
            setOracles([{
                source: oracle.name,
                feed: oracle.feed,
                lastUpdate: oracle.lastUpdate.toString().substring(0,25),
                lastPrice: "1 BTC = 123 DOT",
                status: oracle.online ? "Online" : "Offline"
            }]);
        };
        fetchData();
    },[polkaBTC]);

    return <div className="oracle-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    Oracle Status: &nbsp;{oracleStatus} &nbsp;
                    <div className={(oracleStatus==="Online" ? "green-circle" : "red-circle")}></div>
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
                                    <td className={oracle.status === "Online" ? "green-text": "red-text"}>{oracle.status}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}