import React from "react";
import { Col, Accordion, Row, Card } from "react-bootstrap";
import questions from "../assets/faq.json";
import { useTranslation } from "react-i18next";

type Question = {
    id: number;
    question: string;
    answer: string;
};

export default function FaqPage(): JSX.Element {
    const { t } = useTranslation();

    return (
        <div>
            <section className="jumbotron text-center transparent-background static-fade-in-animation">
                <div className="container mt-5">
                    <h3 style={{ fontSize: "2em" }} className="lead text-white mt-5">
                        {t("faq.faq")}
                    </h3>
                </div>
            </section>
            <section className="markdown white-background static-fade-in-animation">
                <p></p>
                <div className="container mt-5 pb-5">
                    <Row className="mt-5">
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left mt-5">
                            {questions.map((qes: Question) => (
                                <Accordion key={qes.id.toString()} className="mt-2">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={qes.id.toString()}>
                                            <Card.Title style={{ fontSize: "1.1em" }}>{qes.question}</Card.Title>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={qes.id.toString()}>
                                            <Card.Body>{qes.answer}</Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            ))}
                            <p className="mt-2">
                                {t("faq.more_questions")}{" "}
                                <a href="https://discord.gg/C8tjMbgVXh">{t("faq.join_discord")}</a> {t("faq.ask_away")}
                            </p>
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    );
}
