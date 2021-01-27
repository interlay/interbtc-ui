import React from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";
import SingleAxisChartComponent from "./singleaxischartcomponent";
const ActiveStakedRelayers = () => {
    let data = [7, 8, 9, 123, 234, 400, 235];
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_orange").colour}` }}>Active Staked Relayers</h1>
                    <h2>12</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view relayers" propsButtonColor="d_orange" />
                </div>
            </div>
            <SingleAxisChartComponent
                chartId="active-relayers"
                colour="d_orange"
                label="Total active relayers"
                chartData={data}
            />
        </div>
    );
};

export default ActiveStakedRelayers;
