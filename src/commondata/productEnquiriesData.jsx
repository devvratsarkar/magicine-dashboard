import React, { useState } from "react";
import {
    Button,
    OverlayTrigger,
    Table,
    Tooltip,
    Row,
    Col,
    Form,
} from "react-bootstrap";

import { useGetAllProductEnquiryQuery } from "../redux/features/customerDataEndPoints";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Loader from "../layouts/layoutcomponents/loader";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";




export const ProductEnquiriesData = () => {
    const [queryParam, setQueryParam] = useState({
        name: "",
        email: "",
        productName: "",
        fromDate: "",
        toDate: ""
    })

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [productName, setProductName] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")

    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllProductEnquiryQuery(queryParam)
    const [serialNumber, setSerialNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const handleFilterSubmit = (e) => {
        e.preventDefault()
        setQueryParam({ name, email, productName, fromDate, toDate })
    }

    const handleExport = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/export-product-query`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'product-enquiry.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success("Products enquiry exported successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };




    const COLUMNS = [
        {
            name: "#",
            selector: (row, index) => index + serialNumber,
            sortable: true,
        },
        {
            name: "Product Enquired",
            sortable: true,
            cell: (row) => (<Link to={`/catalogue/edit-product/${row?.id}`} >{row?.product_name}</Link>)
        },
        {
            name: "Product Image",
            selector: (row) => row?.product_img,
            cell: (row) => (
                <img src={row.product_img} width={75} height={75} />
            )
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
            name: "City",
            selector: (row) => row?.city,
            sortable: true,
        },
        {
            name: "State",
            selector: (row) => row?.state,
            sortable: true,
        },
        {
            name: "Country",
            selector: (row) => row?.country,
            sortable: true,
        },
        {
            name: "Postal Code",
            selector: (row) => row?.postal_code,
            sortable: true,
        },
        {
            name: "Enquired On.",
            selector: (row) => row?.enquired_on,
            sortable: true,
        },
    ];


    const productsData = data?.data || []
    const filteredData = productsData?.filter((item) =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.enquired_on.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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
                                onChange={(e) => setPageSize(Number(e.target.value))}
                            >
                                {[10, 25, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                            <span>Entries</span>
                        </div>
                    </Col>
                    <Col className="text-end">
                        <Button className="btn btn-success text-white w-auto border-success" onClick={handleExport}>
                            <i className="fa fa-download"></i> Export
                        </Button>
                    </Col>
                </Row>
                <Form className="mb-3" onSubmit={handleFilterSubmit}>
                    <Row className="mt-5 mx-2" style={{ rowGap: "5px" }}>
                        <Col as={Col} lg={2} md={6} sm={6} xs={12}>
                            <Form.Control
                                placeholder="Search By Customer Name"
                                name="search-customer-name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>
                        <Col as={Col} lg={2} md={6} sm={6} xs={12}>
                            <Form.Control
                                name="search-email"
                                placeholder="Search By Product Name"
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Col>
                        <Col as={Col} lg={2} md={6} sm={6} xs={12}>
                            <Form.Control
                                name="search-email"
                                placeholder="Search By Email ID"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Col>
                        <Col as={Col} lg={2} md={6} sm={6} xs={12}>
                            <Form.Control
                                name="payment_status"
                                type="date"
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Col>
                        <Col as={Col} lg={2} md={6} sm={6} xs={12}>
                            <Form.Control
                                name="payment_status"
                                type="date"
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </Col>
                        <Col as={Col} lg={2} md={6} sm={6} xs={12}>
                            <Button
                                type="submit"
                                className="w-100"
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <DataTable data={currentItems} columns={COLUMNS} striped />
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

