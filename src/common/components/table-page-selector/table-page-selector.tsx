import React, { ReactElement } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { range } from "../../utils/utils";

type PageLinkProps = {
    page: number;
    setPage: (page: number) => void;
};

function PageLink({ page, setPage }: PageLinkProps): ReactElement {
    return (
        <span key={page} onClick={() => setPage(page)}>
            {page}&nbsp;
        </span>
    );
}

type TablePageSelectorProps = {
    totalPages: number;
    currentPage: number;
    setPage: (page: number) => void;
};

export default function TablePageSelector({ totalPages, currentPage, setPage }: TablePageSelectorProps): ReactElement {
    const pagesToDisplay = 5;
    const displayedPages = Math.min(totalPages, pagesToDisplay);
    const first = Math.max(currentPage - Math.ceil(displayedPages / 2 - 1), 1);
    const pages = range(first, first + displayedPages);

    return (
        <Row>
            <Button>Prev</Button>
            <Col sm={4}>
                {pages[0] !== 1 ? (
                    <>
                        <PageLink {...{ page: 1, setPage }} />
                        {"\u2026"}&nbsp;
                    </>
                ) : (
                    ""
                )}
                {pages.map((page) => (
                    <PageLink {...{ page, setPage }} />
                ))}
                {pages[pages.length - 1] !== totalPages ? (
                    <>
                        <PageLink {...{ page: totalPages, setPage }} />
                        {"\u2026"}
                    </>
                ) : (
                    ""
                )}
            </Col>
            <Button>Next</Button>
        </Row>
    );
}
