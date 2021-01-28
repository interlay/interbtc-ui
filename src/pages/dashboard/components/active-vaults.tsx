import React from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import SingleAxisChartComponent from "./singleaxis-chart-component";
const ActiveVaults = () => {
    const data = [7, 8, 9, 2, 3, 4, 5];
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_pink").colour}` }}>Active Vaults</h1>
                    <h2>12</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view all vaults" propsButtonColor="d_pink" />
                </div>
            </div>
            <SingleAxisChartComponent
                chartId="active-vaults"
                colour="d_pink"
                label="Total active vaults"
                chartData={data}
            />
        </div>
    );
};

export default ActiveVaults;
