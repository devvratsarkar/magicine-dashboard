import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Loader from "../layouts/layoutcomponents/loader";
import { useGetContactEnquiryQuery } from "../redux/features/customerDataEndPoints";

export const ContactEnquiryDataTable = () => {
    const [serialNumber, setSerialNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [query, setQuery] = useState({
        name: "",
        email: "",
        fromDate: "",
        toDate: ""
    });

    const handleSubmitClick = (e) => {
        e.preventDefault();
        setQuery({ name, email, fromDate, toDate });
    };

    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetContactEnquiryQuery(query);

    const COLUMNS = [
        {
            name: "#",
            selector: (row, index) => index + serialNumber,
            sortable: true,
        },
        {
            name: "Customer Name",
            selector: (row) => row?.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row?.email,
            sortable: true,
        },
        {
            name: "Contact No.",
            selector: (row) => row?.contact_no,
            sortable: true,
        },
        {
            name: "Message",
            selector: (row) => row?.message,
            sortable: true,
        },
        {
            name: "Enquired On",
            selector: (row) => row?.enquired_on,
            sortable: true,
        },
    ];

    const productsData = data?.data || [];
    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(productsData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productsData.slice(indexOfFirstItem, indexOfLastItem);

    const displayPages = () => {
        const pageButtons = [];
        const delta = 2;
        const left = currentPage - delta;
        const right = currentPage + delta + 1;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i < right)) {
                pageButtons.push(
                    <li key={i} className={currentPage === i ? "active" : ""}>
                        <Button className="btn btn-default" variant={currentPage === i ? "primary" : "default"} onClick={() => paginate(i)}>
                            {i}
                        </Button>
                    </li>
                );
            } else if (i === left - 1 || i === right + 1) {
                pageButtons.push(<li key={i} className="ellipsis_pagination">......</li>);
            }
        }
        return pageButtons;
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className="e-table pb-5 table-responsive">
                <Row className="justify-content-end mt-3 mx-2 align-items-center">
                    <Col>
                        <div className="d-block ms-5">
                            <span>Show</span>
                            <select
                                className="mx-2"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                            >
                                {[10, 25, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span>Entries</span>
                        </div>
                    </Col>
                </Row>
                <Form className="mb-4" onSubmit={handleSubmitClick}>
                    <Row className="mt-5 mx-2" style={{ rowGap: "5px" }}>
                        <Col lg={3} md={6} sm={6} xs={12}>
                            <Form.Control
                                placeholder="Search By Customer Name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>
                        <Col lg={3} md={6} sm={6} xs={12}>
                            <Form.Control
                                name="email"
                                placeholder="Search By Email ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Col>
                        <Col lg={2} md={4} sm={4} xs={12}>
                            <Form.Control
                                name="fromDate"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Col>
                        <Col lg={2} md={4} sm={4} xs={12}>
                            <Form.Control
                                name="toDate"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Button type="submit" className="w-100">
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <DataTable
                    data={currentItems}
                    columns={COLUMNS}
                    striped
                    pagination={false}
                />
                <div className="pagination_wrapper">
                    <ul className="pagination">
                        <li>
                            <Button className="btn btn-default" variant="default" onClick={prevPage}>
                                <i className="fa fa-angle-left"></i> Previous
                            </Button>
                        </li>
                        {displayPages()}
                        <li>
                            <Button className="btn btn-default" variant="default" onClick={nextPage}>
                                Next <i className="fa fa-angle-right"></i>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
