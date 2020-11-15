import { planckToDOT } from "@interlay/polkabtc";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import * as constants from "../../../constants";

type StakedRelayer = {
    AccountId: string;
    lockedDOT: string;
    status: string;
};

export default function StakedRelayerTable(): ReactElement {
    const isPolkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const [relayers, setRelayers] = useState<Array<StakedRelayer>>([]);
    const [relayerStatus, setRelayerStatus] = useState("Ok");

    useEffect(() => {
        const fetchData = async () => {
            if (!isPolkaBtcLoaded) return;

            try {
                const relayers = await window.polkaBTC.stakedRelayer.map();
                let relayersList: StakedRelayer[] = [];
                relayers.forEach((stake, id) => {
                    relayersList.push({
                        AccountId: id.toString(),
                        lockedDOT: planckToDOT(stake.stake.toString()),
                        // TODO: add a status check for relayers in the parachain
                        status: constants.STAKED_RELAYER_OK,
                    });
                });
                setRelayers(relayersList);
                // TODO: add status check for relayers on parachain
                setRelayerStatus("Ok");
            } catch (error) {
                toast.error(error.toString());
            }
        };

        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, constants.COMPONENT_UPDATE_MS);
        return () => clearInterval(interval);
    }, [isPolkaBtcLoaded]);

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

    return (
        <div className="staked-relayer-table">
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
                                            <td className="break-words">{relayer.AccountId}</td>
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
    );
}
