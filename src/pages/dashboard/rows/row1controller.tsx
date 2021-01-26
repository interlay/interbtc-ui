import React from "react";
import polkaBTC from "../components/polkabtc";
import collateralLocked from "../components/collaterallocked";

const Row1Controller = (): React.ReactElement => {
    return (
        <div className="row-grid">
            <polkaBTC />
            <collateralLocked />
        </div>
    );
};

export default Row1Controller;
