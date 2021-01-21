import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import "./dashboard.page.scss";
import Row1Controller from "./rowContainers/row1Container/row1Controller";

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            <Row1Controller />
        </div>
    );
}
