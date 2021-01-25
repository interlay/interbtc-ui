import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import paperImg from "../assets/img/icons/paper-white.png";
import specImg from "../assets/img/icons/spec-white.png";
import codeImg from "../assets/img/icons/github-white.png";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line
const polkaBTCInfo = require("../assets/polkaBTCInfo.md");

export default function AboutPage(): JSX.Element {
    const [markdown, setMarkdown] = useState("");
    const { t } = useTranslation();

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
            <section className="jumbotron text-center transparent-background fade-in-animation">
                <div className="container mt-5">
                    <h3 style={{ fontSize: "2em" }} className="lead text-white mt-5">
                        {t("about.about_polkabtc")}
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
                                <h4 className="text-white">{t("about.research_paper")}</h4>
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
                                <h4 className="text-white">{t("about.specification")}</h4>
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
                                <h4 className="text-white">{t("about.source_code")}</h4>
                            </a>
                        </Col>
                    </Row>
                </Col>
            </section>
            <section className="markdown white-background static-fade-in-animation dahboard-min-height">
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
