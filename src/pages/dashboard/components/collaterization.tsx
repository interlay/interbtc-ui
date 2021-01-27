import React from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";

const Collaterization = () => {
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_blue").colour}` }}>Collaterization</h1>
                    <h2>5400%</h2>
                    <h2>Target: 150%</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view collators" propsButtonColor="d_blue" />
                </div>
            </div>
            <div className="circle-container">
                <div
                    className="status-circle"
                    style={{ borderColor: `${getAccents("d_blue").colour}` }}
                    id="relay-circle"
                >
                    <h1
                        className="h1-xl-text"
                        style={{ color: `${getAccents("d_blue").colour}` }}
                        id="relay-circle-text"
                    >
                        32,100 BTC capacity
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Collaterization;
