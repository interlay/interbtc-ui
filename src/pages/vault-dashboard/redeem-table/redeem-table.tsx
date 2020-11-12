import React, { ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { addVaultRedeemsAction } from "../../../common/actions/redeem.actions";
import { redeemRequestToVaultRedeem, shortAddress } from "../../../common/utils/utils";

export default function RedeemTable(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const redeems = useSelector((state: StoreType) => state.redeem.vaultRedeems);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const accountId = await window.vaultClient.getAccountId();
                const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
                const redeemMap = await window.polkaBTC.vaults.mapRedeemRequests(vaultId);
                
                if (!redeemMap) return;
                dispatch(addVaultRedeemsAction(redeemRequestToVaultRedeem(redeemMap)));
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [polkaBtcLoaded, dispatch]);

    return (
        <div className="redeem-table">
            <div className="row">
                <div className="col-12">
                    <div className="header">Redeem Requests</div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Creation Block</th>
                                    <th>User</th>
                                    <th>BTC Address</th>
                                    <th>PolkaBTC</th>
                                    <th>Collateral Unlocked</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {redeems.map((redeem, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{shortAddress(redeem.id)}</td>
                                            <td>{redeem.timestamp}</td>
                                            <td>{shortAddress(redeem.user)}</td>
                                            <td>{shortAddress(redeem.btcAddress)}</td>
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
