import React, { useEffect, useState } from "react";
import { Col, Accordion, Row, Card } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

// eslint-disable-next-line
const faq = require("../assets/faq.json");

export default function FaqPage(): JSX.Element {

    return (
        <div>
            <section className="jumbotron text-center transparent-background">
                <div className="container mt-5">
                    <h3 style={{ fontSize: "2em" }} className="lead text-white mt-5">
                        Frequently Asked Questions
                    </h3>
                </div>
            </section>
            <section className="markdown white-background">
                <div className="container mt-5 pb-5">
                    <Row className="mt-5">
                        <Col xs="12" lg={{ span: 8, offset: 2 }} className="text-left mt-5">
                            {faq.map(q => (
                                <Accordion key={{ q.id }}>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={{ q.id }}>
                                            <Card.Title style={{ fontSize: "1.1em" }}>{{ q.q }}</Card.Title>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {{ q.a }}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            ))}
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    );
}
