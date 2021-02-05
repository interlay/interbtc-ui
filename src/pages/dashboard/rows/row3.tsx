import React from "react";
import ActiveVaults from "../components/active-vaults";
import ActiveStakedRelayers from "../components/active-staked-relayers";
import ActiveCollators from "../components/active-collators";
const Row3 = (): React.ReactElement => {
    return (
        <div className="row-grid section-top-gap">
            <ActiveVaults linkButton={true} />
            <ActiveStakedRelayers linkButton={true} />
            <ActiveCollators />
        </div>
    );
};

export default Row3;
