import React, { ReactElement } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { range } from "../../utils/utils";
import { useTranslation } from "react-i18next";

type PageLinkProps = {
    page: number;
    setPage: (page: number) => void;
};

function PageLink({ page, setPage }: PageLinkProps): ReactElement {
    return (
        <span key={page} onClick={() => setPage(page)}>
            {page + 1}&nbsp;
        </span>
    );
}

type TablePageSelectorProps = {
    totalPages: number;
    currentPage: number;
    setPage: (page: number) => void;
};

export default function TablePageSelector({ totalPages, currentPage, setPage }: TablePageSelectorProps): ReactElement {
    const { t } = useTranslation();

    if (totalPages <= 1) totalPages = 1;

    const displayedPages = 5;
    //    const displayedPages = Math.min(totalPages, pagesToDisplay);
    const first = Math.max(currentPage - Math.ceil(displayedPages / 2 - 1), 0);
    const last = Math.min(first + displayedPages, totalPages);
    const pages = range(first, last);

    return (
        <Row className="justify-content-between">
            <Button onClick={() => setPage(Math.max(currentPage - 1, 0))}>{t("prev")}</Button>
            <Col sm={4}>
                {pages[0] !== 0 ? (
                    <>
                        <PageLink {...{ page: 0, setPage }} />
                        {"\u2026"}&nbsp;
                    </>
                ) : (
                    ""
                )}
                {pages.map((page) => (
                    <PageLink key={page} {...{ page, setPage }} />
                ))}
                {pages[pages.length - 1] !== totalPages - 1 ? (
                    <>
                        {"\u2026"}
                        <PageLink {...{ page: totalPages - 1, setPage }} />
                    </>
                ) : (
                    ""
                )}
            </Col>
            <Button onClick={() => setPage(Math.min(currentPage + 1, totalPages - 1))}>{t("next")}</Button>
        </Row>
    );
}
