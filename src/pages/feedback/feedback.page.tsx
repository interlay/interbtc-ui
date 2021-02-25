import React, { useState, useEffect, ReactElement } from "react";




export default function FeedbackPage(): ReactElement {


    return (
        <div className="main-container">
            <div className="title-container mb-2">
                <div className="title-text-container">
                    <h1 className="title-text">Feedback</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card" style={{ minHeight: "100px" }}>
                                <div className="card-body text-center">
                                    <a
                                        className="nav-link"
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSedpEXQ3X8mpQMieiG4ComiKEqoud-OKqhDBD84ymz4j4EQ2w/viewform?usp=sf_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h1 style={{ fontSize: "1.3em" }}>User Feedback Form  <span className="fa fa-external-link"></span> </h1>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card" style={{ minHeight: "100px" }}>
                                <div className="card-body text-center">
                                    <a
                                        className="nav-link"
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSdTwyyC62L7RBK5y2XDK0By30nFbzZICCfvfXOcLWK-qhQ74g/viewform?usp=sf_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h1 style={{ fontSize: "1.3em" }}>Vault Feedback Form  <span className="fa fa-external-link"></span> </h1>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card" style={{ minHeight: "100px" }}>
                                <div className="card-body text-center">
                                    <a
                                        className="nav-link"
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSfd3qdZ5iC5r-NdadgehG6xJd--CtJkavhtoXNYPtLgnv2XDg/viewform?usp=sf_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h1 style={{ fontSize: "1.3em" }}>Relayer Feedback Form  <span className="fa fa-external-link"></span> </h1>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-lg-4 offset-lg-2">
                            <div className="card" style={{ minHeight: "100px" }}>
                                <div className="card-body text-center">
                                    <a
                                        className="nav-link"
                                        href="https://github.com/interlay/polkabtc-ui/issues"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h1 style={{ fontSize: "1.3em" }}>Open an Issue of Github <span className="fa fa-github"></span> </h1>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card" style={{ minHeight: "100px" }}>
                                <div className="card-body text-center">
                                    <a
                                        className="nav-link"
                                        href="https://discord.gg/KgCYK3MKSf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h1 style={{ fontSize: "1.3em" }}>Discuss on Discord  <span className="fab fab-discord"></span> </h1>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}