import React, { useState } from "react";
import { Table, Button, OverlayTrigger, Tooltip, Form, Card, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { useGetManufactutrerDeletedDataQuery } from "../../redux/features/catalogueEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";



export const SoftDelete = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const { data, isError, error, isLoading, isFetching, isSuccess } = useGetManufactutrerDeletedDataQuery()
    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }
    if (isSuccess) {
        const COLUMNS = [
            {
                name: "#",
                selector: (row) => row.id,
            },
            {
                name: "Marketer/Manufacturer Name",
                selector: (row) => row.manufacturer_name,
            },
            {
                name: "Status",
                selector: (row) => row.status,
                cell: (row) => {
                    const [checked, setChecked] = useState(row?.status);
                    const handleStatusChange = () => {
                        setChecked(!checked);
                        console.log(checked);
                    };
                    return (
                        <label className="custom-switch">
                            <input
                                type="checkbox"
                                className="custom-switch-input"
                                onChange={handleStatusChange}
                                checked={checked}
                            />
                            <span className="custom-switch-indicator custum-green-btn"></span>
                        </label>
                    )
                },
            },
            {
                name: "Action",
                cell: (row) => (
                    <div className="action_icon_wrapper">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
                            <Button onClick={() => alert(`Data with id ${id} is restored.`)} className="btn btn-icon btn-warning"
                                variant=""
                            >
                                <i className="fa fa-refresh"></i>
                            </Button>

                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button
                                className="btn btn-icon btn-danger" variant=""
                                onClick={() =>
                                    dispatch(openModal({ componentName: "Delete", data: id }))
                                }
                            >
                                <i className="fe fe-trash text-light"></i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                ),
            },
        ];

        const categoryData = data?.data?.getDeleted
        const filteredData = categoryData.filter((item) =>
            item.manufacturer_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const itemsPerPage = pageSize;
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

        const displayPages = () => {
            const pageButtons = [];
            const delta = 2;
            const left = currentPage - delta;
            const right = currentPage + delta + 1;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= left && i < right)) {
                    pageButtons.push(
                        <li key={i} className={currentPage === i ? "active" : ""}>
                            <Button className="btn btn-default" variant="default" onClick={() => paginate(i)}>
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
                {/* <Row>
                    <Col>
                        <PageHeader titles="Trash" active={[`${location.state.name}-trash`]} items={["Home", `${location.state.name}`]} links={["/dashboard", "/offer/coupon"]} />
                    </Col>
                </Row> */}
                <Card>
                    <Card.Body>
                        <div className="e-table pb-5 table-responsive">
                            <Row className="m-5">
                                <Col as={Col} sm={9}>
                                    <span>Show</span>
                                    <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                                        {[10, 25, 50].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <span>Entries</span>
                                </Col>
                                <Col as={Col} sm={3}>
                                    <Form.Group className="mx-3">
                                        <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                                    </Form.Group>
                                </Col>
                            </Row>
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
                    </Card.Body>
                </Card>
            </>
        );
    }
};