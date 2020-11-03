import React, { ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addVaultRedeemsAction } from "../../../common/actions/redeem.actions";
import { Vault, RedeemRequest } from "@interlay/polkabtc/build/interfaces/default";
import { redeemRequestToVaultRedeem } from "../../../common/utils/utils";

export default function RedeemTable(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();
    const redeems = useSelector((state: StoreType) => state.redeem.vaultRedeems);

    useEffect(() => {
        const fetchData = async () => {
            if(!polkaBtcLoaded) return;
            let list = (await window.polkaBTC.vaults.list()) as Vault[];
            let allRedeems: RedeemRequest[]= [];
            list.forEach(async (vault) => {
                const vaultId = window.polkaBTC.api.createType("AccountId",vault.id.toHuman());
                const redeemsMap = await window.polkaBTC.vaults.mapRedeemRequests(vaultId);
                const redeems = redeemsMap.get(vaultId);
                if (!redeems) return;
                allRedeems = [...allRedeems,...redeems];
            })
            dispatch(addVaultRedeemsAction(redeemRequestToVaultRedeem(allRedeems)));
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
