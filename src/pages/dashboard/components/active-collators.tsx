import React, { ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import LineChartComponent from "./line-chart-component";
import { range } from "../../../common/utils/utils";
const ActiveCollators = (): ReactElement => {
    // this function should be removed once real data is pulled in
    const dateToMidnightTemp = (date: Date): Date => {
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        return date;
    };
    const data = [1, 1, 1, 1, 1];
    const dates = range(0, 5).map((i) =>
        dateToMidnightTemp(new Date(Date.now() - 86400 * 1000 * i)).toLocaleDateString()
    );
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_blue").colour}` }}>Active Collators</h1>
                    <h2>1</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view collators" propsButtonColor="d_blue" />
                </div>
            </div>
            <LineChartComponent
                colour="d_blue"
                label="Total active collators"
                yLabels={dates}
                yAxisProps={{ beginAtZero: true }}
                data={data}
            />
        </div>
    );
};

export default ActiveCollators;
