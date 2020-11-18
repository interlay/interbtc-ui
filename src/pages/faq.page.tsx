import React from "react";
import { Col, Accordion, Row, Card } from "react-bootstrap";
import questions from "../assets/faq.json";

type Question = {
    id: number;
    question: string;
    answer: string;
}

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
                            {questions.map((qes: Question) => (
                                <Accordion key={qes.id}>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={qes.id.toString()}>
                                            <Card.Title style={{ fontSize: "1.1em" }}>{qes.question}</Card.Title>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {qes.answer}
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
