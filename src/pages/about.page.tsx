import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_white.svg";
import paperImg from "../assets/img/icons/paper-white.png";
import specImg from "../assets/img/icons/spec-white.png";
import codeImg from "../assets/img/icons/github-white.png";

// eslint-disable-next-line
const polkaBTCInfo = require("../assets/polkaBTCInfo.md");

export default function AboutPage(): JSX.Element {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch(polkaBTCInfo)
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
                        About PolkaBTC
                    </h3>
                </div>
                <Col xs="12" lg={{ span: 6, offset: 3 }}>
                    <Row className="mt-5">
                        <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                            <a
                                className="link d-inline text-white"
                                href="https://eprint.iacr.org/2018/643"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image src={paperImg} width="64" />
                                <h4 className="text-white">Research Paper</h4>
                            </a>
                        </Col>
                        <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                            <a
                                className="link d-inline text-white"
                                href="https://interlay.gitlab.io/polkabtc-spec/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image src={specImg} width="64" />
                                <h4 className="text-white">Specification</h4>
                            </a>
                        </Col>
                        <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                            <a
                                className="link d-inline text-white"
                                href="https://github.com/interlay/BTC-Parachain"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image src={codeImg} width="64" />
                                <h4 className="text-white">Source Code</h4>
                            </a>
                        </Col>
                    </Row>
                </Col>
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
