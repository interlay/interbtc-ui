import React, { ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addVaultRedeemsAction } from "../../../common/actions/redeem.actions";
import { redeemRequestToVaultRedeem } from "../../../common/utils/utils";
import { satToBTC, planckToDOT } from "@interlay/polkabtc";


export default function RedeemTable(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();
    const redeems = useSelector((state: StoreType) => state.redeem.vaultRedeems);

    useEffect(() => {
        const fetchData = async () => {
            if(!polkaBtcLoaded) return;
            
            const accountId = await window.vaultClient.getAccountId();    
            const vaultId = window.polkaBTC.api.createType("AccountId",accountId);         
            const redeemsMap = await window.polkaBTC.vaults.mapRedeemRequests(vaultId);
            const redeems = redeemsMap.get(vaultId);

            if (!redeems) return;
            dispatch(addVaultRedeemsAction(redeemRequestToVaultRedeem(redeems)));
        };
        fetchData();
    }, [polkaBtcLoaded, dispatch]);

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
                                    <th>BTC Address</th>
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
                                            <td>{satToBTC(redeem.polkaBTC)}</td>
                                            <td>{planckToDOT(redeem.unlockedDOT)}</td>
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
