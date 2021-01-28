import React, { ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import SingleAxisChartComponent from "./singleaxis-chart-component";
const ActiveCollators = (): ReactElement => {
    // this function should be removed once real data is pulled in
    const dateToMidnightTemp = (date: Date): number => {
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        return date.getTime();
    };
    const CONSTANT_COLLATOR_COUNT = 1;
    const data = [
        { date: dateToMidnightTemp(new Date(Date.now() - 84600 * 1000 * 0)), amount: CONSTANT_COLLATOR_COUNT },
        { date: dateToMidnightTemp(new Date(Date.now() - 84600 * 1000 * 1)), amount: CONSTANT_COLLATOR_COUNT },
        { date: dateToMidnightTemp(new Date(Date.now() - 84600 * 1000 * 2)), amount: CONSTANT_COLLATOR_COUNT },
        { date: dateToMidnightTemp(new Date(Date.now() - 84600 * 1000 * 3)), amount: CONSTANT_COLLATOR_COUNT },
        { date: dateToMidnightTemp(new Date(Date.now() - 84600 * 1000 * 4)), amount: CONSTANT_COLLATOR_COUNT },
    ];
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
