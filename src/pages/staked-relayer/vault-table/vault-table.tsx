import React, { ReactElement, useState, useEffect } from "react";
import { StoreType } from "../../../common/types/util.types";
import { useSelector, useDispatch } from "react-redux";
import { Vault } from "../../../common/types/util.types";
import { fetchPrices } from "../../../common/api/api";

export default function VaultTable(): ReactElement{
    const [vaultStatus,setStatus] = useState("Ok");
    const [vaults,setVaults] = useState([{}]);
    const prices = useSelector((state: StoreType) => state.prices);
    const polkaBTC = useSelector((state: StoreType) => state.api)
    const dispatch = useDispatch();


    useEffect(()=>{
        const fetchData = async () => {
            fetchPrices(dispatch);
        };
        fetchData();
    },[fetchPrices,dispatch]);

    useEffect(()=>{
        const fetchData = async () => {
            if (!polkaBTC || !prices) return;
            
            let vaults = await polkaBTC.vaults.list();
            let vaultsList: Vault[] = [];
            vaults.forEach(async (vault,index)=>{
                const activeStakedRelayerId = polkaBTC.api.createType("AccountId",vault.id);
                let lockedDot = await polkaBTC.stakedRelayer.getStakedDOTAmount(activeStakedRelayerId);
                let collateralization = await polkaBTC.vaults.getCollateralization(vault.id);
                
                vaultsList.push({
                    id: vault.id.toHuman(),
                    vault: "zxczxcxzhcxz",
                    lockedBTC: lockedDot.words[0]*prices.dotBtc,
                    lockedDOT: lockedDot.words[0],
                    btcAddress: vault.btc_address.toHuman(),
                    collateralization
                });
                if (index+1 === vaults.length) setVaults(vaultsList);
            });
            console.log("List ====>>>> ",vaultsList);
        };
        fetchData();
        setStatus("Ok");
    },[polkaBTC,prices]);

    const getStatusColor = (status: string):string =>{
        if (status === "Ok"){
            return "green-text";
        }
        if (status === "Theft"){
            return "orange-text"
        }
        return "red-text"
    }

    const getCircle = (status: string): string => {
        if (status === "Ok"){
            return "green-circle";
        }
        if (status === "Error"){
            return "yellow-circle";
        }
        return "red-circle";
    }

    const getCollateralizationColor = (collateralization: number): string => {
        if (collateralization >= 200){
            return "green-text";
        }
        if (collateralization >= 150 && collateralization < 200){
            return "yellow-text"
        }
        if (collateralization >120 && collateralization < 150){
            return "orange-text"
        }
        return "red-text";
    }

    return <div className="vault-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    Vault Status: &nbsp;{vaultStatus} &nbsp;<div className={getCircle("Ok")}></div>
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
                                <th>BTC Address(es)</th>
                                <th>locked DOT</th>
                                <th>locked BTC</th>
                                <th>Collateralization</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaults.map((vault: any, index)=>{
                                return <tr key={index}>
                                    <td>{vault.vault}</td>
                                    <td className="break-words">{vault.btcAddress}</td>
                                    <td>{vault.lockedDOT && vault.lockedDOT.toFixed(2)}</td>
                                    <td>{vault.lockedBTC && vault.lockedBTC.toFixed(2)}</td>
                                    <td className={getCollateralizationColor(vault.collateralization)}>{vault.collateralization}%</td>
                                    <td className={getStatusColor(vault.status)}>{vault.status}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}