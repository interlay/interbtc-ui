import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import "./dashboard.page.scss";
import Row1Controller from "./rows/row1controller";

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            <Row1Controller />
        </div>
    );
}
