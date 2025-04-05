import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/allModalSlice";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import { useGetAllMediaQuery } from "../redux/features/MediaEndPoints";
import { MEDIA_BASE_URL } from "../utils/config";

export const MediaDataTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")

    const [query, setQuery] = useState({
        fromDate: "",
        toDate: ""
    })

    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllMediaQuery(query);


    const handleSubmitSearch = (e) => {
        e.preventDefault();
        if (!fromDate || !toDate) {
            toast.error("Please select both From Date and To Date.");
            return;
        }
        setQuery({ fromDate, toDate });
    };

    const role = localStorage.getItem("role");
    const permissions = JSON.parse(localStorage.getItem("permissions"));

    const showDelete = role === "Admin" || (role === "Staff" && permissions.Media.includes("delete"));

    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    const handleCopy = (url) => {
        const base_path = url.split(".com/")

        navigator.clipboard.writeText(base_path[1])
            .then(() => {
                toast.success("URL copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
                toast.error("Failed to copy URL.");
            });
    };

    if (isSuccess) {
        const mediaData = Array.isArray(data?.data) ? data.data : [];

        const filteredMediaData = searchTerm
            ? mediaData.filter((item) => item?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : mediaData;

        console.log("filteredMediaData", filteredMediaData)

        const totalPages = Math.ceil(filteredMediaData.length / pageSize);
        const indexOfLastItem = currentPage * pageSize;
        const indexOfFirstItem = indexOfLastItem - pageSize;
        const currentItems = filteredMediaData.slice(indexOfFirstItem, indexOfLastItem);

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
                } else if (i === left - 1 || i === right) {
                    pageButtons.push(<li key={i} className="ellipsis_pagination">...</li>);
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
            <div className="e-table pb-5 table-responsive">
                <Row>
                    <Form onSubmit={handleSubmitSearch}>
                        <Row>
                            <Col as={Col} md={4}>
                                <Form.Group>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={4}>
                                <Form.Group>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={2} className="m-auto">
                                <Button type="submit" >Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </Row>
                <Row className="justify-content-between mt-3 mx-2 align-items-center mb-5">
                    <Col sm={6} xs={12} >
                        <div className="d-block ms-5">
                            <span>Show</span>
                            <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                                {[10, 25, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span>Entries</span>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <Form.Control type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} />
                    </Col>
                </Row>
                <Row className="justify-content-end">
                    <Col sm={3}>
                        {/* <Form.Group className="m-3">
                            <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                        </Form.Group> */}
                    </Col>
                </Row>
                <Row className="justify-content-around">
                    {currentItems?.map((item) => (
                        <Col md={3} key={item?.id} className="shadow-sm p-3 mb-5 bg-white rounded-3 justify-content-around p-4">
                            <div className="mb-2">
                                <Form.Control
                                    disabled
                                    defaultValue={item.name}
                                />
                            </div>
                            <div className="mb-2 w-full d-flex justify-content-center" style={{ height: "90px" }}>
                                <img src={`${item.image}`} width={90} height={90} alt="Media" />
                            </div>
                            {/* <Row className="mb-3">
                                <Form.Control type="text" disabled defaultValue={item.name} />
                            </Row> */}
                            <Row className="px-4">
                                <Col md={4}>
                                    <Button type="button" className="btn btn-icon btn-primary" variant="" onClick={() => dispatch(openModal({ componentName: 'ViewMedia', data: item }))}>
                                        <i className="fe fe-eye"></i>
                                    </Button>
                                </Col>
                                <Col md={4}>
                                    <Button type="button" className="btn btn-icon btn-warning" variant="" onClick={() => handleCopy(item?.image)}>
                                        <i className="fe fe-copy"></i>
                                    </Button>
                                </Col>
                                <Col md={4}>
                                    {showDelete && (
                                        <Button className="btn btn-icon btn-danger text-white" variant="" onClick={() => dispatch(openModal({ componentName: 'DeleteMedia', data: item }))}>
                                            <i className="fe fe-trash"></i>
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    ))}
                </Row>
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
        );
    }

    return null;
};