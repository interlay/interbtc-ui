import React, { useEffect, useState, ReactElement } from "react";

import "./dashboard.page.scss";
import Row1 from "./rows/row1";
import Row2 from "./rows/row2";
import Row3 from "./rows/row3";

export default function DashboardPage(): ReactElement {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setTimer((timer) => timer + 1);
        }, 1000);
    }, []);

    return (
        <div className="main-container">
            <div className="title-container">
                <div className="title-text-container">
                    <h1 className="title-text">Dashboard</h1>
                    <p className="latest-block-text">
                        Last updated <span id="time-type">{timer > 60 ? "minutes" : timer + " seconds"}</span> ago
                    </p>
                </div>
            </div>
            <div className="dashboard-items-container">
                <div className="rows-container">
                    <Row1 />
                    <div className="section-div-line"></div>
                    <Row2 />
                    <div className="section-div-line"></div>
                    <Row3 />
                </div>
            </div>
        </div>
    );
}
