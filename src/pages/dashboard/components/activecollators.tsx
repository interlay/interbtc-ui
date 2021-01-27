import React from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";
import SingleAxisChartComponent from "./singleaxischartcomponent";
const ActiveCollators = () => {
    let data = [7, 8, 9, 123, 234, 400, 235];
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_blue").colour}` }}>Active Collators</h1>
                    <h2>22</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view collators" propsButtonColor="d_blue" />
                </div>
            </div>
            <SingleAxisChartComponent
                chartId="active-collators"
                colour="d_blue"
                label="Total active collators"
                chartData={data}
            />
        </div>
    );
};

export default ActiveCollators;
