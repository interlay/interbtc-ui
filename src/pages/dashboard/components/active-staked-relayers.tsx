import React, { ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
//import SingleAxisChartComponent from "./singleaxis-chart-component";
const ActiveStakedRelayers = (): ReactElement => {
    const displayLinkBtn = false;
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_orange").colour}` }}>Active Staked Relayers</h1>
                    <h2>12</h2>
                </div>
                {displayLinkBtn ? (
                    <div className="button-container">
                        <ButtonComponent
                            buttonName="view relayers"
                            propsButtonColor="d_orange"
                            buttonId="active-staked"
                            buttonLink="/"
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
    // <SingleAxisChartComponent
    //     chartId="active-relayers"
    //     colour="d_orange"
    //     label="Total active relayers"
    //     chartData={data}
    // />
};

export default ActiveStakedRelayers;
