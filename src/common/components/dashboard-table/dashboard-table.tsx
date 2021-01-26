import { ReactElement, useMemo } from "react";
import { Table } from "react-bootstrap";
import React from "react";
import { TableDisplayParams } from "../../types/util.types";
import TablePageSelector from "../table-page-selector/table-page-selector";

type DataWithID = { id: string };

type DashboardTableProps<D extends DataWithID> = {
    data: D[];
    tableParams: TableDisplayParams;
    setTableParams: (params: TableDisplayParams) => void;
    headings: string[];
    dataPointDisplayer: (dataPoint: D) => string[];
};

export default function DashboardTable<D extends DataWithID>({
    data,
    tableParams,
    setTableParams,
    headings,
    dataPointDisplayer,
}: DashboardTableProps<D>): ReactElement {
    const totalPages = useMemo(() => Math.ceil(data.length / tableParams.perPage), [data, tableParams]);
    const setPage = useMemo(() => (page: number) => setTableParams({ ...tableParams, page }), [
        setTableParams,
        tableParams,
    ]);

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        {headings.map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((dataPoint) => (
                        <tr key={dataPoint.id}>
                            {dataPointDisplayer(dataPoint).map((data, i) => (
                                <td key={i}>{data}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <TablePageSelector totalPages={totalPages} currentPage={tableParams.page} setPage={setPage} />
        </>
    );
}
