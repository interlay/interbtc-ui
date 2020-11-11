import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_white.svg";
import paperImg from "../assets/img/icons/paper-white.png";
import specImg from "../assets/img/icons/spec-white.png";
import codeImg from "../assets/img/icons/github-white.png";

// eslint-disable-next-line
const userGuide = require("../assets/user-guide.md");

export default function UserGuidePage(): JSX.Element {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch(userGuide)
            .then((response) => {
                const text = response.text();
                return text;
            })
            .then((data) => {
                setMarkdown(data);
            });
    }, [markdown]);

    return (
        <div>
            <section className="jumbotron text-center transparent-background">
                <div className="container mt-5">
                    <h3 style={{ fontSize: "2em" }} className="lead text-white mt-5">
                        PolkaBTC User Guide (Alpha)
                    </h3>
                </div>
            </section>
            <section className="markdown white-background">
                <div className="container mt-5 pb-5">
                    <Row className="mt-5">
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left mt-5">
                            <ReactMarkdown source={markdown} escapeHtml={false} />
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    );
}
