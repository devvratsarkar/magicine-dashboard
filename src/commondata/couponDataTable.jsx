import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useGetCouponUsageDataQuery } from "../redux/features/catalogueEndPoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import moment from "moment";

export const CouponUsageDataTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetCouponUsageDataQuery();

    if (isLoading || isFetching) return <Loader />;
    if (isError) return <Error error_mes={error} />;

    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row, index) => index + 1,
                sortable: true
            },
            {
                name: "User Name",
                selector: (row) => row?.user?.name || "N/A",
                sortable: true
            },
            {
                name: "Order Number",
                selector: (row) => `#${row?.order?.order_number || "N/A"}`,
                sortable: true
            },
            {
                name: "Coupon Code",
                selector: (row) => row?.coupon?.couponCode || "N/A",
                sortable: true
            },
            {
                name: "Coupon Type",
                selector: (row) => row?.coupon?.couponType || "N/A",
                sortable: true
            },
            {
                name: "Coupon Value",
                selector: (row) => row?.coupon?.value || "N/A",
                sortable: true
            },
            {
                name: "Amount Used",
                selector: (row) => `Rs. ${row?.amount?.toFixed(2) || "0.00"}`,
                sortable: true
            },
            {
                name: "Created At",
                selector: (row) => row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY [at] hh:mm A") : "N/A",
                sortable: true
            },
        ];

        const couponData = data?.data || [];

        // **Updated Filter Logic**: Checks all fields in DataTable
        const filteredData = couponData.filter((item) => {
            const search = searchTerm.trim().toLowerCase();
            return (
                item?.user?.name?.toLowerCase().includes(search) ||
                item?.order?.order_number?.toString().toLowerCase().includes(search) ||
                item?.coupon?.couponCode?.toLowerCase().includes(search) ||
                item?.coupon?.couponType?.toLowerCase().includes(search) ||
                item?.coupon?.value?.toString().toLowerCase().includes(search) ||
                item?.amount?.toFixed(2)?.toString().toLowerCase().includes(search) ||
                moment(item?.createdAt).format("DD-MM-YYYY [at] hh:mm A").toLowerCase().includes(search)
            );
        });

        const totalPages = Math.ceil(filteredData.length / pageSize);
        const indexOfLastItem = currentPage * pageSize;
        const indexOfFirstItem = indexOfLastItem - pageSize;
        const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

        const paginate = (pageNumber) => setCurrentPage(pageNumber);
        const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
        const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

        return (
            <>
                <div className="e-table pb-5 table-responsive">
                    <Row className="m-5">
                        <Col sm={9}>
                            <span>Show</span>
                            <select className="mx-2" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                                {[10, 25, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span>Entries</span>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mx-3">
                                <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <DataTable data={currentItems} columns={COLUMNS} striped />

                    <div className="pagination_wrapper">
                        <div className="ms-3 fw-bold mt-3">Total :- <span>{filteredData?.length}</span></div>
                        <ul className="pagination">
                            <li>
                                <Button className="btn btn-default" variant="default" disabled={currentPage === 1} onClick={prevPage}>
                                    {"< Previous"}
                                </Button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={currentPage === i + 1 ? "active" : ""}>
                                    <Button className="btn btn-default" variant={currentPage === i + 1 ? "primary" : "default"} onClick={() => paginate(i + 1)}>
                                        {i + 1}
                                    </Button>
                                </li>
                            ))}
                            <li>
                                <Button className="btn btn-default" variant="default" disabled={currentPage === totalPages} onClick={nextPage}>
                                    {"Next >"}
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }
};
