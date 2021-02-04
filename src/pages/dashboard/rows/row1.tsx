import React from "react";
import PolkaBTC from "../components/polkabtc";
import CollateralLocked from "../components/collateral-locked";
import Collateralization from "../components/collateralization";

const Row1 = (): React.ReactElement => {
    return (
        <div className="row-grid section-bottom-gap">
            <PolkaBTC linkButton={true} />
            <CollateralLocked linkButton={true} />
            <Collateralization linkButton={true} />
        </div>
    );
};

export default Row1;
