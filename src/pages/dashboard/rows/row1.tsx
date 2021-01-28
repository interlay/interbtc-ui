import React from "react";
import PolkaBTC from "../components/polkabtc";
import CollateralLocked from "../components/collateral-locked";
import Collaterization from "../components/collaterization";

const Row1 = (): React.ReactElement => {
    return (
        <div className="row-grid">
            <PolkaBTC />
            <CollateralLocked />
            <Collaterization />
        </div>
    );
};

export default Row1;
