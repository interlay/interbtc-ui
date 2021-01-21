import React from "react";
import ButtonComponent from "../../../buttonComponent";
import { d_yellow } from "../../../d-colors";
const PolkaBTC = (): React.ReactElement => {
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1>Issued</h1>
                    <h2>232.4 PolkaBTC</h2>
                    <h2>$17,0030</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view all issued" buttonColorName={`${d_yellow}`} />
                </div>
            </div>
        </div>
    );
};

export default PolkaBTC;
