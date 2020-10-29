import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addVaultRedeemsAction } from "../../../common/actions/redeem.actions";

export default function RedeemTable(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();
    const redeems = useSelector((state: StoreType) => state.redeem.vaultRedeems);

    useEffect(() => {
        const fetchData = async () => {
            if(!polkaBtcLoaded){
                // TO DO FETCH REDEEMS AND STORE THEM IN STORE
                dispatch(addVaultRedeemsAction([]));
            }
        };
        fetchData();
    }, [polkaBtcLoaded]);

    return (
        <div className="redeem-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        Redeem
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
                                    <th>User</th>
                                    <th>BTC Address(es)</th>
                                    <th>PolkaBTC</th>
                                    <th>LockedDOT</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {redeems.map((redeem, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{redeem.id}</td>
                                            <td>{redeem.timestamp}</td>
                                            <td>{redeem.user}</td>
                                            <td>{redeem.btcAddress}</td>
                                            <td>{redeem.polkaBTC}</td>
                                            <td>{redeem.unlockedDOT}</td>
                                            <td>{redeem.status}</td>
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
