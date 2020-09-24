import React, { ReactElement, useState, useEffect } from "react";

export default function VaultTable(): ReactElement{
    const [vaultStatus,setStatus] = useState("Ok");
    const [vaults,setVaults] = useState([{}]);

    useEffect(()=>{
        setVaults([{
            id: "1",
            vault: "zxczxcxzhcxz",
            btcAddress: "78443543fdsf",
            lockedDot: "0.04",
            lockedBtc: "2.0",
            collateralization: 250,
            status: "Ok"
        },{
            id: "1",
            vault: "cczxczxcxzhcxz",
            btcAddress: "78443543fdsf,78443543abcd",
            lockedDot: "4.0",
            lockedBtc: "0.02",
            collateralization: 130,
            status: "Theft"
        },{
            id: "1",
            vault: "ddzxczxcxzhcxzsdfds",
            btcAddress: "1234dsafs,dsadsadsad12332131,232132132131dsadsadsa",
            lockedDot: "12.0",
            lockedBtc: "12.0",
            collateralization: 100,
            status: "Liquidation"
        }]);
        setStatus("Ok");
    },[]);

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
                                <th>Id</th>
                                <th>Vault</th>
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
                                    <td>{vault.id}</td>
                                    <td>{vault.vault}</td>
                                    <td>{vault.btcAddress}</td>
                                    <td>{vault.lockedDot}</td>
                                    <td>{vault.lockedBtc}</td>
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