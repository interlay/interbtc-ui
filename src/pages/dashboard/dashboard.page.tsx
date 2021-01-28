import React from "react";

import "./dashboard.page.scss";
import Row1 from "./rows/row1";
import Row2 from "./rows/row2";
import Row3 from "./rows/row3";

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            {/* <h1 className="title-text">Dashboard</h1> */}
            <div className="rows-container">
                <Row1 />
                <Row2 />
                <Row3 />
            </div>
        </div>
    );
}
