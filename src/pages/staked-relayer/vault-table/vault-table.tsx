import React, { ReactElement, useState, useEffect } from "react";

export default function VaultTable(): ReactElement{
    const [vaultStatus,setStatus] = useState(false);
    const [vaults,setVaults] = useState([{}]);

    useEffect(()=>{
        setVaults([{
            id: "1",
            vault: "zxczxcxzhcxz",
            btcAddress: "78443543fdsf",
            lockedDot: "0.04",
            lockedBtc: "2.0",
            collateralization: "200%",
            status: "Ok"
        },{
            id: "1",
            vault: "cczxczxcxzhcxz",
            btcAddress: "78443543fdsf,78443543abcd",
            lockedDot: "4.0",
            lockedBtc: "0.02",
            collateralization: "150%",
            status: "Theft"
        },{
            id: "1",
            vault: "ddzxczxcxzhcxzsdfds",
            btcAddress: "1234dsafs,dsadsadsad12332131,232132132131dsadsadsa",
            lockedDot: "12.0",
            lockedBtc: "12.0",
            collateralization: "100%",
            status: "Liquidation"
        }]);
        setStatus(true);
    },[]);

    return <div className="vault-table">
        <div className="row">
            <div className="col-12">
                <div className="header">
                    Vault Status: Ok &nbsp;<div className="green-circle"></div>{vaultStatus}
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
                                    <td>{vault.collateralization}</td>
                                    <td>{vault.status}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}