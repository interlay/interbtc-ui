import React from "react";
import ActiveVaults from "../components/activevaults";
import ActiveStakedRelayers from "../components/activestakedrelayers";
import ActiveCollators from "../components/activecollators";
const Row3 = (): React.ReactElement => {
    return (
        <div className="row-grid section-gap">
            <ActiveVaults />
            <ActiveStakedRelayers />
            <ActiveCollators />
        </div>
    );
};

export default Row3;
