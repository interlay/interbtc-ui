import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line
const userGuide = require("../assets/user-guide.md");

export default function UserGuidePage(): JSX.Element {
    const [markdown, setMarkdown] = useState("");
    const { t } = useTranslation();

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
            <section className="jumbotron text-center transparent-background static-fade-in-animation">
                <div className="container mt-5">
                    <h3 style={{ fontSize: "2em" }} className="lead text-white mt-5">
                        {t("guide.alpha_testnet")}
                    </h3>
                </div>
            </section>
            <section className="markdown white-background dahboard-min-height static-fade-in-animation">
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
