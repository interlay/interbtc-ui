import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../types/util.types";
import { useSelector } from "react-redux";
import { dateToShortString } from "../../utils/utils";
import BN from "bn.js";
import * as constants from "../../../constants";

interface OracleInfo {
    source: string;
    feed: string;
    lastUpdate: string;
    exchangeRate: number;
}

type OracleTableProps = {
    planckLocked: string;
};

export default function OracleTable(props: OracleTableProps): ReactElement {
    const [oracleStatus, setStatus] = useState("Online");
    const [oracles, setOracles] = useState<Array<OracleInfo>>([]);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;
            const oracle = await window.polkaBTC.oracle.getInfo();
            setStatus(oracle.online ? "Online" : "Offline");
            setOracles([
                {
                    source: oracle.name,
                    feed: oracle.feed,
                    lastUpdate: dateToShortString(oracle.lastUpdate),
                    exchangeRate: oracle.exchangeRate,
                },
            ]);
        };

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, constants.COMPONENT_UPDATE_MS);
        return () => clearInterval(interval);
    }, [polkaBtcLoaded]);

    return (
        <div className={"oracle-table " + (new BN(props.planckLocked) <= new BN(0) ? "oracle-space" : "")}>
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Oracle Status: &nbsp;
                        <div className={oracleStatus === "Online" ? "green-circle" : "red-circle"}></div> &nbsp;
                        {oracleStatus}
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
                            {oracles && oracles.length
                                ?
                                <tbody>
                                    {oracles.map((oracle, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{oracle.source}</td>
                                                <td>{oracle.feed}</td>
                                                <td>{oracle.lastUpdate}</td>
                                                <td> 1 BTC = {oracle.exchangeRate} DOT</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                :
                                <tbody>
                                    <tr>
                                        <td colSpan={4}>
                                            No active oracles
                                        </td>
                                    </tr>
                                </tbody>
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
